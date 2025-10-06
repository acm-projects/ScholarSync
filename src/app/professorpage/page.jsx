"use client";

import { useMemo, useState } from "react";
import Navbar from "@/components/navbar";
import ToggleTabs from "@/components/toggletabsprofessor";
import ProfessorCard from "@/components/professorcard";
import { normalizeAllItems } from "@/components/pagesort";
import profRecommended from "@/data/professors_recommended.json" assert { type: "json" };
import profAll from "@/data/professors_all.json" assert { type: "json" };
import userTags from "@/data/user_tags.json" assert { type: "json" };

export default function ProfessorsPage() {
  const [tab, setTab] = useState("recommended");
  const [query, setQuery] = useState("");
  const [visible, setVisible] = useState(6);

  // usememo here to keep cards from stopping to rerender after every user actoin
  // compare and pass in data and user tags
  const dataset = useMemo(() => {
    return tab === "recommended"
      ? normalizeAllItems(profRecommended, userTags)
      : normalizeAllItems(profAll, userTags);
  }, [tab]);

  // filter by query and then sort by tag relevance (green > yellow > red)
  const filtered = useMemo(() => {
    let out = dataset;

    if (query.trim()) {
      const q = query.toLowerCase();
      out = out.filter((it) => {
        const tagArray = Array.isArray(it.tags)
          ? it.tags
          : Object.values(it.tags || {}).flat()
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

    const score = (obj) =>
      (obj?.tags?.green?.length || 0) * 3 +
      (obj?.tags?.yellow?.length || 0) * 2 +
      (obj?.tags?.red?.length || 0) * 1;

    return [...out].sort((a, b) => score(b) - score(a));
  }, [dataset, query]);

  const toShow = filtered.slice(0, visible);
  const canLoadMore = visible < filtered.length;

  return (
    <div className="min-h-screen bg-blue-500">
      <div className="relative z-10 bg-white rounded-b-2xl shadow">
        <Navbar />
      </div>

      <div className="relative z-0 -mt-2 w-full bg-white shadow-sm py-3">
        <div className="w-full px-6 py-3 flex items-center">
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
              className="w-80 md:w-96 rounded-md border border-gray-500 px-3 py-2 text-m text-black placeholder-gray-400"
            />
          </div>
        </div>
      </div>


      <main className="mx-auto px-20 py-15">
        <div className="grid gap-8 sm:grid-cols-2 items-stretch">
          {toShow.map((item) => (
            <ProfessorCard
              key={item.id || item.email || item.name}
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
              Load more professors
            </button>
          ) : (
            <div className="text-sm text-white/80">No more results</div>
          )}
        </div>
      </main>
    </div>
  );
}
