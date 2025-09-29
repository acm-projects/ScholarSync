"use client";

import { useMemo, useState } from "react";
import Navbar from "@/components/navbar";
import ToggleTabs from "@/components/toggletabs";
import OpportunityCard from "@/components/opportunitycard";
import recommendedData from "@/data/opportunities_recommended.json";
import allData from "@/data/opportunities_all.json";
import userTags from "@/data/user_tags.json";



function categorizeFromUser(flatTags = [], profile) {
  const out = { green: [], yellow: [], red: [] };
  for (const t of flatTags) {
    if (profile.green.includes(t)) out.green.push(t);
    else if (profile.yellow.includes(t)) out.yellow.push(t);
    else if (profile.red.includes(t)) out.red.push(t);
  }
  return out;
}

function normalizeAllItems(items, profile) {
  return items.map((it) => ({
    ...it,
    tags: categorizeFromUser(it.tags || [], profile),
  }));
}

function sortByDate(items, mode) {
  return [...items].sort((a, b) => {
    const da = new Date(a.datePosted).getTime();
    const db = new Date(b.datePosted).getTime();
    return mode === "oldest" ? da - db : db - da;
  });
}

export default function OpportunitiesPage() {
  const [tab, setTab] = useState("recommended");
  const [sort, setSort] = useState("recent");
  const [query, setQuery] = useState("");
  const [visible, setVisible] = useState(6);

  const dataset = useMemo(() => {
    return tab === "recommended"
      ? recommendedData
      : normalizeAllItems(allData, userTags);
  }, [tab]);

  const filtered = useMemo(() => {
    let out = dataset;
    if (query.trim()) {
      const q = query.toLowerCase();
      out = out.filter((it) => it.title.toLowerCase().includes(q));
    }
    return sortByDate(out, sort);
  }, [dataset, sort, query]);

  const toShow = filtered.slice(0, visible);
  const canLoadMore = visible < filtered.length;

  return (
    <div className="min-h-screen bg-blue-500">
      {/* Rounded navbar wrapper */}
      <div className="relative z-10 bg-white rounded-b-2xl shadow">
        <Navbar />
      </div>

      {/* Full-bleed filter bar */}
      <div className="relative z-0 -mt-2 w-full bg-white shadow-sm py-3">
        <div className="w-full px-6 py-3 flex items-center">
          {/* LEFT: tabs + filters */}
          <div className="flex items-center gap-6 overflow-x-auto flex-1 min-w-0">
            <ToggleTabs
              value={tab}
              onChange={(v) => {
                setTab(v);
                setVisible(6);
              }}
            />
            <div className="flex items-center gap-2">
              <span className="whitespace-nowrap text-sm font-medium text-gray-700">
                Filters:
              </span>
              {["Paid", "Remote", "Part-time", "UG-friendly"].map((p) => (
                <button
                  key={p}
                  type="button"
                  className="whitespace-nowrap rounded-full border border-gray-200 bg-white px-3 py-1 text-xs text-gray-700 hover:bg-gray-50"
                >
                  {p}
                </button>
              ))}
            </div>
          </div>

          <div className="ml-auto flex items-center gap-4 shrink-0">
            <select
              value={sort}
              onChange={(e) => {
                setSort(e.target.value);
                setVisible(6);
              }}
              className="rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900"
            >
              <option value="recent">Date posted: Recent</option>
              <option value="oldest">Date posted: Oldest</option>
            </select>

            <input
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                setVisible(6);
              }}
              placeholder="Search by title…"
              className="w-80 md:w-96 rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-900 placeholder-gray-400"
            />
          </div>
        </div>
      </div>

      <main className="mx-auto max-w-7xl px-8 py-8">
        <div className="grid gap-8 sm:grid-cols-2 items-stretch">
          {toShow.map((item) => (
            <OpportunityCard
              key={item.id}
              item={item}
              showPct={tab === "recommended"}
              userTags={userTags}
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
              Load more opportunities
            </button>
          ) : (
            <div className="text-sm text-white/80">No more results</div>
          )}
        </div>
      </main>
    </div>
  );
}
