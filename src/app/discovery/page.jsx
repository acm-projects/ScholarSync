"use client";
import { useState, useMemo } from "react";
import CardPage from "@/components/card"; 
import Select from 'react-select';
import Navbar from "@/components/navbar";
import PaperData from "@/data/papers.json" assert { type: "json" };
import './page.css';




export default function DiscoverPaper() {
  const [query, setQuery] = useState("");
  const [visible, setVisible] = useState(9);
  const [authorFilter, setAuthorFilter] = useState("");
  const [selectedKeyword, setSelectedKeyword] = useState(null);
  const [selectedYear, setSelectedYear] = useState("false");

  const filtered = useMemo(() => {
    let out = PaperData;

    if (query.trim()) {
      const q = query.toLowerCase();
      out = out.filter((paper) =>
        paper.title.toLowerCase().includes(q)
      );
    }

    if (authorFilter) {
      const a = authorFilter.toLowerCase();
      out = out.filter((paper) =>
        paper.author.toLowerCase().includes(a)
      );
    }

    if (selectedKeyword) {
      out = out.filter((paper) =>
        paper.tags?.some(
          (tag) =>
            tag.toLowerCase() ===
            selectedKeyword.value.toLowerCase()
        )
      );
    }

  if (selectedYear !== "false") {
  const yearNow = new Date().getFullYear();
  const goBack = parseInt(selectedYear);
  const disp = yearNow - goBack;

  out = out.filter((paper) => {
    const paperYear = new Date(paper.date).getFullYear();
    return paperYear >= disp;
  });
  }
    return out;
  }, [query, authorFilter, selectedKeyword, selectedYear]);

  const toShow = filtered.slice(0, visible);
  const canLoadMore = visible < filtered.length;

  return (
    <div className="min-h-screen bg-blue-500">
      <div className="relative z-10 bg-white rounded-b-2xl shadow">
      <Navbar />
    </div>
    <div className="relative z-0 -mt-2 w-full bg-white shadow-sm py-3">
      <div className="w-full px-6 py-3 flex items-center gap-6">
        
      
        <input
          type="text"
          className="w-80 md:w-96 rounded-md border border-gray-500 px-3 py-2 text-m text-black placeholder-black"
          placeholder="Search papers"
          value={query}
          onChange={e => {
            setQuery(e.target.value);
            setVisible(9);
          }}
        />
        
        
        <Select
          className="w-90"
          options={[...new Set(PaperData.flatMap(p => p.author.split(',').map(a => a.trim())))].map(a => ({ label: a, value: a }))}
          placeholder="Search author"
          isClearable
          onChange={option => {
            setAuthorFilter(option?.value || "");
            setVisible(9);
          }}
        />

        
        <Select
          className="w-48"
          options={[...new Set(PaperData.flatMap(p => p.tags))].map(k => ({ label: k, value: k }))}
          placeholder="Search keywords..."
          isClearable
          onChange={option => {
            setSelectedKeyword(option || null);
            setVisible(9);
          }}
        />


      <select
      className="w-48 rounded-md border border-gray-500 bg-white px-3 py-2 text-base text-black"
      value={selectedYear}
      onChange={(e) => {
      setSelectedYear(e.target.value);
      setVisible(9);
    }}
  >
    <option value="false">All years</option>
    <option value="5">Last 5 years</option>
    <option value="10">Last 10 years</option>
  </select>


      </div>
    </div>

    <main className="mx-auto px-20 py-15">
      <div className="grid gap-8 sm:grid-cols-2 items-stretch">
        {toShow.map(paper => (
          <CardPage key={paper.id} paper={paper} />
        ))}
      </div>

      <div className="mt-8 flex justify-center">
        {canLoadMore ? (
          <button
            type="button"
            onClick={() => setVisible(v => v + 6)}
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
