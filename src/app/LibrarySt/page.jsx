'use client';
import './Saved.css'
import React from 'react';
import PAPERdet from "@/components/paperDetail";
import {useEffect, useState} from 'react';
const saved = () => {
    const [savedPaper, setSavedPaper] = useState([]);

    useEffect(() => {
        const saved = localStorage.getItem("bookmarkedStuff");
        if (saved){
            setSavedPaper(JSON.parse(saved));
        }
    }, []);

  return (
    <div className = "Main">
       <div className = "Top">
        <h1> Library </h1>
        </div>
    {savedPaper.length === 0 ? (
      <p>NOPE!</p>
    ) : (
      savedPaper.map((paper) => <PAPERdet key = {paper.id} paper = {paper} />)
    )}
    </div>
  );
};

export default saved
