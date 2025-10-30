"use client";
import './card.css'
import PAPERdet from "@/components/paperDetail";
import {useRouter} from 'next/navigation';
import { BookmarkIcon, BookmarkFilledIcon } from '@radix-ui/react-icons';
import TagChip from "@/components/tagchip";
import { useEffect, useState } from 'react';


  function BookmarkButton({onClick, bookmarked}){
    return(
    <button onClick = {onClick} style={{color: "#6B2737"}}> 
     {bookmarked ? <BookmarkFilledIcon style = {{ width: '28px', height: '28px'}}/>  :  <BookmarkIcon style = {{ width: '28px', height: '28px'}}/>}
    </button>
    );
  }

const CardPage = ({ paper }) => {
  const router = useRouter();
  const [bookmarked, setBookmarked] = useState(false);
  useEffect(() => {
  if (!paper || !paper.id) return;

  const saved = localStorage.getItem("bookmarkedStuff");
  const bookmarkedStuff = saved ? JSON.parse(saved) : [];
  const isBookmarked = bookmarkedStuff.some(p => p.id === paper.id);
  setBookmarked(isBookmarked);
}, [paper]);

useEffect(() => {
  if (!paper || !paper.id) return;

  const saved = localStorage.getItem("bookmarkedStuff");
  let bookmarkedStuff = saved ? JSON.parse(saved) : [];

  if (bookmarked) {
    if (!bookmarkedStuff.some(p => p.id === paper.id)) {
      bookmarkedStuff.push(paper);
    }
  } else {
    bookmarkedStuff = bookmarkedStuff.filter(p => p.id !== paper.id);
  }

  localStorage.setItem("bookmarkedStuff", JSON.stringify(bookmarkedStuff));
  console.log("Updated localStorage:", bookmarkedStuff); 
}, [bookmarked, paper]);

  function detailsPlease(){
    router.push(`/papers/${paper.id}`); 
  }

  function titleClicked() {
    router.push(`/papers/${paper.id}`); 
  }
  function handleBookmark(){
    setBookmarked((used) =>  !used);

  }

  
  return(
     <div className="card" >
       <div style={{height: '200px',width: '200px',  overflow: 'hidden',position: 'relative', flexShrink: 0,}} >
                        <div
                        style={{
                          transform: 'scale(0.14)',
                          transformOrigin: 'top left',
                          width: '50px',
                          height: '150px', 
                          position: 'absolute',
                          marginLeft: "1rem",
                          marginTop: "1rem",
                          top: 0,
                          left: 0,

                        }}
                      >
                        <PAPERdet paper = {paper} />
                      </div>
                      </div>
      
      <div className = "Main -mt-44 mr-2 ml-3">
      <div className = "mb-9 flex justify-end">
        <BookmarkButton bookmarked = {bookmarked} onClick = {handleBookmark}/>
      </div>
      <h3 className="card-title" onClick={titleClicked}>{paper.title} </h3>
      <p className="card-author">{paper.author} </p>
      <p className="card-description">{paper.description}</p>
      </div>
      
      <div className="mt-auto pt-3 flex items-end justify-between">
      <div className="card-tag flex gap-2 ml-45 mb-18" >
               {paper.tags.slice(0,3).map((tag,index) => {
                  const color = "#9B2335";
                  const textColor = "#111111";
                  return <TagChip key={index} text={tag} color={color} textColor={textColor}/>;
                })}
            </div>
        <div className="mt-auto mb-15 mr-5 flex items-end justify-between text-xs"> Date Published: {paper.date} </div>
        </div>

    </div>
  );
}
export default CardPage;