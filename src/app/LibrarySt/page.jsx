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
import { Pencil1Icon } from "@radix-ui/react-icons";
function normalize(str){
  // just in case the have accents in their name ? right I thoink it will be easier
  return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
}

function allowDrop(e) {
  e.preventDefault();
}
const handleDragStart = (e, paperId) => {
  e.dataTransfer.setData("paperId", String(paperId));
};

const SavedComp = () => {
    const [query, setQuery] = useState("");
      const [visible, setVisible] = useState(9);
      const [selectedYear, setSelectedYear] = useState("");
      const [openDropdowns, setOpenDropdowns] = useState({}); 
      const [savedPaper, setSavedPaper] = useState([]);
      const [workspace, setWorkspace] = useState({});
    const [status, setStatus] = useState(() => {
  if (typeof window !== "undefined") {
    const saved = localStorage.getItem("readStatus");
    return saved ? JSON.parse(saved) : {};
  }
  return {};
});

function handleDrop(e,groupName){
  e.preventDefault();
  const paperId = String(e.dataTransfer.getData("paperId"));
  setWorkspace(prev => {
    const group = prev[groupName] || {papers: []};
    if(!group.papers.includes(paperId)){
       return{
      ...prev,
      [groupName]: {
        ...group,
        papers: [...group.papers, paperId],
      },
    };

    }
    return prev;

   
  });
    }


function handleFreshDrop(e) {
  e.preventDefault();
  const paperId = String(e.dataTransfer.getData("paperId"));
  if (!paperId) return;

  const name = prompt("Enter a name for your new workspace:");
  if (!name) return;

  setWorkspace(prev => {
    if (prev[name]) {
      alert("That workspace already exists!");
      return prev;
    }

    return {
      [name]: { papers: [paperId] }, ...prev
    };
  });
}

const [mode, setMode] = useState("tag");

    const router = useRouter();
    function titleClicked(paper) {
    router.push(`/papers/${paper.id}`);
    }

    useEffect(() => {

      localStorage.setItem("readStatus", JSON.stringify(status));

    }, [status]);


    useEffect(() => {
        const saved = localStorage.getItem("bookmarkedStuff");
        if (saved){
            const parsed = JSON.parse(saved);
            setSavedPaper(parsed);
        }

        const stoStatus = localStorage.getItem("readStatus");
        if(stoStatus){
            setStatus(JSON.parse(stoStatus));
        }
    }, []);


  useEffect(() => {
  const saved = localStorage.getItem("workspaces");
  if (saved) setWorkspace(JSON.parse(saved));
}, []);

useEffect(() => {
  localStorage.setItem("workspaces", JSON.stringify(workspace));
}, [workspace]);


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

    const paperSets = useMemo(() => {
      if (mode === "tag"){
        const IMPtag = [...new Set(filtered.map(p => p.tags?.[0]).filter(Boolean))];
        return IMPtag.map(tag => ({
          groupName: tag, 
          papers: filtered.filter(p => p.tags?.[0] === tag)
        }));
      }
      else if (mode === "status") {
        const allStatuses = ["Reading", "Finished", "Want to Read"];
        return allStatuses.map(statusName => ({
            groupName: statusName,
            papers: filtered.filter(p => status[p.id] === statusName)
        })).filter(group => group.papers.length > 0);
      }   else if (mode === "workspace"){
          if (Object.keys(workspace).length === 0)
            return [];
          const papersGrouped = Object.values(workspace).flatMap(g => g.papers);
          return Object.entries(workspace).reverse().map(([name, data]) => ({
            groupName:name,
            papers:data.papers.map(paperId => savedPaper.find(p=> String(p.id) ===String(paperId))).filter(Boolean)
          }));
        }

    return [];
      }, [filtered, mode, status, workspace,savedPaper]);

    const options = ["Reading", "Finished", "Want to Read"];
    
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

        <select value = {mode}
         onChange={(e) => setMode(e.target.value)}
         className="w-48 mt-3 rounded-md border border-[#B33A3A] bg-[#F9EAEA] px-3 py-2 text-m text-[#111111] focus-visible:outline-none focus-visible:border-2 focus-visible:border-[#B33A3A]"
        >
         <option value="tag">View by Tag</option>
          <option value="status">View by Status</option>
           <option value="workspace">View by Workspace</option>
        </select>
      </div>
    </div>






    <div className = "Main">
    
    {savedPaper.length === 0 ? (
      <p>NOPE!</p>
    ) : (
      <div>
            {mode === "workspace" && (
  <>
    <div
      className="nws"
      onDrop={handleFreshDrop}
      onDragOver={allowDrop}
        onClick={() => {
              const name = prompt("Enter a name for your new workspace:");
              if (!name) return;
              if (workspace[name]) {
                alert("That workspace already exists!");
                return;
              }
              setWorkspace(prev => ({ [name]: { papers: [] }, ...prev }));
            }}
      style={{
        border: "2px dashed #983734",
        borderRadius: "10px",
        padding: "2rem",
        margin: "2rem 3.5rem",
        textAlign: "center",
        cursor: "pointer",
        color: "#983734",
        fontWeight: "600"
      }}
    >
      + Create New Workspace (drag a paper here)
    </div>
      <hr style={{ margin: "2rem 3.5rem", borderColor: "#ccc" }} />

    <div
      style={{
        display: "flex", 
        flexWrap: "wrap",
        gap: "1rem",
        padding: "2rem 3.5rem",
        justifyContent: "flex-start",
      }}
    >
      {savedPaper.map((paper) => (
        <Card
          key={paper.id}
          draggable
          onDragStart={(e) => handleDragStart(e, paper.id)}
          style={{
            width: "20rem",
            backgroundColor: "#FFFFFF",
            padding: "1rem",
            borderRadius: "8px",
            cursor: "grab",
            boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
          }}
        >

           <div className = "options" style = {{position: "relative", display: "flex",
                alignItems: "center",
                backgroundColor: "#ebe7e7ff"  ,
                borderRadius: "5px",
                gap: "6px",
                color: "black",
                padding: "2px 12px",
                fontSize: 10,
                marginTop: "15px",
                width: "fit-content",
                marginLeft: "12rem"
               ,}} onClick={() => 
    setOpenDropdowns(prev => ({
        ...prev,
        [paper.id]: !prev[paper.id]
    }))
} onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#d6d3d3" )} onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "#ebe7e7ff"  )}>
                
               <Pencil1Icon style={{ color: "black",  width: "19px", height: "19px",}} />
               <span style = {{ color: "black", fontSize: 12}}>
                {status[String(paper.id)] || "Status"}
                </span>
                {openDropdowns[paper.id] && (
    <div
      style={{
        position: "absolute",
        top: "100%",
        left: 10,
        backgroundColor: "white",
        border: "1px solid #ccc",
        borderRadius: "5px",
        marginTop: "4px",
        width: "90%",
        zIndex: 1000,
      }}
    >
      {options.map((opt) => (
        <div
          key={opt}
          style={{
            padding: "8px",
            cursor: "pointer",
            backgroundColor:
              status[paper.id] === opt ? "#d6d3d3" : "white",
          }}
       onClick={() => {
          setStatus(prev => ({ ...prev, [String(paper.id)]: opt }));
          setOpenDropdowns(prev => ({ ...prev, [paper.id]: false }));
        }}
          onMouseEnter={(e) => {
            if (status[String(paper.id)] !== opt)
              e.currentTarget.style.backgroundColor = "#f0f0f0";
          }}
          onMouseLeave={(e) => {
            if (status[paper.id] !== opt)
              e.currentTarget.style.backgroundColor = "white";
          }}
        >
          {opt}
          </div>
      ))}
    </div>
  )}
                
              </div>

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
                style={{
            flexGrow: 1,            
            display: 'flex',          
            flexDirection: 'column', 
            justifyContent: 'flex-start',
            minHeight: '85px', }}
>
              <div className = "group">
                <div style={{ height: '1px', backgroundColor: '#E0E0E0', width: '100%' }}> </div>
                 <div className='Hover'>
                 <Card.Title 
  
                 onClick={() => titleClicked(paper)} style= {{fontWeight: 'bolder', fontSize: 16, marginRight : '1rem', marginTop : '1rem', flexShrink: 0,
                whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', color: '#111111' }}>{paper.title}
                </Card.Title>

              </div>
                <Card.Text style= {{fontWeight: 'bolder', fontSize: 12, marginBottom : '1rem', color: '#555555'}}>
                    Authors: {paper.author}
                </Card.Text>

              </div>
                  </Card.Body>

        </Card>
      ))}
    </div>
  </>
)}


      
           {paperSets.map((group) =>(

          <div key = {group.groupName} onDrop = {(e) => handleDrop(e,group.groupName)} onDragOver={allowDrop} className="Wbox">

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
      {group.groupName}

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


      {group.papers.map((paper) => {

        return (
      <Card key = {paper.id} style={{
                width: '20rem',
                position: "relative", 
                height: '410px',
                backgroundColor: '#FFFFFF'
              ,
                marginBottom: '5.5rem',
                padding: "1rem",
                display: "flex",
                flexDirection: 'column',

              }} draggable onDragStart={(e) => handleDragStart(e, paper.id)}
            >
                <div className = "options" style = {{position: "relative", display: "flex",
                alignItems: "center",
                backgroundColor: "#ebe7e7ff"  ,
                borderRadius: "5px",
                gap: "6px",
                color: "black",
                padding: "2px 12px",
                fontSize: 10,
                marginTop: "15px",
                width: "fit-content",
                marginLeft: "12rem"
               ,}} onClick={() => 
    setOpenDropdowns(prev => ({
        ...prev,
        [paper.id]: !prev[paper.id]
    }))
} onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#d6d3d3" )} onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "#ebe7e7ff"  )}>
                
               <Pencil1Icon style={{ color: "black",  width: "19px", height: "19px",}} />
               <span style = {{ color: "black", fontSize: 12}}>
                {status[String(paper.id)] || "Status"}
                </span>
                {openDropdowns[paper.id] && (
    <div
      style={{
        position: "absolute",
        top: "100%",
        left: 10,
        backgroundColor: "white",
        border: "1px solid #ccc",
        borderRadius: "5px",
        marginTop: "4px",
        width: "90%",
        zIndex: 1000,
      }}
    >
      {options.map((opt) => (
        <div
          key={opt}
          style={{
            padding: "8px",
            cursor: "pointer",
            backgroundColor:
              status[paper.id] === opt ? "#d6d3d3" : "white",
          }}
       onClick={() => {
          setStatus(prev => ({ ...prev, [String(paper.id)]: opt }));
          setOpenDropdowns(prev => ({ ...prev, [paper.id]: false }));
        }}
          onMouseEnter={(e) => {
            if (status[String(paper.id)] !== opt)
              e.currentTarget.style.backgroundColor = "#f0f0f0";
          }}
          onMouseLeave={(e) => {
            if (status[paper.id] !== opt)
              e.currentTarget.style.backgroundColor = "white";
          }}
        >
          {opt}
          </div>
      ))}
    </div>
  )}
                
              </div>

            <div style={{height: '283px',width: '100%',  overflow: 'hidden',position: 'relative', flexShrink: 0,}} >
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
                style={{
            flexGrow: 1,            
            display: 'flex',          
            flexDirection: 'column', 
            justifyContent: 'flex-start',
            minHeight: '95px',      
  }}
>
              <div className = "group">
                <div style={{ height: '1.4px', backgroundColor: '#E0E0E0', width: '100%' }}> </div>
                 <div className='Hover'>
                 <Card.Title 
  
                 onClick={() => titleClicked(paper)} style= {{fontWeight: 'bolder', fontSize: 16, marginTop : '0.5rem', marginBottom : '1rem', marginRight : '1rem', flexShrink: 0,
                whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', color: '#111111' }}>{paper.title}
                </Card.Title>

              </div>
                <Card.Text style= {{fontWeight: 'bolder', fontSize: 12, marginTop : '-1.0rem', color: '#555555'}}>
                    Authors: {paper.author}
                </Card.Text>

              </div>
                  </Card.Body>
            </Card>

                 );
})}
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
};

export default SavedComp;