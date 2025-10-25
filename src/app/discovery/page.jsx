"use client";
import { useState, useMemo, useEffect } from "react";
import CardPage from "@/components/card"; 
import Navbar from "@/components/navbar";
import "./page.css";

function normalize(str = "") {
  return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
}

export default function DiscoverPaper() {
  const [query, setQuery] = useState("");
  const [visible, setVisible] = useState(9);
  const [selectedYear, setSelectedYear] = useState("");
  const [papers, setPapers] = useState([]);
  const [loading, setLoading] = useState(true);

  // 🧠 Fetch from your real API (connected to DynamoDB)
  useEffect(() => {
    fetch("/api/paper") // uses your route.js
      .then(async (res) => {
        if (!res.ok) {
          const text = await res.text();
          throw new Error(`API Error: ${res.status} - ${text}`);
        }
        return res.json();
      })
      .then((data) => {
        setPapers(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching papers:", err);
        setLoading(false);
      });
  }, []);

  // 🔍 Search + filter logic
  const filtered = useMemo(() => {
    let out = papers;

    if (query.trim()) {
      const q = normalize(query.trim());
      out = out.filter((paper) => {
        const authors = normalize(paper.author || "")
          .split(",")
          .map((a) => a.trim().toLowerCase());
        return (
          normalize(paper.title).includes(q) ||
          authors.some((a) => a.includes(q)) ||
          paper.tags?.some((t) => normalize(t).includes(q))
        );
      });
    }

    if (selectedYear && selectedYear !== "all") {
      const yearNow = new Date().getFullYear();
      const goBack = parseInt(selectedYear);
      const minYear = yearNow - goBack;
      out = out.filter((paper) => parseInt(paper.date) >= minYear);
    }

    return out;
  }, [query, selectedYear, papers]);

  const toShow = filtered.slice(0, visible);
  const canLoadMore = visible < filtered.length;

  if (loading) {
    return <div className="text-white p-4">Loading papers...</div>;
  }

  return (
    <div className="min-h-screen" style={{ backgroundColor: "#3D110F" }}>
      <div className="relative z-10 bg-white border-white rounded-b-2xl shadow">
        <Navbar />
      </div>

      <div className="-mt-5 w-full bg-[#3D110F] border-b-2 border-[#5A2B29] shadow-sm pt-3 pb-2">
        <div className="w-full px-6 py-3 flex items-center gap-6">
          {/* 🔍 Search */}
          <input
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setVisible(9);
            }}
            placeholder="Search papers, authors, or tags"
            className="w-80 md:w-96 rounded-md border border-[#5A2B29] bg-[#201311] px-3 py-2 text-m text-[#EEEef0] placeholder-[#EEEef0]/60 hover:bg-[#3C1A19] focus-visible:outline-none focus-visible:border-2 focus-visible:border-[#BA3F3D]"
          />

          {/* 📅 Year filter */}
          <select
            className="w-48 rounded-md border border-[#5A2B29] bg-[#201311] px-3 py-2 text-m text-[#EEEef0]/60 hover:bg-[#3C1A19] focus-visible:outline-none focus-visible:border-2 focus-visible:border-[#BA3F3D]"
            value={selectedYear}
            onChange={(e) => {
              setSelectedYear(e.target.value);
              setVisible(9);
            }}
          >
            <option value="all">Date Published: All</option>
            <option value="5">Last 5 years</option>
            <option value="10">Last 10 years</option>
          </select>
        </div>
      </div>

      {/* 🧱 Main papers grid */}
      <main className="mx-auto px-20 py-15">
        <div className="grid gap-8 sm:grid-cols-2 items-stretch">
          {toShow.map((paper) => (
            <CardPage
              key={paper.id}
              paper={paper}
              onClick={() => (window.location.href = `/papers/${paper.id}`)}
            />
          ))}
        </div>

        <div className="mt-8 flex justify-center">
          {canLoadMore ? (
            <button
              type="button"
              onClick={() => setVisible((v) => v + 6)}
              className="rounded-md border border-gray-300 bg-white px-5 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50"
            >
              Load more Papers
            </button>
          ) : (
            <div className="text-sm text-white/80">No more results</div>
          )}
        </div>
      </main>
    </div>
  );
}
