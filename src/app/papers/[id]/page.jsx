'use client';
import React, { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import papers from '../../../data/papers.json';
import Navbar from '@/components/navbar';
import { useRouter } from 'next/navigation';

import './markdown.css';

export default function PaperZoom({ params }) {
  const router = useRouter();
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
     <Navbar />

      <button
        onClick={() => router.back()}
        style={{
          position: 'fixed',
          top: '6rem',
          left: '2rem',
          padding: '0.5rem 1rem',
          borderRadius: '20px',
          backgroundColor: '#6B2737',
          color: '#fff',
          border: 'none',
          cursor: 'pointer',
          fontWeight: 'bold',
          boxShadow: '0 2px 6px rgba(0,0,0,0.2)',
          transform: 'scale(0.80)'
        }}
      >
        ← Back
      </button>
<button
  style={{
    position: 'fixed',
    top: '89px', 
    right: '2rem', 
    padding: '0.5rem 1rem',
    borderRadius: '20px',
    backgroundColor: '#6B2737',
    color: '#fff',
    border: 'none',
    cursor: 'pointer',
    fontWeight: 'bold',
    boxShadow: '0 2px 6px rgba(0,0,0,0.2)',
    transform: 'scale(0.80)'
  }}
  onClick={generateSummary}
>
  Generate Summary
</button>
{showSidebar && (
  <div
    style={{
      position: 'fixed',
      top: '5.3rem',
      right: 0,
      width: '300px',
      height: '100vh',
      backgroundColor: 'hsl(0, 0%, 94%)',
      color: '#111',
      borderLeft: '1px solid #E0E0E0',
      padding: '2rem 1.5rem 1.5rem 1.5rem',
      overflowY: 'auto',
      boxShadow: '-4px 0 12px rgba(0,0,0,0.05)',
      zIndex: 999,
      display: 'flex',
      flexDirection: 'column',
    }}
  >
   <div
  onClick={() => setShowSidebar(false)}
  style={{
    position: 'absolute',     
    top: '0.3rem', 
    left: '1rem' ,            
    right: '33rem',           
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    cursor: 'pointer',
    fontWeight: 'bold',
    fontSize: '1.2rem',
    color: '#555',
    backgroundColor: '#f5f5f5',
    borderRadius: '50%',
    boxShadow: '0 2px 6px rgba(0,0,0,0.1)',
  }}
>
  {'>'}
</div>

    <h3 style={{ fontWeight: 700, marginBottom: '1rem' }}>Summary</h3>
    <p style={{ fontSize: '0.95rem' }}>{summary}</p>
  </div>
)}

      <div
        style={{
          backgroundColor: '#F8F8F8',
          minHeight: '100vh',
          padding: '2rem',
          marginRight: showSidebar ? '300px' : '0',
          transition: 'margin-right 0.3s ease',
          display: 'flex',
          justifyContent: 'center',
        }}
      >
        <div
          style={{
            backgroundColor: '#FFFFFF',
            borderRadius: '12px',
            width: '800px',
            padding: '4rem',
            boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
          }}
        >
          <h1 style={{ color: '#111111' }}>{paper.title}</h1>
          <p style={{ color: '#555555' }}>Author: {paper.author}</p>
          <p style={{ color: '#555555' }}>Date: {paper.date}</p>
          <div className="markdown">
            <ReactMarkdown>{paper.content}</ReactMarkdown>
          </div>
        </div>
      </div>
    </>
  );
}