"use client";

import { useMemo, useState } from "react";
import Navbar from "@/components/navbar";
import { normalizeAllItems } from "@/components/pagesort";
import { sortByDate } from "@/components/datesort";
import ToggleTabs from "@/components/toggletabs";
import OpportunityCard from "@/components/opportunitycard";
import FullPageCard from "@/components/fullpagecard";
import recommendedData from "@/data/opportunities_recommended.json";
import allData from "@/data/opportunities_all.json";
import userTags from "@/data/user_tags.json";

export default function OpportunitiesPage() {
  const [tab, setTab] = useState("recommended");
  const [sort, setSort] = useState("recent");
  const [query, setQuery] = useState("");
  const [visible, setVisible] = useState(12);
  const [activeFilter, setActiveFilter] = useState("");
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState(null);

  const dataset = useMemo(() => {
    return tab === "recommended"
      ? normalizeAllItems(recommendedData, userTags)
      : normalizeAllItems(allData, userTags);
  }, [tab]);

  const filtered = useMemo(() => {
    let out = dataset;
    if (query.trim()) {
      const q = query.toLowerCase();
      out = out.filter((it) => {
        const tagsFlat = Array.isArray(it.tags)
          ? it.tags
          : Object.values(it.tags || it.originalTags || {}).flat();
        const hay = [
          it.title,
          it.description,
          it.author,
          ...(tagsFlat || []),
          ...(it.tagsList || []),
        ]
          .filter(Boolean)
          .map((x) => String(x).toLowerCase());
        return hay.some((s) => s.includes(q));
      });
    }
    if (activeFilter) {
      const f = activeFilter.toLowerCase();
      const EMPLOY = new Set(["full-time", "part-time", "on-site", "remote"]);
      out = out.filter((it) => {
        const buckets =
          it.originalTags &&
          typeof it.originalTags === "object" &&
          !Array.isArray(it.originalTags)
            ? it.originalTags
            : it.tags &&
              typeof it.tags === "object" &&
              !Array.isArray(it.tags)
            ? it.tags
            : null;
        const allOrig = buckets
          ? [...(buckets.green || []), ...(buckets.yellow || []), ...(buckets.red || [])]
          : [];
        const tagsArray = Array.isArray(it.tags) ? it.tags : [];
        if (EMPLOY.has(f)) {
          const src = [...allOrig, ...tagsArray];
          return src
            .map(String)
            .map((s) => s.toLowerCase())
            .includes(f);
        }
        const tagArray =
          tagsArray.length > 0
            ? tagsArray
            : Object.values(it.tags || {}).flat();

        const hay = [
          it.title,
          it.description,
          ...(tagArray || []),
          ...(it.tagsList || []),
          ...allOrig,
        ]
          .filter(Boolean)
          .map((x) => String(x).toLowerCase());
        return hay.some((s) => s.includes(f));
      });
    }
    return sortByDate(out, sort);
  }, [dataset, sort, activeFilter, query]);

  const toShow = filtered.slice(0, visible);
  const canLoadMore = visible < filtered.length;

  return (
    <div className="min-h-screen bg-[#f5f5f5] text-[#111827]">
      <div className="relative z-10 rounded-b-2xl shadow">
        <Navbar />
      </div>

      <div
        className={`-mt-5 w-full bg-[#ffffff] border-b border-[#e5e7eb] shadow-sm pt-3 pb-2 ${
          open ? "blur-sm" : ""
        }`}
      >
        <div className="w-full px-6 pt-5 pb-4 flex items-center">
          <div className="flex items-center gap-6 overflow-x-auto flex-1 min-w-0">
            <ToggleTabs
              value={tab}
              onChange={(v) => {
                setTab(v);
                setVisible(12);
              }}
            />
            <div className="flex items-center gap-2">
              <span className="whitespace-nowrap text-m font-medium text-[#4b5563]">
                Filters:
              </span>
              {["Full-time", "Part-time", "On-site", "Remote"].map((p) => (
                <button
                  key={p}
                  type="button"
                  onClick={() =>
                    setActiveFilter((cur) => (cur === p ? "" : p))
                  }
                  className={[
                    "whitespace-nowrap rounded-full border px-3 py-1 text-m transition font-medium focus-visible:outline-none",
                    activeFilter === p
                      ? "bg-[#ef4444] text-white border border-transparent"
                      : "bg-[#ffffff] text-[#374151] border border-[#d1d5db] hover:border-[#ef4444] hover:text-[#111827]",
                  ].join(" ")}
                >
                  {p}
                </button>
              ))}
            </div>
          </div>

          <div className="ml-auto flex items-center gap-4 shrink-0 ">
            <select
              value={sort}
              onChange={(e) => {
                setSort(e.target.value);
                setVisible(12);
              }}
              className="rounded-md border border-[#d1d5db] bg-[#ffffff] px-3 py-2 text-m text-[#111827] font-medium hover:border-[#ef4444] focus-visible:outline-none focus-visible:border-2 focus-visible:border-[#ef4444]"
            >
              <option className="bg-[#ffffff] text-[#111827]" value="recent">
                Date posted: Recent
              </option>
              <option className="bg-[#ffffff] text-[#111827]" value="oldest">
                Date posted: Oldest
              </option>
            </select>

            <input
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                setVisible(12);
              }}
              placeholder="Search opportunities, tags, or description…"
              className="w-80 md:w-96 rounded-md border border-[#d1d5db] bg-[#ffffff] px-3 py-2 text-m text-[#111827] placeholder-[#9ca3af] hover:border-[#ef4444] focus-visible:outline-none focus-visible:border-2 focus-visible:border-[#ef4444]"
            />
          </div>
        </div>
      </div>

      <main className={`mx-auto px-20 mt-10 ${open ? "blur-sm" : ""}`}>
        <div className="grid gap-8 sm:grid-cols-2 items-stretch">
          {toShow.map((item) => {
            const tagsArray = Array.isArray(item.tags) ? item.tags : [];
            const cardTags =
              tagsArray.length > 0 ? { green: tagsArray } : item.tags;

            return (
              <OpportunityCard
                key={item.id}
                item={{ ...item, tags: cardTags }}
                showPct
                useProvidedPct={true}
                onOpen={(it) => {
                  setSelected(it);
                  setOpen(true);
                }}
              />
            );
          })}
        </div>

        <div className="mt-10 flex justify-center">
          {canLoadMore ? (
            <button
              type="button"
              onClick={() => setVisible((v) => v + 6)}
              className="rounded-md border border-[#d1d5db] bg-[#ef4444] px-6 py-2.5 text-sm font-medium text-white shadow-sm hover:bg-[#dc2626] hover:border-[#dc2626] focus-visible:outline-none focus-visible:border-2 focus-visible:border-[#b91c1c] transition"
            >
              Load more opportunities
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
              <FullPageCard
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
