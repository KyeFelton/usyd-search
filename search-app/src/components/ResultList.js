import React from "react"

function ResultList() {

    const resultData = [
        
        {
            key: 1,
            heading: "Heading",
            description: "Description...",
            url: "https://www.sydney.edu.au"
        }
    ]
    
    const results = resultData.map(result =>
        <li className="list-group-item">
            <h2>{result.heading}</h2>
            <p>{result.description}</p>
            <a href={result.url}>{result.url}</a>
        </li>)

    return (
        <ul className="list-group list-group-flush">
            {results}
        </ul>
    )
}

export default ResultList