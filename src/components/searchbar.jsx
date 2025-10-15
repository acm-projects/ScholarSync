
"use client";
import { useState } from "react";
import './searchbar.css';
const Search = ({opportunities, setResults, setCard})=>{
    const [input,setInput] = useState("");

    const handleChange = (value) => {
        console.log("handleChange called with:", value);
        setInput(value);

    if (!opportunities) {
    console.error("Opportunities is undefined!");
    setResults([]);
    return;
  }
        const filtered = opportunities.filter((item) =>
        item.title.toLowerCase().includes(value.toLowerCase())

    );

        const match = filtered.length>0 ? filtered[0] :null;
    setResults(filtered);
    setCard(match);
    }


    return(
        <div className = "input-wrapper">
            <input placeholder= " Search" value={input}
            onChange={(e) => handleChange(e.target.value)} />


            </div> 

    );
};

export default Search;