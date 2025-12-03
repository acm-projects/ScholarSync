"use client";

import React, { createContext, useState, useEffect } from "react";

export const OnboardingCtx = createContext(null);

export default function Layout({ children }) {
  const [data, setData] = useState({
    username: "",
    firstname: "",
    lastname: "",
    major: "",
    minor: "",
    year: "",
    skills: [],
    projectTypes: [],
    interests: [],
    fields: [],
    researchTypes: [],
    careerGoals: [],
    resumeFile: null,
    allTags: []
  });

  // Load username from localStorage on client side only
  useEffect(() => {
    if (typeof window !== "undefined") {
      const username = window.localStorage.getItem("username");
      if (username) {
        setData((prev) => ({ ...prev, username }));
      }
    }
  }, []);

  const handleChange = (eOrObj) => {
    const { name, value } = eOrObj.target ? eOrObj.target : eOrObj;
    setData((prev) => ({ ...prev, [name]: value }));
  };

  // Tokenizes tags (list of strings) into list of lists of tokens
  function tokenize(tags) {
    const stopWords = new Set([
      "the", "is", "a", "and", "with", "this", "of", "for", "in", "on", "to", "by"
    ]);

    // Tokenizes input
    function extractKeywords(text) {
      // Match words including accented letters
      const words = text.match(/\b\p{L}+\b/gu); 
      return words 
        ? words
          .map(word => word.toLowerCase())
          .filter(word => !stopWords.has(word))
        : [];
    }

    // Tokenizes multiple strings into a list of lists of tokens
    function tokenizeTexts(texts) {
      return texts.map(text => extractKeywords(text));
    }

    return tokenizeTexts(tags);
  }

  // Tokenize all tags
  useEffect(() => {
    setData(prev => ({
      ...prev,
      allTags: tokenize(prev.allTags)
    }));
  }, []);

  const submitData = async () => {
    console.log("Onboarding data ready to submit:", data);

    // Combine all tag arrays into a single tags array for the lambda functions
    // The lambda functions expect a simple array of tag strings
    const allTagArrays = [
      ...(data.skills || []),
      ...(data.projectTypes || []),
      ...(data.interests || []),
      ...(data.fields || []),
      ...(data.researchTypes || []),
      ...(data.careerGoals || []),
    ];
    const tags = Array.from(new Set(allTagArrays)); // Remove duplicates

    console.log("Combined tags array:", tags);
    console.log("Tags length:", tags.length);

    // Prepare the payload - exclude resumeFile and allTags, add tags
    const payload = {
      username: data.username,
      firstname: data.firstname,
      lastname: data.lastname,
      major: data.major,
      minor: data.minor,
      year: data.year,
      skills: data.skills,
      interests: data.interests,
      tags: tags, // This is what the lambda functions expect
      allTags: data.allTags, // Keep for backward compatibility if needed
    };
    
    console.log("Payload being sent:", { ...payload, tags: payload.tags });

    // Only include resumeFile if it's a string (URL), not a File object
    if (data.resumeFile && typeof data.resumeFile === 'string') {
      payload.resumeFile = data.resumeFile;
    }

    const response = await fetch("/api/user", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      // Check if response is JSON before parsing
      const contentType = response.headers.get("content-type");
      let errorMessage = `API error: ${response.status}`;
      
      if (contentType && contentType.includes("application/json")) {
        try {
          const error = await response.json();
          errorMessage = error.error || errorMessage;
        } catch (e) {
          // If JSON parsing fails, use the status text
          errorMessage = response.statusText || errorMessage;
        }
      } else {
        // If it's not JSON (might be HTML error page), get text
        try {
          const text = await response.text();
          errorMessage = text || errorMessage;
        } catch (e) {
          errorMessage = response.statusText || errorMessage;
        }
      }
      
      throw new Error(errorMessage);
    }

    // Parse JSON response only if content type is JSON
    const contentType = response.headers.get("content-type");
    if (contentType && contentType.includes("application/json")) {
      return response.json();
    } else {
      // If not JSON, return the text
      return { message: await response.text() };
    }
  };

  return (
    <OnboardingCtx.Provider value={{ data, handleChange, setData, submitData }}>
      {children}
    </OnboardingCtx.Provider>
  );
}

