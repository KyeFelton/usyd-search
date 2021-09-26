import React from "react"

import logo from '../logo.png'
import { BsSearch } from "react-icons/bs";

function Header() {
    return (
        <header className="header container mb-3">
            <div className="row mb-4">
                <div className="col-sm-5 col-lg-4 col-xl-3">
                    <img src={logo} className="img-fluid" alt="Univeristy of Sydney"></img>
                </div>
                <div className="col-sm-7 col-lg-8 col-xl-9">
                    <p className="text-end"></p>
                </div>
            </div>

            <div class="input-group mb-3">
                <input type="text" class="form-control" placeholder="Search" aria-label="Search" aria-describedby="basic-addon1" />
                <button type="button" class="btn btn-primary">
                    <BsSearch />
                </button>
            </div>            
        </header>
    )
}

export default Header