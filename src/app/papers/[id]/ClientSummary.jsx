'use client';

import { useState } from 'react';
import './markdown.css';

export default function ClientSummary({ content }) {
  const [showSidebar, setShowSidebar] = useState(false);
  const [summary, setSummary] = useState('');

  function generateSummary() {
    const text = content.replace(/[#_*`>\-\n]/g, ' ').slice(0, 250);
    setSummary(text + '...');
    setShowSidebar(true);
  }

  return (
    <>
      <button
        style={{
          position: 'fixed',
          top: '1rem',
          right: '1rem',
          padding: '0.5rem 1rem',
          cursor: 'pointer',
          borderRadius: '4px',
          border: '1px solid #ccc',
          backgroundColor: '#000',
          color: '#fff',
        }}
        onClick={generateSummary}
      >
        Generate Summary
      </button> 
      {showSidebar && (
        <div className="sidebar">
          <p>{summary}</p>
          <button onClick={() => setShowSidebar(false)}>Close</button>
        </div>
      )}
    </>
  );
}
