"use client";
import { useState, useMemo, useEffect } from "react";
import CardPage from "@/components/card"; 
import Select from 'react-select';
import Navbar from "@/components/navbar";
import './page.css';

function normalize(str){
  return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
}

export default function DiscoverPaper() {
  const [query, setQuery] = useState("");
  const [visible, setVisible] = useState(9);
  const [selectedYear, setSelectedYear] = useState("");
  const [papers, setPapers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const username = window.localStorage.getItem("username");
    if (!username) {
      console.error("Username not found in localStorage");
      setLoading(false);
      return;
    }

    const url = `https://7ca26mboek.execute-api.us-east-2.amazonaws.com/dev/papersRecImage?username=${encodeURIComponent(username)}`;
    
    fetch(url)
      .then(async (res) => {
        if (!res.ok) {
          const text = await res.text();
          throw new Error(`API Error: ${res.status} - ${text}`);
        }
        const data = await res.json();
        
        // API Gateway returns the parsed body, so data should be the array directly
        // But handle both cases: direct array or wrapped response
        let papersData = Array.isArray(data) ? data : (data.body ? (Array.isArray(data.body) ? data.body : JSON.parse(data.body)) : []);
        
        // Transform DynamoDB items to frontend format
        // DynamoDB items from boto3.resource have capitalized field names
        const transformedPapers = papersData.map((paper) => ({
          paperID: paper.paperID || paper.paperid,
          title: paper.Title || paper.title || "Untitled Paper",
          author: paper.Authors || paper.author || "Unknown Author",
          date: paper.Year || paper.date || "N/A",
          tags: Array.isArray(paper.Tags) ? paper.Tags : (Array.isArray(paper.tags) ? paper.tags : []),
          pdfLink: paper.PDFLink || paper.pdfLink || `https://scholarsync-papers.s3.us-east-2.amazonaws.com/papers/${paper.paperID || paper.paperid || ''}.pdf`,
          abstract: paper.Abstract || paper.abstract || "No abstract available.",
          sourceURL: paper.SourceURL || paper.sourceURL || "",
          content: paper.Abstract || paper.abstract || paper.content || "",
          description: paper.Abstract || paper.abstract || paper.description || "",
        }));
        
        console.log("Fetched papers:", transformedPapers.length, "Sample:", transformedPapers[0]);
        setPapers(transformedPapers);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching papers:", err);
        setLoading(false);
      });
  }, []);

  const filtered = useMemo(() => {
    let out = papers;

    if (query.trim()) {
      const q = normalize(query.trim());
      out = out.filter((paper) => {
        const Names = normalize(paper.author || "");
        const authors = Names.split(",").map((individual) => individual.trim().toLowerCase());
        return (
          normalize(paper.title).includes(q) ||
          authors.some((author) => author.includes(q)) ||
          paper.tags?.some((tag) => normalize(tag).includes(q))
        );
      });
    }

    if (selectedYear && selectedYear !== "all") {
      const yearNow = new Date().getFullYear();
      const goBack = parseInt(selectedYear);
      const disp = yearNow - goBack;
      out = out.filter((paper) => {
        const paperYear = new Date(paper.date).getFullYear();
        return paperYear >= disp;
      });
    }

    return out;
  }, [query, selectedYear, papers]);

  const toShow = filtered.slice(0, visible);
  const canLoadMore = visible < filtered.length;

  if (loading) {
    return <div className="text-white p-4">Loading papers...</div>;
  }

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#F9FAFB' }}>
      <div className="relative z-10 bg-white border-white rounded-b-2xl shadow">
      <Navbar />
    </div>
    <div className="-mt-5 w-full bg-[#F9FAFB] border-b-2 border-[#E0E0E0] shadow-sm pt-3 pb-2">
      <div className="w-full px-6 py-3 flex items-center gap-6">
            <input
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                setVisible(9);
              }}
              placeholder="Search papers, authors, or tags"
              className="w-76 md:w-96 mt-3 rounded-md border border-[#E0E0E0] bg-[#ffffff] ] text-[#111111] placeholder-black px-3 py-2 text-m focus-visible:outline-none "
            />

            <select
        className="w-48 rounded-md mt-3 border border-[#E0E0E0] bg-[#ffffff]  px-3 py-2 text-m text-[#111111] focus-visible:outline-none"

            placeholder = "Date Published"
            value={selectedYear}
            onChange={(e) => {
            setSelectedYear(e.target.value);
            setVisible(9);
          }}>
    
          <option value="all">Date Published: All</option>
          <option value="5">Last 5 years</option>
          <option value="10">Last 10 years</option>
        </select>


      </div>
    </div>

    <main className="mx-auto px-20 py-15">
      <div className="papers-grid gap-8 sm:grid-cols-2 items-stretch ">
        {toShow.map(paper => (
          <CardPage key={paper.paperID} paper={paper} />
        ))}
      </div>

      <div className="mt-8 flex justify-center">
        {canLoadMore ? (
          <button
            type="button"
            onClick={() => setVisible(v => v + 6)}
            className="rounded-md border border-gray-300 bg-[#ef4444] px-5 py-2 text-sm font-medium text-white"
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