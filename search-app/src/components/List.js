import React from "react"

export default function List(props) {

    const formatter = new Intl.NumberFormat('en-US', {
        minimumFractionDigits: 2,      
        maximumFractionDigits: 2,
    })

    if (props.results === null) {
        return (
            null
        )
    }
    else if (props.results.length === 0) {
        return (
            <p className="m-3">Searching...</p>
        )
    }
    else if (props.results[0][0] === "") {
        return (
            <p className="m-3">No results found.</p>
        )
    }
    else {
        return (
            <ul className="list-group list-group-flush">
                {props.results.map((result, index) =>
                    <li id={index} className="list-group-item list-group-item-action text-break">
                        <a href={result[6]} className="result-title" target="_blank" rel="noreferrer">
                            {result[2] === "" ? result[3] : result[2]}
                        </a>
                        <p className="result-score">{result[4].replace("http://www.sydney.edu.au/ont/", "")}</p>
                        <p className="result-score">Score: {formatter.format(result[1])}</p>
                        <p className="result-desc">{result[5]}</p>
                        <a href={result[5]} className="result-link" target="_blank" rel="noreferrer">{result[6]}</a>
                    </li>
                )}
            </ul>
        )
    }
}