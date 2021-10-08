import React from "react"

// This code is dangerous -> need to escape everything except bold

const ResultList = (props) => {

    const createMarkup = (text) => {
        return {__html: text};
    }

    const formatter = new Intl.NumberFormat('en-US', {
        minimumFractionDigits: 2,      
        maximumFractionDigits: 2,
    }); 

    return (
        <ul className="list-group list-group-flush">
            {props.results.map((result, index) =>
                <li id={index} className="list-group-item list-group-item-action text-break">
                    <a href={result[4]} className="result-title">{result[2]}</a>
                    <p className="result-score">Score: {formatter.format(result[1])}</p>
                    <p className="result-desc"><div dangerouslySetInnerHTML={createMarkup(result[3])} /></p>
                    <a href={result[4]} className="result-link">{result[4]}</a>
                </li>
            )}
        </ul>
    )
}

export default ResultList