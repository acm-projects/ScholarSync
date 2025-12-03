"use client";

import { useMemo, useState, useEffect } from "react";
import Navbar from "@/components/navbar";
import ToggleTabs from "@/components/toggletabsprofessor";
import ProfessorCard from "@/components/professorcard";
import FullProfessorCard from "@/components/fullprofessorcard";
import { normalizeAllItems } from "@/components/pagesort";
import userTags from "@/data/user_tags.json" assert { type: "json" };
import Loading from "@/components/loading";

function computePctFromTags(tags) {
  if (!tags || Array.isArray(tags)) return 0;

  const green = Array.isArray(tags.green) ? tags.green.length : 0;
  const yellow = Array.isArray(tags.yellow) ? tags.yellow.length : 0;
  const red = Array.isArray(tags.red) ? tags.red.length : 0;

  const W = { green: 33.3333, yellow: 22.2222, red: 11.1111 };

  let remaining = 3;
  let score = 0;

  const takeGreen = Math.min(remaining, green);
  score += takeGreen * W.green;
  remaining -= takeGreen;

  if (remaining > 0) {
    const takeYellow = Math.min(remaining, yellow);
    score += takeYellow * W.yellow;
    remaining -= takeYellow;
  }

  if (remaining > 0) {
    const takeRed = Math.min(remaining, red);
    score += takeRed * W.red;
    remaining -= takeRed;
  }

  return Math.min(100, Math.round(score));
}

