import React from "react"

export default function List(props) {

    function handleEntityClick(uri) {
        props.updatePanel(uri)
    }

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
                        <a className="result-title" href="#header" onClick={() => handleEntityClick(result[0])}>
                            {result[2] === "" ? result[3] : result[2]}
                        </a>
                        <p className="result-class">{result[4].replace("http://www.sydney.edu.au/ont/", "")}</p>
                        <p className="result-summary">{result[5]}</p>
                        <a href={result[5]} className="result-link" target="_blank" rel="noreferrer">{result[6]}</a>
                    </li>
                )}
            </ul>
        )
    }
}