"use client";

import React, { useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import '@/app/create/create.css';

const Step2 = () => {
  const searchParams = useSearchParams();
  const router = useRouter();

  // Step1 data
  const username = searchParams.get("username") || "";
  const title = searchParams.get("title") || "";
  const body = searchParams.get("body") || "";
  const tags = JSON.parse(searchParams.get("tags") || "[]");

  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

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
      // Upload image to S3 if provided and get the imageUrl
      let imageUrl = null;
      if (image && image.size > 0) {
        const imageFormData = new FormData();
        imageFormData.append('image', image);
        
        const imageRes = await fetch('/api/upload-image', {
          method: 'POST',
          body: imageFormData,
        });

        if (!imageRes.ok) {
          const errorData = await imageRes.json();
          throw new Error(errorData.error || 'Failed to upload image');
        }

        const imageData = await imageRes.json();
        imageUrl = imageData.imageUrl || null;
      }

      // Send all data including imageUrl to Lambda function
      const res = await fetch('https://5076bt2yjd.execute-api.us-east-2.amazonaws.com/dev/postOpportunity', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          username, 
          title, 
          body, 
          tags,
          imageUrl,
          email: email || null,
          phone: phone || null,
        }),
      });

      let data;
      const contentType = res.headers.get('content-type');
      if (contentType && contentType.includes('application/json')) {
        data = await res.json();
        // Handle API Gateway Lambda proxy response format
        if (data.body && typeof data.body === 'string') {
          data = JSON.parse(data.body);
        }
      } else {
        const text = await res.text();
        data = text ? JSON.parse(text) : {};
      }

      if (res.ok) {
        router.push("/homeresearchpage");
      } else {
        alert("Upload failed: " + (data.error || "Unknown error"));
      }

      setSuccess(true);
    } catch (err) {
      console.error(err);
      setError(err.message || "Failed to create post. Please try again.");
    } finally {
      setLoading(false);
    }
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
            onClick={() => router.back()}
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