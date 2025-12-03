'use client';
import './create.css';
import React, { useState } from 'react';
import TagTextBox from "@/components/tagtextbox";
import { useRouter } from 'next/navigation';

const Create = () => {
  // Get username from localStorage, cannot be changed
  const router = useRouter();

  const [username] = useState(() => window.localStorage.getItem('username') || '');
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [skills, setSkills] = useState([]);

  const handleContinue = async (e) => {
    e.preventDefault();

    if (!username || !title || !body) {
      setError("Please fill all required fields.");
      return;
    }
  
    const query = new URLSearchParams({
      username,
      title,
      body,
      tags: JSON.stringify(skills)
    }).toString();

    router.push(`/create/step2?${query}`);
  };

  return (
    <div className="containerCreate">
      <div className="Header">
        <div className="text" style={{ justifyContent: "center" }}>
          Create a Post
        </div>
      </div>

      <form>
        <div className="inputs">
          <div className="user">
            <span className="label-text">Username</span>
            <div className="input">
              <input
                type="text"
                value={username || ''}
                placeholder="No username found"
                readOnly
              />
            </div>
          </div>

          <div className="post-title">
            <span className="label-text">Opportunity Title</span>
            <div className="input">
              <input
                type="text"
                placeholder="Opportunity Title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </div>
          </div>

          <div className="description">
            <span className="label-text">Description</span>
            <div className="textarea-input">
              <textarea
                placeholder="Write a job description"
                value={body}
                onChange={(e) => setBody(e.target.value)}
                rows={6}
              />
            </div>
          </div>

          <div className="skills">
            <span className="label-text">Add skills most relevant to this role (max 3)</span>
            <div className="input">
              <TagTextBox
                label=""
                name="skills"
                values={skills}
                onChange={(newSkills) => {
                  if (newSkills.length <= 3) {
                    setSkills(newSkills);
                  }
                }}
                placeholder="Type a skill and press enter"
              />
            </div>
          </div>
        </div>

        <div className="form-buttons" style={{ display: "flex", justifyContent: "space-between", marginTop: "2rem" }}>
          <button type="button" onClick={() => router.back()} className="red-button">
            ← Back
          </button>

          <button type="button" onClick={handleContinue} className="red-button">
            Continue →
          </button>
        </div>
      </form>
    </div>
  );
};

export default Create;