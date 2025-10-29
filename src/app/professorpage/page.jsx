"use client";

import { useMemo, useState } from "react";
import Navbar from "@/components/navbar";
import ToggleTabs from "@/components/toggletabsprofessor";
import ProfessorCard from "@/components/professorcard";
<<<<<<< HEAD
=======
<<<<<<< HEAD
=======
import FullProfessorCard from "@/components/fullprofessorcard";
>>>>>>> 5fa800b18367dea18c6121b4de3a0f5e06bce03d
>>>>>>> 1cd7fe76016a2301cd57cc1a21df77c0ba9d3ebb
import { normalizeAllItems } from "@/components/pagesort";
import profRecommended from "@/data/professors_recommended.json" assert { type: "json" };
import profAll from "@/data/professors_all.json" assert { type: "json" };
import userTags from "@/data/user_tags.json" assert { type: "json" };

export default function ProfessorsPage() {
  const [tab, setTab] = useState("recommended");
  const [query, setQuery] = useState("");
  const [visible, setVisible] = useState(6);

<<<<<<< HEAD
=======
<<<<<<< HEAD
=======
  // dataset pick based on tab
>>>>>>> 5fa800b18367dea18c6121b4de3a0f5e06bce03d
>>>>>>> 1cd7fe76016a2301cd57cc1a21df77c0ba9d3ebb
  const dataset = useMemo(() => {
    return tab === "recommended"
      ? normalizeAllItems(profRecommended, userTags)
      : normalizeAllItems(profAll, userTags);
  }, [tab]);

<<<<<<< HEAD
=======
<<<<<<< HEAD
=======
  // filter + simple relevance sort
>>>>>>> 5fa800b18367dea18c6121b4de3a0f5e06bce03d
>>>>>>> 1cd7fe76016a2301cd57cc1a21df77c0ba9d3ebb
  const filtered = useMemo(() => {
    let out = dataset;
    if (query.trim()) {
      const q = query.toLowerCase();
      out = out.filter((it) => {
<<<<<<< HEAD
        const tagArray = Array.isArray(it.tags)
          ? it.tags
          : Object.values(it.tags || {}).flat();
=======
<<<<<<< HEAD
        const tagArray = Array.isArray(it.tags)
          ? it.tags
          : Object.values(it.tags || {}).flat();
=======
        const tagArray = Array.isArray(it.tags) ? it.tags : Object.values(it.tags || {}).flat();
>>>>>>> 5fa800b18367dea18c6121b4de3a0f5e06bce03d
>>>>>>> 1cd7fe76016a2301cd57cc1a21df77c0ba9d3ebb
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

<<<<<<< HEAD
=======
<<<<<<< HEAD
>>>>>>> 1cd7fe76016a2301cd57cc1a21df77c0ba9d3ebb
  const toShow = filtered.slice(0, visible);
  const canLoadMore = visible < filtered.length;

  const emailToPhotoPath = (email) =>
    email ? `/images/picure/${String(email).toLowerCase()}.jpg` : null;

  return (
    <div className="min-h-screen bg-[#3D110F] text-[#EEEef0]">
<<<<<<< HEAD
=======
=======
  // page size
  const toShow = filtered.slice(0, visible);
  const canLoadMore = visible < filtered.length;

  // helper: fallback photo by email
  const emailToPhotoPath = (email) =>
    email ? `/images/picure/${String(email).toLowerCase()}.jpg` : null;

  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState(null);

  return (
    <div className="min-h-screen bg-[#3D110F] text-[#EEEef0]">
      {/* top nav */}
>>>>>>> 5fa800b18367dea18c6121b4de3a0f5e06bce03d
>>>>>>> 1cd7fe76016a2301cd57cc1a21df77c0ba9d3ebb
      <div className="relative z-10 rounded-b-2xl shadow">
        <Navbar />
      </div>

<<<<<<< HEAD
      <div className="-mt-5 w-full bg-[#3D110F] border-b-2 border-[#5A2B29] shadow-sm pt-3 pb-2">
=======
<<<<<<< HEAD
      <div className="-mt-5 w-full bg-[#3D110F] border-b-2 border-[#5A2B29] shadow-sm pt-3 pb-2">
=======
      {/* controls */}
      <div className={`-mt-5 w-full bg-[#3D110F] border-b-2 border-[#5A2B29] shadow-sm pt-3 pb-2 ${open ? "blur-[2px]" : ""}`}>
>>>>>>> 5fa800b18367dea18c6121b4de3a0f5e06bce03d
>>>>>>> 1cd7fe76016a2301cd57cc1a21df77c0ba9d3ebb
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
<<<<<<< HEAD
              className="w-80 md:w-96 rounded-md border border-[#5A2B29] bg-[#201311] px-3 py-2 text-m text-[#EEEef0] placeholder-[#EEEef0]/60 hover:bg-[#3C1A19] focus-visible:outline-none focus-visible:border-2 focus-visible:border-[#BA3F3D]"
=======
<<<<<<< HEAD
              className="w-80 md:w-96 rounded-md border border-[#5A2B29] bg-[#201311] px-3 py-2 text-m text-[#EEEef0] placeholder-[#EEEef0]/60 hover:bg-[#3C1A19] focus-visible:outline-none focus-visible:border-2 focus-visible:border-[#BA3F3D]"
=======
              className="w-80 md:w-96 rounded-md border border-[#5A2B29] bg-[#201311] px-3 py-2 text-m text-[#EEEef0] placeholder-[#EEEef0]/60 
                         hover:bg-[#3C1A19] focus-visible:outline-none focus-visible:border-2 focus-visible:border-[#BA3F3D]"
>>>>>>> 5fa800b18367dea18c6121b4de3a0f5e06bce03d
>>>>>>> 1cd7fe76016a2301cd57cc1a21df77c0ba9d3ebb
            />
          </div>
        </div>
      </div>

<<<<<<< HEAD
=======
<<<<<<< HEAD
>>>>>>> 1cd7fe76016a2301cd57cc1a21df77c0ba9d3ebb
      <main className="mx-auto px-20 py-15">
        <div className="grid gap-8 sm:grid-cols-2 items-stretch">
          {toShow.map((item) => (
            <ProfessorCard
              key={item.id || item.email || item.name}
              item={{
                ...item,
                photo: item.photo || emailToPhotoPath(item.email),
              }}
              showPct={tab === "recommended"}
              userTags={userTags}
            />
          ))}
        </div>

<<<<<<< HEAD
=======
=======
      {/* Professor card takes from toshow */}
      <main className={`mx-auto px-20 py-15 ${open ? "blur-[2px]" : ""}`}>
        <div className="grid gap-8 sm:grid-cols-2 items-stretch">
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
>>>>>>> 5fa800b18367dea18c6121b4de3a0f5e06bce03d
>>>>>>> 1cd7fe76016a2301cd57cc1a21df77c0ba9d3ebb
        <div className="mt-8 flex justify-center">
          {canLoadMore ? (
            <button
              type="button"
              onClick={() => setVisible((v) => v + 6)}
              className="rounded-md border border-[#5A2B29] bg-[#983734] px-5 py-2 text-sm font-medium text-[#EEEef0] shadow-sm hover:bg-[#3C1A19] hover:border-[#BA3F3D] focus-visible:outline-none focus-visible:border-2 focus-visible:border-[#BA3F3D] transition"
            >
              Load more professors
            </button>
          ) : (
            <div className="text-sm text-white/80">No more results</div>
          )}
        </div>
      </main>
<<<<<<< HEAD
=======
<<<<<<< HEAD
=======

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
>>>>>>> 5fa800b18367dea18c6121b4de3a0f5e06bce03d
>>>>>>> 1cd7fe76016a2301cd57cc1a21df77c0ba9d3ebb
    </div>
  );
}
