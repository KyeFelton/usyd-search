import Header from './components/Header';
import RecomList from './components/RecomList';
import ResultBox from './components/ResultBox';
import ResultList from './components/ResultList';
import './App.css';

function App() {
  return (
    <div className="app">
      <div className="main">
        <Header />
        <RecomList />
        <div className="container">
          <div className="row">
            <div className="col-8">
              <ResultList />
            </div>
            <div className="col-4">
              <ResultBox />
            </div>
          </div>
        </div>
      </div>
      <div className="error">
          Please view on a larger screen.
        </div>
    </div>
  );
}

export default App;
