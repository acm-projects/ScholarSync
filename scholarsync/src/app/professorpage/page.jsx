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

  // dataset pick based on tab
  const dataset = useMemo(() => {
    return tab === "recommended"
      ? normalizeAllItems(profRecommended, userTags)
      : normalizeAllItems(profAll, userTags);
  }, [tab]);

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

  return (
    <div className="min-h-screen bg-[#3D110F] text-[#EEEef0]">
      {/* top nav */}
      <div className="relative z-10 rounded-b-2xl shadow">
        <Navbar />
      </div>

      {/* controls */}
      <div className="-mt-5 w-full bg-[#3D110F] border-b-2 border-[#5A2B29] shadow-sm pt-3 pb-2">
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
              className="w-80 md:w-96 rounded-md border border-[#5A2B29] bg-[#201311] px-3 py-2 text-m text-[#EEEef0] placeholder-[#EEEef0]/60 hover:bg-[#3C1A19] focus-visible:outline-none focus-visible:border-2 focus-visible:border-[#BA3F3D]"
            />
          </div>
        </div>
      </div>

      {/* Professor card & link */}
      <main className="mx-auto px-20 py-15">
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
              className="rounded-md border border-[#5A2B29] bg-[#983734] px-5 py-2 text-sm font-medium text-[#EEEef0] shadow-sm hover:bg-[#3C1A19] hover:border-[#BA3F3D] focus-visible:outline-none focus-visible:border-2 focus-visible:border-[#BA3F3D] transition"
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
