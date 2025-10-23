'use client';
import React, { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import papers from '../../../data/papers.json';
import './markdown.css';

export default function PaperZoom({ params }) {
  const paperId = parseInt(params.id, 10);
  const paper = papers.find((p) => p.id === paperId);

  const [showSidebar, setShowSidebar] = useState(false);
  const [summary, setSummary] = useState('');

  if (!paper) {
    return <div style={{ padding: '2rem' }}>Not Found!</div>;
  }

  function generateSummary() {
    if (showSidebar){
      setShowSidebar(false);
      setSummary('');
    }else{
       const text = paper.content.replace(/[#_*`>\-\n]/g, ' ').slice(0, 242);
      setSummary(text + '...');
      setShowSidebar(true);

    }


  }

  return (
    <>
      <button
        style={{
          position: 'fixed',
          top: '1rem',
          right: '4rem',
          padding: '0.5rem 1rem',
          cursor: 'pointer',
          borderRadius: '20px',
          backgroundColor: '#110000ff',
          color: '#fff',
        }}
        onClick={generateSummary}
      >
        Generate Summary
      </button> 

      {showSidebar && (
        <div className="sidebar" style={{
          position: 'fixed',
          top: '2rem',
          right: 0,
          width: '300px',
          height: '150vh',
          marginTop: '30px',
          marginRight: '10px',
          background: 'rgba(0, 0, 0, 1)',
          borderRadius: '16px',
          color: 'white',
          padding: '20px',
        }}>
          <p>{summary}</p>
       
        </div>
      )}

      <div
        style={{
          backgroundColor: '#3D110F',
          minHeight: '100vh',
          padding: '2rem',
          marginRight: showSidebar ? '300px' :  'auto',         
          transition: 'margin-right 0.3s ease',
        }}
      >
        <div className="top" style={{marginTop: '0.05rem', padding: '2rem', marginRight: "0.25rem", backgroundColor: '#1a0e0b', borderRadius: '12px' , width: '800px'}} >
          <div className="container" style={{ margin: '0',  padding: '4rem' }}>
          <h1>{paper.title}</h1>
          <p>Author: {paper.author}</p>
          <p>Date: {paper.date}</p>
          <div className="markdown">
            <ReactMarkdown>{paper.content}</ReactMarkdown>
          </div>

        </div>
          
        </div>
      

  

      </div>
    </>
  );
}