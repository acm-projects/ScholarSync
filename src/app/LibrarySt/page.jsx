"use client";
import './Saved.css'
import React from 'react';
import {useEffect, useState} from 'react';
import {useMemo } from "react";
import { Loader } from 'lucide-react';
import { useRouter } from 'next/navigation';
import PaperData from "@/data/papers.json" assert { type: "json" };
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import Navbar from "@/components/navbar";
import Dropdown from 'react-bootstrap/Dropdown';
import PAPERdet from "@/components/paperDetail";
function normalize(str){
  // just in case the have accents in their name ? right I thoink it will be easier
  return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
}

const SavedComp = () => {
    const router = useRouter();
    function titleClicked(paper) {
    router.push(`/papers/${paper.id}`);
    }
    const [savedPaper, setSavedPaper] = useState([]);

    useEffect(() => {
        const saved = localStorage.getItem("bookmarkedStuff");
        if (saved){
            const parsed = JSON.parse(saved);
            setSavedPaper(parsed);
        }
    }, []);


      const [query, setQuery] = useState("");
      const [visible, setVisible] = useState(9);
      const [selectedYear, setSelectedYear] = useState("");
      const [selectStatus, setSelectStatus] = useState("");
    
      const filtered = useMemo(() => {
        let out = savedPaper;
    
        if (query.trim()) {
          const q = normalize(query.trim());
          out = out.filter((paper) => {
             const Names = normalize(paper.author || "");
             const authors = Names.split(",").map(individual => individual.trim().toLowerCase());
             
            return(
            normalize(paper.title).includes(q) || authors.some(author => author.includes(q)) || paper.tags?.some(tag=>
            normalize(tag).includes(q))
          );
        });
        }

      if (selectedYear && selectedYear !== "all") {
      const yearNow = new Date().getFullYear();
      const goBack = parseInt(selectedYear);
      const disp = yearNow - goBack;
      out = out.filter((paper) => {
        const paperYear = new Date(paper.date).getFullYear();
        const isValid = paperYear >= disp;
        return isValid;
      });
      }
      return out;
    }, [savedPaper, query, selectedYear])

    const IMPtag = [...new Set(filtered.map(p => p.tags?.[0]).filter(Boolean))];
    const paperShowTag  = IMPtag.map(tag => ({tag, papersUse:filtered.filter(p => p.tags?.[0] === tag)}));


  return (
     <div className="min-h-screen" style={{ backgroundColor: '#3D110F' }}>
          <div className="relative z-10 bg-white border-white rounded-b-2xl shadow">
          <Navbar />
        </div>
          <div className="-mt-5 w-full bg-[#3D110F] border-b-2 border-[#5A2B29] shadow-sm pt-3 pb-2">


      <div className="w-full px-6 py-3 flex items-center gap-6">
          <div className = "Top">
        <h3 className= "mt-5 font-size"> My Library: </h3>
        </div>

            <input
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                setVisible(9);
              }}
              placeholder="Search papers, authors, or tags"
              className="w-80 md:w-96 rounded-md border border-[#5A2B29] bg-[#201311] px-3 py-2 text-m text-[#EEEef0] placeholder-[#EEEef0]/60 hover:bg-[#3C1A19] focus-visible:outline-none focus-visible:border-2 focus-visible:border-[#BA3F3D]"
            />

            <select
            className="w-48 rounded-md border border-[#5A2B29] bg-[#201311] px-3 py-2 text-m text-[#EEEef0]/60 hover:bg-[#3C1A19] focus-visible:outline-none focus-visible:border-2 focus-visible:border-[#BA3F3D]"
            placeholder = "Date Published"
            value={selectedYear}
            onChange={(e) => {
            setSelectedYear(e.target.value);
            setVisible(9);
          }}>
    
          <option value="all">Date Published: All</option>
          <option value="5">Last 5 years</option>
          <option value="10">Last 10 years</option>
        </select>
      </div>

    </div>


    <div className = "Main">
    {savedPaper.length === 0 ? (
      <p>NOPE!</p>
    ) : (
        <div className="card-grid" style={{display:'flex', flexDirection: 'column', gap: '1rem',paddingBottom: '1rem' ,position: "relative"}}>
        {paperShowTag.map((grp) =>(
            <div key = {grp.tag} style={{marginBottom: '2rem',  display: 'flex',
          flexDirection: 'column',
          gap: '1rem',
          paddingBottom: '1rem',
          paddingTop: '2.5rem',
          position: 'relative',
          overflowX:'auto',
          background: 'rgba(0, 183, 255, 0.1)',
          borderRadius: '16px',
          whiteSpace: 'nowrap',
          boxShadow: '0 4px 30px rgba(50, 50, 50, 0.3)',
          backdropFilter: 'blur(9px)',
          WebkitBackdropFilter: 'blur(10px)',
          border: '1px solid rgba(255, 255, 255, 0.3)',
          color: 'black'}}>

            <h3
  style={{
    color: 'white',
    marginLeft: '3.5rem',
    marginBottom: '2rem',
    cursor: 'pointer',
    padding: '0.3rem 0.8rem',
    borderRadius: '6px',
    backgroundColor: '#444',
    display: 'inline-block',
     width: '150px',          
    textAlign: 'center',
    userSelect: 'none',
  }}
>
  {grp.tag}
</h3>
            <div className="cards" style={{     
                    display: "flex",
                    flexDirection: "row",
                    overflowX: "auto",
                    gap: '1rem',
                    padding: "1rem 3.5rem",
                    marginBottom: '2.5rem',
                    width: '100%',

                }}>


      {grp.papersUse.map((paper) => (
      <Card key = {paper.id}  style={{
                width: '28rem',
                position: "relative", 
                height: '410px',
                backgroundColor: '#000000ff',
                color: 'white',
                marginBottom: '5.5rem',
                padding: "1rem",
                display: "flex",
                flexDirection: 'column',

              }}
            >

            <div style={{height: '286px',width: '100%',  overflow: 'hidden',position: 'relative', flexShrink: 0,}} >
                  <div
                  style={{
                    display: "flex",
                    transform: 'scale(0.20)',
                    transformOrigin: 'top left',
                    width: '1000px',
                    height: '1300px', 
                     marginLeft: '2.4rem',
                    justifyContent: 'center',
                  }}
                >
                  <PAPERdet paper = {paper} />
                </div>
                </div>
    
               
               
                <div className = " absolute mt-5 inline-flex items-center bg-[#201311] border border-[#5A2B29] rounded-md px-10 py-2 w-36 top-0 right-5">
                 <Loader style={{position: 'absolute', width:24, height:24, top:0, right:105, marginTop:5 }}/>
                <select
                className="bg-transparent text-sm outline-none w-24 text-[#EEEef0]/80 "
                value={selectStatus}
                onChange={(e) => setSelectStatus(e.target.value)}>
                    <option value=""> Status</option>
                    <option value="reading">📖 Reading</option>
                     <option value="finished">✅ Finished</option>
                    <option value="want-to-read">🕒 Want to Read</option>
               </select>
                </div>

              <Card.Body
                style={{
            flexGrow: 1,            
            display: 'flex',          
            flexDirection: 'column', 
            justifyContent: 'flex-start',
            minHeight: '80px',       
  }}
>
                <Card.Title onClick={() => titleClicked(paper)} style= {{fontWeight: 'bolder', fontSize: 16, marginBottom : '1rem', marginRight : '1rem', marginTop : '1rem', flexShrink: 0,
                whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>Title: {paper.title}
                </Card.Title>

                <Card.Text style= {{fontWeight: 'bolder', fontSize: 14, marginBottom : '1rem'}}>
                    Authors: {paper.author}
                </Card.Text>
                  </Card.Body>
            </Card>
          ))}
        </div>
    </div>
))}

</div> 
)}
</div>
</div>
);
}

export default SavedComp;
