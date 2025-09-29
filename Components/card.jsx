'use client';
import './card.css'

const CardPage = ({ opportunity }) => {
  function titleClicked() {
    alert("Title clicked! or goes to the actuall opportunity page where they do the quick apply");
  }
  
  return (
     <div className="card" onClick={titleClicked}>
      <h3 className="card-title">{opportunity.title}</h3>
      <p className="card-description">{opportunity.description}</p>
      <div className = "tag"> </div>
    </div>
  );
};

export default CardPage;