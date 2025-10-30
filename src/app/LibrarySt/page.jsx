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
     <div className="min-h-screen" style={{ backgroundColor: "#F7F7F7" }}>
          <div className="relative z-10 bg-white border-white rounded-b-2xl shadow">
          <Navbar />
        </div>
          <div className="-mt-5 w-full bg-[#F9FAFB)] border-b-2 border-[#E0E0E0] shadow-sm pt-3 pb-2">


      <div className="w-full px-6 py-3 flex items-center gap-6">
          <div className = "Top">
        <h3 className= "mt-6 font-size text-black font-semibold"> My Library: </h3>
        </div>
            <input
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                setVisible(9);
              }}
              placeholder="Search papers, authors, or tags"
              className="w-76 md:w-96 mt-3 rounded-md border border-[#983734]/50 bg-[#F9EAEA] text-[#111111] placeholder-black px-3 py-2 text-m hover:bg-[#A9443F]/20 focus-visible:outline-none focus-visible:border-2 focus-visible:border-[#983734]"

            />

            <select
            className="w-48 mt-3 rounded-md border border-[#B33A3A] bg-[#F9EAEA] px-3 py-2 text-m text-[#111111] focus-visible:outline-none focus-visible:border-2 focus-visible:border-[#B33A3A]"
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

      <div>
  
           {paperShowTag.map((grp) =>(
          
          <div key = {grp.tag}>
            <h3
        style={{
        color: '#000000ff',
        marginLeft: '3.5rem',
        marginBottom: '1.5rem',
        padding: '0.25rem 0.5rem',
        display: 'inline-block',
        width: '25%',
        fontSize: 19, 
        textAlign: 'left',
        fontWeight: '600',
      }}
    >
      {grp.tag}

      </h3>
            
          
        <div className="card-grid" style={{display:'flex', flexDirection: 'column', gap: '1rem',paddingBottom: '1rem' ,position: "relative"}}>
      
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
      <Card onClick={() => titleClicked(paper)} key = {paper.id}  style={{
                width: '20rem',
                position: "relative", 
                height: '410px',
                backgroundColor: '#FFFFFF'
              ,
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

              <Card.Body
              onClick={() => titleClicked(paper)} 
                style={{
            flexGrow: 1,            
            display: 'flex',          
            flexDirection: 'column', 
            justifyContent: 'flex-start',
            minHeight: '80px',       
  }}
>
              <div className = "group">
                <div style={{ height: '1px', backgroundColor: '#E0E0E0', width: '100%' }}> </div>
                 <div className='Hover'>
                 <Card.Title 
  
                 onClick={() => titleClicked(paper)} style= {{fontWeight: 'bolder', fontSize: 16, marginBottom : '1rem', marginRight : '1rem', marginTop : '1rem', flexShrink: 0,
                whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', color: '#111111' }}>{paper.title}
                </Card.Title>

              </div>
                <Card.Text style= {{fontWeight: 'bolder', fontSize: 14, marginBottom : '1rem', color: '#555555'}}>
                    Authors: {paper.author}
                </Card.Text>

              </div>
                  </Card.Body>
            </Card>
          ))}
        </div>

      <div className="w-full h-[1px] bg-[#E0E0E0] mt-0.5 mb-3"></div>
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