export default function ProfessorsPage() {
  const [tab, setTab] = useState("recommended");
  const [query, setQuery] = useState("");
  const [visible, setVisible] = useState(6);
  const [profAll, setProfAll] = useState(null);
  const [loadingProfAll, setLoadingProfAll] = useState(true);
  const [profRecommended, setProfRecommended] = useState(null);
  const [loadingProfRecommended, setLoadingProfRecommended] = useState(true);
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState(null);

  // Fetch profAll from API on component mount
  useEffect(() => {
    const username = window.localStorage.getItem("username");
    if (!username) {
      setLoadingProfAll(false);
      console.log("No username found");
      return;
    }

    console.log("Username found:", username);
    const url = `https://tzupgr575f.execute-api.us-east-2.amazonaws.com/dev/professorAllImage?username=${encodeURIComponent(username)}`;
    console.log("Fetching profAll from:", url);

    fetch(url)
      .then(async (response) => {
        console.log("API response status:", response.status);
        if (!response.ok) {
          // Try to get error message from response body
          let errorMessage = `HTTP error! status: ${response.status}`;
          try {
            const errorData = await response.json();
            errorMessage = errorData.message || errorData.error || JSON.stringify(errorData);
            console.error("API error response:", errorData);
          } catch (e) {
            // If response body isn't JSON, try to get text
            try {
              const errorText = await response.text();
              errorMessage = errorText || errorMessage;
              console.error("API error response (text):", errorText);
            } catch (e2) {
              console.error("Could not parse error response");
            }
          }
          throw new Error(errorMessage);
        }
        return response.json();
      })
      .then((data) => {
        // Handle API Gateway Lambda proxy response format
        let processedData = data;
        if (data.body && typeof data.body === 'string') {
          processedData = JSON.parse(data.body);
        } else if (data.body && Array.isArray(data.body)) {
          processedData = data.body;
        }
        
        processedData = Array.isArray(processedData) ? processedData : [];
        console.log("API returned:", processedData.length, "professors");
        // Debug: Check if photos are in the data
        if (processedData.length > 0) {
          console.log("Sample professor data:", processedData[0]);
          console.log("Has photo field:", processedData[0].photo);
        }
        setProfAll(processedData);
        setLoadingProfAll(false);
      })
      .catch((error) => {
        console.error("Error fetching professor data:", error);
        setProfAll([]);
        setLoadingProfAll(false);
      });
  }, []);

  // Fetch profRecommended from API on component mount
  useEffect(() => {
    const username = window.localStorage.getItem("username");
    if (!username) {
      setLoadingProfRecommended(false);
      console.log("No username found for recommended professors");
      return;
    }

    console.log("Username found for recommended:", username);
    const url = `https://tzupgr575f.execute-api.us-east-2.amazonaws.com/dev/professorRecImage?username=${encodeURIComponent(username)}`;
    console.log("Fetching profRecommended from:", url);

    fetch(url)
      .then(async (response) => {
        console.log("API response status:", response.status);
        if (!response.ok) {
          // Try to get error message from response body
          let errorMessage = `HTTP error! status: ${response.status}`;
          try {
            const errorData = await response.json();
            errorMessage = errorData.message || errorData.error || JSON.stringify(errorData);
            console.error("API error response:", errorData);
          } catch (e) {
            // If response body isn't JSON, try to get text
            try {
              const errorText = await response.text();
              errorMessage = errorText || errorMessage;
              console.error("API error response (text):", errorText);
            } catch (e2) {
              console.error("Could not parse error response");
            }
          }
          throw new Error(errorMessage);
        }
        return response.json();
      })
      .then((data) => {
        // Handle API Gateway Lambda proxy response format
        let processedData = data;
        if (data.body && typeof data.body === 'string') {
          processedData = JSON.parse(data.body);
        } else if (data.body && Array.isArray(data.body)) {
          processedData = data.body;
        }
        
        processedData = Array.isArray(processedData) ? processedData : [];
        console.log("API returned:", processedData.length, "recommended professors");
        // Debug: Check if photos are in the data
        if (processedData.length > 0) {
          console.log("Sample professor data:", processedData[0]);
          console.log("Has photo field:", processedData[0].photo);
        }
        setProfRecommended(processedData);
        setLoadingProfRecommended(false);
      })
      .catch((error) => {
        console.error("Error fetching recommended professor data:", error);
        setProfRecommended([]);
        setLoadingProfRecommended(false);
      });
  }, []);

  const dataset = useMemo(() => {
    return tab === "recommended"
      ? profRecommended ? normalizeAllItems(profRecommended, userTags) : []
      : profAll ? normalizeAllItems(profAll, userTags) : [];
  }, [tab, profAll, profRecommended]);

  const filtered = useMemo(() => {
    let out = dataset;

    if (query.trim()) {
      const q = query.toLowerCase();
      out = out.filter((it) => {
        const tagArray = Array.isArray(it.tags)
          ? it.tags
          : Object.values(it.tags || {}).flat();
        const hay = [
          it.name || it.full_name,
          it.field || it.department || it.subtitle,
          it.summary || it.bio,
          ...(tagArray || []),
          ...(it.tagsList || []),
        ]
          .filter(Boolean)
          .map((x) => String(x).toLowerCase());
        return hay.some((s) => s.includes(q));
      });
    }

    return out;
  }, [dataset, query, tab]);

  const toShow = filtered.slice(0, visible);
  const canLoadMore = visible < filtered.length;

  if ((tab === "all" && loadingProfAll) || (tab === "recommended" && loadingProfRecommended)) {
    return <Loading />;
  }

  return (
    <div className="min-h-screen bg-[#f5f5f5] text-[#111827]">
      <div className="relative z-10 rounded-b-2xl shadow">
        <Navbar />
      </div>

      <div
        className={`-mt-5 w-full bg-[#ffffff] border-b border-[#e5e7eb] shadow-sm pt-3 pb-2 ${
          open ? "blur-[2px]" : ""
        }`}
      >
        <div className="w-full px-6 pt-5 pb-4 flex items-center">
          <div className="flex items-center gap-6 overflow-x-auto flex-1 min-w-0">
            <ToggleTabs
              value={tab}
              onChange={(v) => {
                setTab(v);
                setVisible(6);
              }}
            />
          </div>

          <div className="ml-auto flex items-center gap-4 shrink-0">
            <input
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                setVisible(6);
              }}
              placeholder="Search professors, fields, or tags…"
              className="w-80 md:w-96 rounded-md border border-[#d1d5db] bg-[#ffffff] px-3 py-2 text-m text-[#111827] placeholder-[#9ca3af] 
                         hover:border-[#ef4444] focus-visible:outline-none focus-visible:border-2 focus-visible:border-[#ef4444]"
            />
          </div>
        </div>
      </div>

      <main className={`mx-auto px-20 mt-10 ${open ? "blur-[2px]" : ""}`}>
        <div className="grid gap-8 sm:grid-cols-2 items-stretch ">
          {toShow.map((item) => {
            const pid = String(item.id || item.email || item.full_name);
            const href = `/professorpage/fullcardpage?id=${encodeURIComponent(pid)}`;

            return (
              <ProfessorCard
                key={pid}
                item={item}
                showPct={true}
                userTags={userTags}
                href={href}
                onOpen={(it) => {
                  setSelected(it);
                  setOpen(true);
                }}
              />
            );
          })}
        </div>

        <div className="mt-8 flex justify-center">
          {canLoadMore ? (
            <button
              type="button"
              onClick={() => setVisible((v) => v + 6)}
              className="rounded-md border border-[#d1d5db] bg-[#ef4444] px-5 py-2 text-sm font-medium text-white shadow-sm hover:bg-[#dc2626] hover:border-[#dc2626] focus-visible:outline-none focus-visible:border-2 focus-visible:border-[#b91c1c] transition"
            >
              Load more professors
            </button>
          ) : (
            <div className="text-sm text-[#6b7280]">No more results</div>
          )}
        </div>
      </main>

      {open && selected && (
        <div className="fixed inset-0 z-50 flex items-start md:items-center justify-center">
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-[2px]"
            onClick={() => {
              setOpen(false);
              setSelected(null);
            }}
          />
          <div className="relative z-10 w-full max-w-6xl mx-4 my-6">
            <div className="rounded-2xl overflow-hidden">
              <FullProfessorCard
                item={selected}
                onClose={() => {
                  setOpen(false);
                  setSelected(null);
                }}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}