import React from "react"

export default function Panel(props) {

    function handleEntityClick(uri) {
        props.updatePanel(uri)
    }

    if (props.results === null) {
        return null
    }
    else {
        return (
            <div className="panel" id="panel">
                <h2 className="panel-title">
                    <a href={props.results.homepage} target="_blank" rel="noreferrer">{props.results.name}</a>
                </h2>
                <p className="panel-class">{props.results.type.toString().replace("http://www.sydney.edu.au/ont/", "")}</p>
                <p className="panel-summary">{props.results.summary}</p>
                {props.results.attr.map(entry => {
                    if (entry[0] !== "") {
                        return (
                            <div className="panel-attribute">
                                <b>{entry[0]}: </b>
                                {entry[1].map((values, i, {length}) => {
                                    let suffix = ""
                                    if (i < length - 1) {
                                        suffix = ","
                                    }
                                    if (values[1] !== "") {
                                        return (<>
                                            <a className="panel-object" href="#header" onClick={() => handleEntityClick(values[0])}>
                                                {values[1]}
                                            </a>{suffix}&nbsp;</>)
                                    }
                                    else if (values[2] !== "") {
                                        return (<>
                                            <a className="panel-object" href="#header" onClick={() => handleEntityClick(values[0])}>
                                                {values[2]}
                                            </a>{suffix}&nbsp;</>)
                                    }
                                    else {
                                        if (values[0].includes("http://www.sydney.edu.au/kg")) {
                                            return null
                                        }
                                        else if (values[0].startsWith("http:")) {
                                            return (<><a className="panel-object" href={values[0]} >{values[0]}</a>{suffix}&nbsp;</>)
                                        }
                                        else {
                                            return (<span className="panel-literal">{values[0]}{suffix}&nbsp;</span>)
                                        }
                                    }
                                })}
                            </div>
                        )
                    }
                    else {
                        return null
                    }
                })}
            </div>
        )
    }
}