import ReactMarkdown from 'react-markdown';
import papers from '@/data/papers.json'; 
import '@/app/papers/[id]/markdown.css';

export default function PAPERdet({ paper }) {
  if (!paper) {
    return <div style={{ padding: '2rem' }}>Not Found!</div>;
  }

  return (
    <div
      style={{
        width: '1000px',
        height: '1300px', 
        backgroundColor: '#ffffffff',
        color: 'black',
        padding: '2.5rem',
        boxSizing: 'border-box',
        overflow: 'hidden', 
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'flex-start',
      }}
    >
      <div>
        <h1>{paper.title}</h1>
        <p>Author: {paper.author}</p>
        <p>Date: {paper.date}</p>

        
        <div
          className="markdown"
          style={{
            height: '1000px', 
            overflow: 'hidden',
          }}
        >
          <ReactMarkdown>{paper.content}</ReactMarkdown>
        </div>
      </div>
    </div>
  );
}