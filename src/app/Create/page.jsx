"use client";
import './create.css';
import React, { useState, useEffect } from 'react';

const Create = () => {
  const [username, setUsername] = useState('');
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');

  // Get username from local storage when component mounts
  useEffect(() => {
    const storedUser = localStorage.getItem('username');
    if (storedUser) {
      setUsername(storedUser);
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!title || !body) {
      alert('Title and description are required!');
      return;
    }

    const postData = { username, title, body };

    try {
      const response = await fetch('/api/posts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(postData),
      });

      if (response.ok) {
        alert('Post created successfully!');
        setTitle('');
        setBody('');
      } else {
        alert('Failed to create post.');
      }
    } catch (err) {
      console.error(err);
      alert('Something went wrong.');
    }
  };

  return (
    <div className="containerCreate">
      <div className="Header">
        <div className="text" style={{ justifyContent: "center" }}>
          Create a Post
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="inputs">
          <div className="user">
            <span className="label-text">Username</span>
            <div className="input">
              <input type="text" value={username} readOnly />
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
        </div>

        <div className="Sign-submit-container">
          <button className="submit" type="submit">
            Post
          </button>
        </div>
      </form>
    </div>
  );
};

export default Create;