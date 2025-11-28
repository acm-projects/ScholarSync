"use client";
import './card.css'
import PAPERdet from "@/components/paperDetail";
import {useRouter} from 'next/navigation';
import { BookmarkIcon, BookmarkFilledIcon } from '@radix-ui/react-icons';
import TagChip from "@/components/tagchip";
import { useEffect, useState } from 'react';



function Pop({ onEnd, children }) {
  return (
    <div
      className="fixed inset-0 flex items-center justify-center bg-black/40 backdrop-blur-sm z-[9999] p-16"
      onClick={onEnd}
    >
      <div
        className="bg-pink p-8 rounded max-w-[1100px] w-[95%] max-h-[90vh] overflow-y-auto shadow-lg"
        onClick={(e) => e.stopPropagation()}
      >
        {children}
      </div>
    </div>
  );
}

function BookmarkButton({ onClick, bookmarked }) {
  return (
    <button onClick={onClick} style={{ color: "#ef4444" }}>
      {bookmarked
        ? <BookmarkFilledIcon style={{ width: '28px', height: '28px' }} />
        : <BookmarkIcon style={{ width: '28px', height: '28px' }} />}
    </button>
  );
}

const CardPage = ({ paper }) => {
  const router = useRouter();
  const [bookmarked, setBookmarked] = useState(false);
  const [open, setOpen] = useState(false);

  const paperID = paper?.paperID; 

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
  }, [open]);

  useEffect(() => {
    if (!paperID) return;

    const saved = localStorage.getItem("bookmarkedStuff");
    const bookmarkedStuff = saved ? JSON.parse(saved) : [];
    const isBookmarked = bookmarkedStuff.some(p => p.id === paperID);

    setBookmarked(isBookmarked);
  }, [paperID]);


  function titleClicked() {
    router.push(`/papers/${paperID}`);
  }

  async function handleBookmark() {
    if (!paper) return;

    const username = localStorage.getItem("username");
    if (!username) {
      alert("You must be logged in to save papers.");
      return;
    }

    const nextState = !bookmarked;
    setBookmarked(nextState);

    const saved = localStorage.getItem("bookmarkedStuff");
    let arr = saved ? JSON.parse(saved) : [];

    if (nextState) {
      arr = arr.filter(p => p.id !== paperID);
      arr.push({
        ...paper,
        id: paperID,
        status: "" 
      });
    } else {
      arr = arr.filter(p => p.id !== paperID);
    }

    localStorage.setItem("bookmarkedStuff", JSON.stringify(arr));

    const payload = {
      username,
      paperID: String(paperID),
      title: paper.title,
      author: paper.author,
      tags: paper.tags,
      pdfLink: paper.pdfLink || "",
      date: paper.date,
      action: nextState ? "save" : "remove",
      status: ""
    };

    try {
      const res = await fetch("/api/save-paper", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok) {
        console.error(data.error || "Failed to update bookmark");
      }
    } catch (e) {
      console.error("Bookmark error:", e);
    }
  }

  return (
    <>
      <div className="card hover:bg-[#ffffff] shadow-sm">
        {!open && (
          <div
            style={{
              width: '200px',
              height: '200px',
              overflow: 'hidden',
              cursor: 'pointer',
              padding: '10px',
            }}
            onClick={() => setOpen(true)}
          >
            <div style={{ zoom: 0.14, transformOrigin: 'top left' }}>
              <PAPERdet paper={paper} />
            </div>
          </div>
        )}

        <div className="Main -mt-44 mr-2 ml-3">
          <div className="mb-9 flex justify-end">
            <BookmarkButton bookmarked={bookmarked} onClick={handleBookmark} />
          </div>

          <h3 className="card-title" onClick={titleClicked}>{paper.title}</h3>
          <p className="card-author">{paper.author}</p>
          <p className="card-description">{paper.description}</p>
        </div>

        <div className="relative pt-3 items-end w-full">
          <div className="flex gap-2 mb-6" style={{ marginLeft: '11rem' }}>
            {paper.tags.slice(0, 3).map((tag, index) => {
              const textColor = "#111111";
              const color = { 0: 'green', 1: 'yellow', 2: 'red' }[index];
              return (
                <TagChip
                  key={index}
                  text={tag}
                  color={color}
                  textColor={textColor}
                />
              );
            })}
          </div>
        </div>
      </div>

      {open && (
        <Pop onEnd={() => setOpen(false)}>
          <div className="w-full max-w-4xl">
            <PAPERdet paper={paper} />
          </div>
        </Pop>
      )}
    </>
  );
};

export default CardPage;