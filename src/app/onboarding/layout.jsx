"use client";

import React, { createContext, useState } from "react";

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
    extraQ1: [],
    extraQ2: [],
    extraQ3: [],
    extraQ4: [],
    extraQ5: [],
    extraQ6: [],
    alltags: [],
  });

  const handleChange = (eOrObj) => {
    const { name, value } = eOrObj.target ? eOrObj.target : eOrObj;
    setData((prev) => ({ ...prev, [name]: value }));
  };

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

    await fetch("api.com", {
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

