'use client';
import React, { useState, useEffect } from 'react';
import Navbar from '@/components/navbar';
import { useRouter } from 'next/navigation';

import './markdown.css';

export default function PaperZoom({ params }) {
  const router = useRouter();
  const paperId = params.id;

  const [paper, setPaper] = useState(null);
  const [loadingPaper, setLoadingPaper] = useState(true);
  const [showSidebar, setShowSidebar] = useState(false);
  const [summary, setSummary] = useState('');
  const [generatingSummary, setGeneratingSummary] = useState(false);

  // Fetch paper metadata from API
  useEffect(() => {
    setLoadingPaper(true);
    fetch(`/api/paper`)
      .then((res) => res.json())
      .then((data) => {
        const found = data.find((p) => p.id === paperId);
        setPaper(found || null);
        setLoadingPaper(false);
      })
      .catch((err) => {
        console.error('Error fetching paper:', err);
        setLoadingPaper(false);
      });
  }, [paperId]);

  if (loadingPaper) {
    return <div style={{ padding: '2rem' }}>Loading paper...</div>;
  }

  if (!paper) {
    return <div style={{ padding: '2rem' }}>Not Found!</div>;
  }

  async function generateSummary() {
    if (showSidebar) {
      setShowSidebar(false);
      setSummary('');
    } else {
      setGeneratingSummary(true);

      try {
        const res = await fetch(`/api/summary`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ pdfLink: paper.pdfLink, paperID: paper.id }),
        });

        const data = await res.json();
        setSummary(data.summary || 'No summary available.');
      } catch (err) {
        console.error('Error generating summary:', err);
        setSummary('Failed to generate summary.');
      } finally {
        setGeneratingSummary(false);
        setShowSidebar(true);
      }
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
          backgroundColor: '#2563EB',
          color: '#fff',
          border: 'none',
          cursor: 'pointer',
          fontWeight: 'bold',
          boxShadow: '0 2px 6px rgba(0,0,0,0.2)',
          transform: 'scale(0.80)',
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
          backgroundColor: '#2563EB',
          color: '#fff',
          border: 'none',
          cursor: 'pointer',
          fontWeight: 'bold',
          boxShadow: '0 2px 6px rgba(0,0,0,0.2)',
          transform: 'scale(0.80)',
        }}
        onClick={generateSummary}
        disabled={generatingSummary}
      >
        {generatingSummary ? 'Generating...' : 'Generate Summary'}
      </button>

      {showSidebar && (
        <div
          style={{
            position: 'fixed',
            top: '5.3rem',
            right: 0,
            width: '300px',
            height: '100vh',
            backgroundColor: '#FAFAFA',
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
              left: '1rem',
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

          {/* Embed PDF */}
          <div style={{ margin: '2rem 0' }}>
            <iframe
              src={paper.pdfLink}
              width="100%"
              height="600px"
              style={{ border: '1px solid #ccc', borderRadius: '8px' }}
              title={paper.title}
            ></iframe>
          </div>
        </div>
      </div>
    </>
  );
}
