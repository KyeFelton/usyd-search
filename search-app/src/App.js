import RecomList from "./components/RecomList"
import ResultBox from "./components/ResultBox"
import ResultList from "./components/ResultList"
import axios from "axios"
import { useState } from "react"
import "./App.css"
import { readString } from "react-papaparse"
import logo from './logo.png'
import { BsSearch } from "react-icons/bs";

const App = () => {

    const url = "http://localhost:5820/usyd/query"
    const auth = { username: "user", password: "usyd" }
    const headers = { "Accept": "application/json-ld, text/csv" }

    const [results, setResults] = useState([])
    const [entity, setEntity] = useState([])
    const [query, setQuery] = useState('')

    const handleQueryChange = (event) => {
        setQuery(event.target.value)
    }

    const handleSubmit = (event) => {
        event.preventDefault()
        let ft_sparql = `
            prefix fts: <tag:stardog:api:search:>
            prefix ont: <http://www.sydney.edu.au/ont/>
            prefix owl: <http://www.w3.org/2002/07/owl#>
                    
            SELECT ?s (MAX(?score) AS ?score) 
                (SAMPLE(?name) AS ?name) 
                (SAMPLE(?highlight) AS ?highlight) 
                (SAMPLE(?homepage) AS ?homepage)
                (SAMPLE(?class) AS ?class) 
                (SAMPLE(?desc) AS ?desc) WHERE {
            
                ?s ?p ?result ; 
                    ont:name ?name ; 
                    ont:homepage ?homepage ;
                    a ?class .

                BIND(CONCAT(STR( ?p ), STR( ?highlight )) AS ?highlight ) .

                OPTIONAL { ?s ont:description ?desc . }

                FILTER ( ?class NOT IN ( owl:Thing ) )

                
                { 
                    SELECT ?score ?highlight ?result WHERE {
                        SERVICE fts:textMatch {
                            [] fts:query "${query}";
                                fts:score ?score ;
                                fts:result ?result ;
                                fts:threshold 1.0;
                                fts:highlight ?highlight 
                        } 
                    } 
                }
            } 
            GROUP BY ?s 
            ORDER BY desc(?score)
            LIMIT 50
        `
        axios.get(url, { params: { query: ft_sparql }, auth: auth, headers: headers })
            .then(response => {
                let csvResults = readString(response.data).data
                csvResults.shift()
                csvResults.pop()
                setResults(csvResults)
            })
        let ent_sparql = `
        prefix stardog: <tag:stardog:api:property:>
        prefix ont: <http://www.sydney.edu.au/ont/>
        
        SELECT ?label ?desc ?link WHERE { 
            ?uri rdfs:label ?label .
            (?label ?score) stardog:textMatch "${query}" . 
            optional { ?uri ont:homepage ?link } .
            optional { ?uri ont:description ?desc } .
        }
        order by desc(?score)
        limit 1
        `
        axios.get(url, { params: { query: ent_sparql }, auth: auth, headers: headers })
            .then(response => {
                let csvResults = readString(response.data).data
                csvResults.shift()
                setEntity(csvResults.shift())
            })
    }

    return (
        <div className="app" >
            <div className="main" >
                <header className="header container mb-3">
                    <div className="row mb-4">
                        <div className="col-sm-5 col-lg-4 col-xl-3">
                            <img src={logo} className="img-fluid" alt="Univeristy of Sydney"></img>
                        </div>
                        <div className="col-sm-7 col-lg-8 col-xl-9">
                            <p className="text-end"></p>
                        </div>
                    </div>
                    <form onSubmit={handleSubmit}>
                        <div className="input-group mb-3">
                            <input type="text" className="form-control" placeholder="Search" aria-label="Search" aria-describedby="basic-addon1" value={query} onChange={handleQueryChange} />
                            <button type="button" className="btn btn-primary" onClick={handleSubmit}>
                                <BsSearch />
                            </button>
                        </div>
                    </form>
                </header>
                <RecomList />
                <div className="container" >
                    <div className="row" >
                        <div className="col-8" >
                            <ResultList results={results} />
                        </div>
                        <div className="col-4" >
                            <ResultBox entity={entity} />
                        </div>
                    </div>
                </div>
            </div>

            <div className="error" >
                Please view on a larger screen.
            </div>
        </div>
    );
}

export default App;