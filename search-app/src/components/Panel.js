import React from "react"

export default function Panel(props) {

    function handleEntityClick(uri) {
        props.updatePanel(uri)
    }

    if (props.results === null) {
        return null
    }
    else {
        console.log(props.results)
        return (
            <div className="panel" id="panel">
                <h2 className="panel-title">{props.results.name}</h2>
                <p>{props.results.type.toString().replace("http://www.sydney.edu.au/ont/", "")}</p>
                <p className="panel-summary">{props.results.summary}</p>
                {props.results.objs.map(entry => {
                    return (
                        <div className="panel-attribute">
                            <b>{entry[0]}: </b>
                            {entry[1].map(pred => {
                                if (pred[1] !== "") {
                                    return (<>
                                        <a className="panel-object" href="#panel" onClick={() => handleEntityClick(pred[0])}>
                                            {pred[1]}
                                        </a><br /></>)
                                }
                                else if (pred[2] !== "") {
                                    return (<>
                                        <a className="panel-object" href="#panel" onClick={() => handleEntityClick(pred[0])}>
                                            {pred[2]}
                                        </a><br /></>)
                                }
                                else {
                                    if (pred[0].includes("http://www.sydney.edu.au/kg")) {
                                        return null
                                    }
                                    else if (pred[0].startsWith("http:")) {
                                        return (<><a className="panel-object" href={pred[0]} >{pred[0]}</a><br /></>)
                                    }
                                    else {
                                        return (<span className="panel-literal">{pred[0]}<br /></span>)
                                    }
                                }
                            }
                            )}
                        </div>
                    )
                })}
                {props.results.subs.map(entry => {
                    return (
                        <div className="panel-attribute">
                            <b>{entry[0]}: </b>
                            {entry[1].map(pred => {
                                if (pred[1] !== "") {
                                    return (<>
                                        <a className="panel-object" href="#panel" onClick={() => handleEntityClick(pred[0])}>
                                            {pred[1]}
                                        </a><br /></>)
                                }
                                else if (pred[2] !== "") {
                                    return (<>
                                        <a className="panel-object" href="#panel" onClick={() => handleEntityClick(pred[0])}>
                                            {pred[2]}
                                        </a><br /></>)
                                }
                                else {
                                    if (pred[0].includes("http://www.sydney.edu.au/kg")) {
                                        return null
                                    }
                                    else if (pred[0].startsWith("http:")) {
                                        return (<><a className="panel-object" href={pred[0]} >{pred[0]}</a><br /></>)
                                    }
                                    else {
                                        return (<span className="panel-literal">{pred[0]}<br /></span>)
                                    }
                                }
                            }
                            )}
                        </div>
                    )
                })}
                <div className="text-center m-4">
                    <a href={props.results.homepage} target="_blank" rel="noreferrer">
                        <button className="btn btn-primary">
                            <b>Learn more</b>
                        </button>
                    </a>
                </div>
            </div>
        )
    }
}