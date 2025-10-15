'use client';
import './card.css'

const CardPage = ({ paper }) => {
  function titleClicked() {
    alert("Title clicked! or goes to the actuall opportunity page where they do the quick apply");
  }
  
  return (
     <div className="card" onClick={titleClicked}>
      <h3 className="card-title">{paper.title}</h3>
      <p className="card-author">{paper.author} </p>
      <p className="card-description">{paper.description}</p>
      <p className="card-date">{paper.date}</p>
      <div className = "tag"> </div>
    </div>
  );
};

export default CardPage;