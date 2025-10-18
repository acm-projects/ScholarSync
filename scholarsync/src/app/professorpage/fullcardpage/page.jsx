"use client";

import { useMemo } from "react";
import { useSearchParams } from "next/navigation";
import Navbar from "@/components/navbar";
import FullProfessorCard from "@/components/fullprofessorcard";
import { normalizeAllItems } from "@/components/pagesort";
import profRecommended from "@/data/professors_recommended.json" assert { type: "json" };
import profAll from "@/data/professors_all.json" assert { type: "json" };
import userTags from "@/data/user_tags.json" assert { type: "json" };

// helper: find by id or email or name
const matchProfessor = (arr, key) => {
  const k = String(key || "").toLowerCase();
  return arr.find((it) => {
    const id = String(it.id || "").toLowerCase();
    const em = String(it.email || "").toLowerCase();
    const nm = String(it.full_name || it.name || "").toLowerCase();
    return id === k || em === k || nm === k;
  });
};

export default function FullProfessorPage() {
  const params = useSearchParams();
  const id = params.get("id");

  // merge + normalize once
  const dataset = useMemo(() => {
    const rec = normalizeAllItems(profRecommended, userTags);
    const all = normalizeAllItems(profAll, userTags);
    const byKey = new Map();
    [...rec, ...all].forEach((x) => {
      const key = String(x.id || x.email || x.full_name);
      if (!byKey.has(key)) byKey.set(key, x);
    });
    return Array.from(byKey.values());
  }, []);

  // pick item
  const item = useMemo(() => matchProfessor(dataset, id), [dataset, id]);

  // simple fallback view
  if (!item) {
    return (
      <div className="min-h-screen bg-[#3D110F] text-[#EEEef0]">
        <div className="relative z-10 rounded-b-2xl shadow">
          <Navbar />
        </div>
        <main className="mx-auto max-w-5xl px-6 py-10">
          <div className="rounded-xl border border-[#5A2B29] bg-[#170F0E] p-6">
            Professor not found.
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#3D110F] text-[#EEEef0]">
      {/* top nav */}
      <div className="relative z-10 rounded-b-2xl shadow">
        <Navbar />
      </div>

      {/* big card */}
      <main className="mx-auto max-w-6xl px-6 md:px-10 py-8">
        <FullProfessorCard item={item} />
      </main>
    </div>
  );
}
