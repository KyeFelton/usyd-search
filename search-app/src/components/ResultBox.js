import React from "react"

const ResultBox = (props) => {

    if (props.entity.length > 1) {
        return (
            <div className="container border border-secondary rounded p-4">
                <h3 key="0">{props.entity[0]}</h3>
                <p key="1" className="box-desc">{props.entity[1]}</p>
                <a key="2" href={props.entity[2]}>Learn more</a>
            </div>
        )
    }
    else {
        return null
    }
}

export default ResultBox