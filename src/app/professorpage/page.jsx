"use client";

import { useMemo, useState, useEffect } from "react";
import Navbar from "@/components/navbar";
import ToggleTabs from "@/components/toggletabsprofessor";
import ProfessorCard from "@/components/professorcard";
import FullProfessorCard from "@/components/fullprofessorcard";
import { normalizeAllItems } from "@/components/pagesort";
import profRecommended from "@/data/professors_recommended.json" assert { type: "json" };
import profAll from "@/data/professors_all.json" assert { type: "json" };
import userTags from "@/data/user_tags.json" assert { type: "json" };
import Loading from "@/components/loading";

export default function ProfessorsPage() {
  const [tab, setTab] = useState("recommended");
  const [query, setQuery] = useState("");
  const [visible, setVisible] = useState(6);

  // dataset pick based on tab
  const dataset = useMemo(() => {
    return tab === "recommended"
      ? normalizeAllItems(profRecommended, userTags)
      : normalizeAllItems(profAll, userTags);
  }, [tab]);



   // show loading if profAll is empty
   if (tab === "all" && profAll === null) {
    return <Loading />;
  }
  
  // filter + simple relevance sort
  const filtered = useMemo(() => {
    let out = dataset;
    if (query.trim()) {
      const q = query.toLowerCase();
      out = out.filter((it) => {
        const tagArray = Array.isArray(it.tags) ? it.tags : Object.values(it.tags || {}).flat();
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

  // page size
  const toShow = filtered.slice(0, visible);
  const canLoadMore = visible < filtered.length;

  // helper: fallback photo by email
  const emailToPhotoPath = (email) =>
    email ? `/images/picure/${String(email).toLowerCase()}.jpg` : null;

  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState(null);

  return (
    <div className="min-h-screen bg-[#f5f5f5] text-[#111827]">
      {/* top nav */}
      <div className="relative z-10 rounded-b-2xl shadow">
        <Navbar />
      </div>

      {/* controls */}
      <div className={`-mt-5 w-full bg-[#ffffff] border-b border-[#e5e7eb] shadow-sm pt-3 pb-2 ${open ? "blur-[2px]" : ""}`}>
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

      {/* Professor card takes from toshow */}
      <main className={`mx-auto px-20 mt-10 ${open ? "blur-[2px]" : ""}`}>
        <div className="grid gap-8 sm:grid-cols-2 items-stretch ">
          {toShow.map((item) => {
            const pid = String(item.id || item.email || item.full_name);
            const href = `/professorpage/fullcardpage?id=${encodeURIComponent(pid)}`;
            return (
              <ProfessorCard
                key={pid}
                item={{ ...item, photo: item.photo || emailToPhotoPath(item.email) }}
                showPct={tab === "recommended"}
                userTags={userTags}
                href={href}
                onOpen={(it) => { setSelected(it); setOpen(true); }}
              />
            );
          })}
        </div>

        {/* load more */}
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
          <div className="absolute inset-0 bg-black/50 backdrop-blur-[2px]" onClick={() => { setOpen(false); setSelected(null); }} />
          <div className="relative z-10 w-full max-w-6xl mx-4 my-6">
            <div className="rounded-2xl overflow-hidden">
              <FullProfessorCard item={selected} onClose={() => { setOpen(false); setSelected(null); }} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
