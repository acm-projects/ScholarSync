"use client";

import React, { createContext, useState } from "react";

export const OnboardingCtx = createContext(null);

export default function Layout({ children }) {
  const [data, setData] = useState({
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
  setData(data.map(item.allTags, tokenize(item.allTags)));

  const submitData = async () => {
    console.log("Onboarding data ready to submit:", data);

    const formData = new FormData();
    for (const key in data) {
      if (Array.isArray(data[key])) {
        formData.append(key, JSON.stringify(data[key]));
      } else if (data[key] !== null) {
        formData.append(key, data[key]);
      }
    }

    await fetch("/api/user", {
      method: "POST",
      body: formData,
    });
  };

  return (
    <OnboardingCtx.Provider value={{ data, handleChange, setData, submitData }}>
      {children}
    </OnboardingCtx.Provider>
  );
}

