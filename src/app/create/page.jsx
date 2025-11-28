"use client";
import './create.css';
import React, { useState } from 'react';
import TagTextBox from "@/components/tagtextbox";

const Create = () => {
  const [username, setUsername] = useState('');
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [skills, setSkills] = useState([]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const postData = {
      username,
      title,
      body,
    };
   
  };

  return (
      <div className="containerCreate">
        <div className="Header">
          <div className="text " style={{ justifyContent:"center" }}>
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
        placeholder="Username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
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
  <span className="label-text">Add skills most relevant to this role</span>

  <div className="input">
    <TagTextBox
      label=""             
      name="skills"
      values={skills}
      onChange={setSkills}
      placeholder="Type a skill and press enter"
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