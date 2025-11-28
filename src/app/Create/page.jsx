'use client';
import './create.css';
import React, { useState } from 'react';
import TagTextBox from "@/components/tagtextbox";

const Create = () => {
  // Get username from localStorage, cannot be changed
  const [username] = useState(() => localStorage.getItem('username') || '');
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [skills, setSkills] = useState([]);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!username || !title || !body) {
      setError("Please fill all required fields.");
      return;
    }

    setLoading(true);
    setError('');
    setSuccess(false);

    try {
      const res = await fetch('/api/posts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, title, body, skills }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to create post");

      setSuccess(true);
      setTitle('');
      setBody('');
      setSkills([]);
    } catch (err) {
      console.error(err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="containerCreate">
      <div className="Header">
        <div className="text" style={{ justifyContent:"center" }}>
          Create a Post
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="inputs">
          <div className="user">
            <span className="label-text">Username</span>
            <div className="input">
              <input
                type="text"
                value={username || 'No username found in localStorage'}
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

        {error && <p style={{ color: 'red', marginTop: '0.5rem' }}>{error}</p>}
        {success && <p style={{ color: 'green', marginTop: '0.5rem' }}>Post created successfully!</p>}

        <div className="Sign-submit-container">
          <button className="submit" type="submit" disabled={loading}>
            {loading ? 'Posting...' : 'Post'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default Create;