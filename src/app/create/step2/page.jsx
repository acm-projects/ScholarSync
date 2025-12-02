"use client";

import React, { useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import '@/app/create/create.css';

const Step2 = () => {
  const searchParams = useSearchParams();
  const router = useRouter();

  const username = searchParams.get("username") || "";
  const title = searchParams.get("title") || "";
  const body = searchParams.get("body") || "";
  const skills = JSON.parse(searchParams.get("skills") || "[]");

  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [image, setImage] = useState(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = { username, title, body, skills, email, phone, image };
    console.log("Final data:", formData);
    router.push("/professorpage");
  };

  return (
    <div className="containerCreate">
      <div className="Header">
        <div className="text" style={{ justifyContent: "center" }}>
          Contact Info & Upload Image
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="inputs">
          <div className="user">
            <span className="label-text">Email</span>
            <div className="input">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email"
              />
            </div>
          </div>

          <div className="user">
            <span className="label-text">Phone</span>
            <div className="input">
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="Phone Number"
              />
            </div>
          </div>
        </div>

        <div className="rounded-2xl border-2 border-dashed border-[#e5e7eb] h-80 flex flex-col items-center justify-center text-center p-14 bg-[#f9fafb] mt-6">
          <div className="text-7xl mb-6">⬆️</div>
          <p className="text-2xl font-bold text-[#111827]">Upload your image</p>
          <p className="mt-2 text-base text-[#6b7280]">
            JPG, PNG (Max 5MB)
          </p>

          <input
            type="file"
            accept="image/*"
            onChange={(e) => setImage(e.target.files?.[0] || null)}
            className="mt-6 block w-full text-base text-[#111827]
                       file:mr-4 file:rounded-md file:border file:border-[#d1d5db]
                       file:bg-[#ef4444] file:px-5 file:py-3 file:text-base file:font-medium file:text-white
                       hover:file:bg-[#dc2626] focus:outline-none"
          />
        </div>

        <div className="form-buttons" style={{ display: "flex", gap: "1rem", marginTop: "2rem" }}>
          <button
            type="button"
            className="red-button"
            onClick={() => router.push(`/create?${searchParams.toString()}`)}
          >
            ← Back
          </button>

          <button
            type="submit"
            className="red-button"
            style={{ marginLeft: "auto" }}
          >
            Post
          </button>
        </div>
      </form>
    </div>
  );
};

export default Step2;
