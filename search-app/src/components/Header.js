import React from 'react'
import { BsSearch } from 'react-icons/bs'
import logo from '../logo.png'
import Select from 'react-select'
import { useState } from "react"


const FILTERS = [
    { value: 'none', label: '-- no filter --' },
    { value: 'Centre', label: 'Centre' },
    { value: 'Course', label: 'Course' },
    { value: 'Department', label: 'Department' },
    { value: 'Generic', label: 'Generic' },
    { value: 'News', label: 'News' },
    { value: 'Publication', label: 'Publication' },
    { value: 'Research', label: 'Research' },
    { value: 'Staff', label: 'Staff' },
    { value: 'Unit', label: 'Unit' },
]

const SEARCH_TYPES = [
    { value: 'name', label: 'Name Search' },
    { value: 'literal', label: 'Literal Search' },
]


export default function Header(props) {

    const [filter, setFilter] = useState('')
    const [query, setQuery] = useState('')
    const [type, setType] = useState('name')

    function handleSubmit(event) {
        event.preventDefault()
        props.updateList(query, filter, type)
    }

    function handleFilterChange(selectedOption) {
        if (selectedOption.value !== 'none') {
            setFilter(`FILTER ( ?class IN ( ont:${selectedOption.value} ) )`)
        }
        else {
            setFilter('')
        }
    }

    function handleQueryChange(event) {
        setQuery(event.target.value)
    }

    function handleTypeChange(selectedOption) {
        setType(selectedOption.value)
    }

    return (
        <header className="header container mb-3" id="header">
            <div className="row mb-4">
                <div className="col-sm-5 col-lg-4 col-xl-3">
                    <img src={logo} className="img-fluid" alt="Univeristy of Sydney"></img>
                </div>
                <div className="col-sm-3 col-lg-4 col-xl-5">
                </div>
                <div className="col-sm-4 col-lg-4 col-xl-4">
                    <Select options={FILTERS} menuPortalTarget={document.body} styles={{ menuPortal: base => ({ ...base, zIndex: 9999 }) }} onChange={handleFilterChange} />
                    <p></p>
                    <Select options={SEARCH_TYPES} menuPortalTarget={document.body} styles={{ menuPortal: base => ({ ...base, zIndex: 9999 }) }} onChange={handleTypeChange} />
                </div>
            </div>
            <form onSubmit={handleSubmit}>
                <div className="input-group mb-3">
                    <input type="text" className="form-control" placeholder="Search" aria-label="Search" aria-describedby="basic-addon1" value={query} onChange={handleQueryChange} />
                    <button type="submit" className="btn btn-primary">
                        <BsSearch />
                    </button>
                </div>
            </form>
        </header>
    )
}