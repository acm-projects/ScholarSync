import ReactMarkdown from 'react-markdown';
import papers from '@/data/papers.json'; 
import '@/app/papers/[id]/markdown.css';

export default function PAPERdet({ paper }) {
 if (!paper) {
    return <div style={{ padding: '2rem' }}>Not Found!</div>;
  }

  return (
    <div style={{ backgroundColor: '#3D110F', minHeight: '100vh', padding: '2rem' }}>
      <div className="container" style={{ marginTop: '5rem' }}>
        <h1>{paper.title}</h1>
        <p>Author: {paper.author}</p>
        <p>Date: {paper.date}</p>

        <div className="markdown">
          <ReactMarkdown>{paper.content}</ReactMarkdown>
        </div>
      </div>
    </div>
  );

}