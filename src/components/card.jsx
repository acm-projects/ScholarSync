"use client";
import './card.css'
import {useRouter} from 'next/navigation';
import { BookmarkIcon, BookmarkFilledIcon } from '@radix-ui/react-icons';
import TagChip from "@/components/tagchip";
import { useEffect, useState } from 'react';


  function BookmarkButton({onClick, bookmarked}){
    return(
    <button onClick = {onClick} style={{color: "red"}}> 
     {bookmarked ? <BookmarkFilledIcon/>  :  <BookmarkIcon/>}
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
      <div className = "mt-auto flex justify-end size 25">
        <BookmarkButton bookmarked = {bookmarked} onClick = {handleBookmark}/>
      </div>
      <h3 className="card-title" onClick={titleClicked}>{paper.title} </h3>
      <p className="card-author">{paper.author} </p>
      <p className="card-description">{paper.description}</p>
       <div className="mt-auto flex justify-end">
    <p className="text-xs text-[#D1D2D6] shrink-0">Date Published: {paper.date}</p>
  </div>
      <div className="card-tag gap 2" >
               {paper.tags.slice(0,3).map((tag,index) => {
                  const color = index === 0 ? "green" : index ===1 ? "yellow" : "red";
                  return <TagChip key={index} text={tag} color={color} />;
                })}
            </div>
    </div>
  );
}
export default CardPage;