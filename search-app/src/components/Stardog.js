import axios from "axios"
import { readString } from "react-papaparse"


const URL = "http://localhost:5820/usyd/query"
const AUTH = { username: "reader", password: "usyd" }
const HEADERS = { "Accept": "application/json-ld, text/csv" }


export async function entitySearch(uri) {
    let results = null
    let sparql = `
        prefix stardog: <tag:stardog:api:property:>
        prefix ont: <http://www.sydney.edu.au/ont/>
        prefix owl: <http://www.w3.org/2002/07/owl#>
        prefix rdfs: <http://www.w3.org/2000/01/rdf-schema#>
        
        SELECT ?pX
        ?o 
        (SAMPLE(?oname) AS ?oname)
        (SAMPLE(?olabel) AS ?olabel) WHERE {
            {
                SELECT ?p ?o WHERE {
                    <${uri}> ?p ?o .
                }
            }
            OPTIONAL { ?o ont:name ?oname . }
            OPTIONAL { ?o rdfs:label ?olabel . }
            BIND(REPLACE(str(?p), "http://www.sydney.edu.au/ont/", "", "i") AS ?pX)
        }
        GROUP BY ?pX ?o
        ORDER BY asc(?pX)
    `
    
    results = await axios.get(URL, { params: { query: sparql }, auth: AUTH, headers: HEADERS })
        .then(response => {
            let res = readString(response.data).data
            res.shift()
            res.pop()

            // Convert to map to group objects of the same predicate
            let dict = new Map()
            for (let row of res) {
                let k = row.shift()
                
                // if (propertiesOfInterest.includes(k)) {
                    
                // Standardise property names
                if (k.includes('http:')) {
                    k = k.split('#')[1]
                }
                k = k.replace(/([A-Z])/g, " $1")
                k = k.charAt(0).toUpperCase() + k.slice(1)

                if (!dict.has(k)) {
                    dict.set(k, [])
                }
                dict.get(k).push(row)
            }

            function extractAttr(d, ...attr_names) {
                let res = null
                for (let name of attr_names) {
                    if (res === null && d.get(name)) {
                        if (Array.isArray(d.get(name)[0])){
                            res = d.get(name)[0][0]
                        }
                        else {
                            res = d.get(name)[0]
                        }
                    }
                    d.delete(name)
                }
                return res
            }

            return {
                name: extractAttr(dict, 'Name', 'Label'),
                type: extractAttr(dict, 'Type'),
                homepage: extractAttr(dict, 'Homepage', 'Website'),
                summary: extractAttr(dict, 'Summary', 'Description'),
                objs: [...dict.entries()]
            }
        })
        .catch(err => {
            console.log(err)
            alert(err)
            return null
        })

    if (results.length !== null) {
        sparql = `
            prefix stardog: <tag:stardog:api:property:>
            prefix ont: <http://www.sydney.edu.au/ont/>
            prefix owl: <http://www.w3.org/2002/07/owl#>
            prefix rdfs: <http://www.w3.org/2000/01/rdf-schema#>
            
            SELECT ?pX
            ?s
            (SAMPLE(?sname) AS ?sname)
            (SAMPLE(?slabel) AS ?slabel) WHERE {
                {
                    SELECT ?s ?p WHERE {
                        ?s ?p <${uri}> .
                    }
                }
                OPTIONAL { ?s ont:name ?sname . }
                OPTIONAL { ?s rdfs:label ?slabel . }
                BIND(REPLACE(str(?p), "http://www.sydney.edu.au/ont/", "", "i") AS ?pX)
            }
            GROUP BY ?pX ?s
            ORDER BY asc(?pX)
        `
        results['subs'] =  await axios.get(URL, { params: { query: sparql }, auth: AUTH, headers: HEADERS })
            .then(response => {
                let res = readString(response.data).data
                res.shift()
                res.pop()
                let dict = new Map()
                for (let row of res) {
                    let k = row.shift()
                            
                    // Standardise property names
                    k = k.replace(/([A-Z])/g, " $1")
                    k = k.charAt(0).toUpperCase() + k.slice(1)

                    if (!dict.has(k)) {
                        dict.set(k, [])
                    }
                    dict.get(k).push(row)
                }
                return [...dict.entries()]
            }
        )
    }
    console.log(results)
    return results
}


export async function literalSearch(query, filter) {
    let results = []
    let sparql = `
        prefix fts: <tag:stardog:api:search:>
        prefix ont: <http://www.sydney.edu.au/ont/>
        prefix owl: <http://www.w3.org/2002/07/owl#>
                
        SELECT ?s (MAX(?score) AS ?score) 
            (SAMPLE(?name) AS ?name) 
            (SAMPLE(?label) AS ?label) 
            (SAMPLE(?class) AS ?class)
            (SAMPLE(?summ) AS ?summ)
            (SAMPLE(?homepage) AS ?homepage) 
            (MAX(?match) AS ?match) WHERE {
            { 
                SELECT ?score ?result WHERE {
                    SERVICE fts:textMatch {
                        [] fts:query "${query}";
                            fts:score ?score ;
                            fts:result ?result ;
                            fts:threshold 0.5;
                    } 
                }
            }
            ?s ?p ?result ; 
                ont:name ?name ; 
                rdfs:label ?label ;
                ont:homepage ?homepage ;
                a ?class .
            BIND ( IF ( LCASE(?label) = LCASE("${query}"), 1, 0 ) AS ?match ) .
            OPTIONAL { ?s ont:summary ?summ . }
            FILTER ( ?class NOT IN ( owl:Thing ) )
            ${filter}
        } 
        GROUP BY ?s 
        ORDER BY DESC(?match) DESC(?score)
        LIMIT 100
    `
    console.log(sparql)
    results = axios.get(URL, { params: { query: sparql }, auth: AUTH, headers: HEADERS })
        .then(response => {
            let res = readString(response.data).data
            res.shift()
            res.pop()
            return res
        })
        .catch(err => {
            console.log(err)
            alert(err)
            return [[""]]
        })
    
    return results
}


export async function nameSearch(query, filter) {
    let results = []
    let sparql = `
        prefix stardog: <tag:stardog:api:property:>
        prefix ont: <http://www.sydney.edu.au/ont/>
        prefix owl: <http://www.w3.org/2002/07/owl#>
        
        SELECT ?s (MAX(?score) AS ?score) 
            (SAMPLE(?name) AS ?name)
            (SAMPLE(?label) AS ?label) 
            (SAMPLE(?class) AS ?class)
            (SAMPLE(?summ) AS ?summ)
            (SAMPLE(?homepage) AS ?homepage)
            (MAX(?match) AS ?match) WHERE {

            ?s rdfs:label ?label .
            (?label ?score) stardog:textMatch "${query}" .
            BIND ( IF ( LCASE(?label) = LCASE("${query}"), 1, 0 ) AS ?match ) .

            ?s ?p ?result ; 
                ont:name ?name ; 
                ont:homepage ?homepage ;
                a ?class .
            OPTIONAL { ?s ont:summary ?summ . }
            FILTER ( ?class NOT IN ( owl:Thing ) )
            ${filter}
        }
        GROUP BY ?s 
        ORDER BY DESC(?match) desc(?score) asc(strlen(str(?name)))
        LIMIT 100
    `
    results = axios.get(URL, { params: { query: sparql }, auth: AUTH, headers: HEADERS })
        .then(response => {
            let res = readString(response.data).data
            res.shift()
            res.pop()
            return res
        })
        .catch(err => {
            console.log(err)
            alert(err)
            return [[""]]
        })
    return results
}
