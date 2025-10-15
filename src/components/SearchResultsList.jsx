import React from 'react'
import "./SearchResultsList.css";
const SearchResultsList = ({results}) => {
  return (

    <div className="results-List">
        {results.map((result, id) => {
            return <div key = {id} className = "result-item"> {result.title} </div>

        })}
    
    </div>
  );
};

export default SearchResultsList
