import ReactMarkdown from 'react-markdown';
import papers from '../../../data/papers.json';
import ClientSummary from './ClientSummary';
import './markdown.css';

export default function PaperZoom({ params }) {
  const paperId = parseInt(params.id, 10);
  const paper = papers.find((p) => p.id === paperId);

  if (!paper) {
    return <div style={{ padding: '2rem' }}>Not Found!</div>;
  }

  return (
    <div style={{ backgroundColor: '#3D110F', minHeight: '100vh', padding: '2rem' }}>
      <ClientSummary content={paper.content} />
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