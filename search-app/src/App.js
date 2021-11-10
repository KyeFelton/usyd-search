import Header from "./components/Header"
import List from "./components/List"
import Panel from "./components/Panel"
import { entitySearch, literalSearch, nameSearch } from './components/Stardog'
import { useState } from "react"
import "./App.css"


export default function App() {

    const [list, setList] = useState(null)
    const [panel, setPanel] = useState(null)

    async function updateList(query, filter, type) {
        setList([])
        setPanel(null)
        let results = []
        switch (type) {
            case 'name':
                results = await nameSearch(query, filter)
                break
            case 'literal':
                results = await literalSearch(query, filter)
                break
            default:
                results = await nameSearch(query, filter)
                break
        }
        setList(results)
        if (results[0][0] !== "") {
            let entity = []
            entity = await entitySearch(results[0][0])
            setPanel(entity)
        }
    }

    async function updatePanel(uri) {
        setPanel(null)
        let entity = []
        entity = await entitySearch(uri)
        setPanel(entity)
    }



    return (
        <div className="app" >
            <div className="main" >
                <Header updateList={updateList}/>
                <div className="container" >
                    <div className="row" >
                        <div className="col-8" >
                            <List results={list} updatePanel={updatePanel}/>
                        </div>
                        <div className="col-4" >
                            <Panel results={panel} updatePanel={updatePanel}/>
                        </div>
                    </div>
                </div>
            </div>

            <div className="error" >
                Please view on a larger screen.
            </div>
        </div>
    )
}