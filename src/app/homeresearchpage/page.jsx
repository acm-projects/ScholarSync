"use client";

import { useMemo, useState } from "react";
import Navbar from "@/components/navbar";
import { normalizeAllItems } from "@/components/pagesort";
import { sortByDate } from "@/components/datesort";
import ToggleTabs from "@/components/toggletabs";
import OpportunityCard from "@/components/opportunitycard";
import recommendedData from "@/data/opportunities_recommended.json" assert { type: "json" };
import allData from "@/data/opportunities_all.json" assert { type: "json" };
import userTags from "@/data/user_tags.json" assert { type: "json" };

export default function OpportunitiesPage() {
  const [tab, setTab] = useState("recommended");
  const [sort, setSort] = useState("recent");
  const [query, setQuery] = useState("");
  const [visible, setVisible] = useState(6);
  const [activeFilter, setActiveFilter] = useState("");

  // usememo here to keep cards from stopping to rerender after every user actoin
  // compare and pass in data and user tags
  const dataset = useMemo(() => {
    return tab === "recommended"  // by defualt it is recommened so it compares user data and card data and sets the original to the compared but we have to pass in these arguments here
      ? normalizeAllItems(recommendedData, userTags) 
      : normalizeAllItems(allData, userTags);
  }, [tab]);

 // Usememo: only recomputes filterd/sorted list if anything change, 
 // sets query object/list and filters it
 // also gets filter if changed and find post only with that filter
 // return sortBydate Becaues we want to filter first then Sort by date after
  const filtered = useMemo(() => {
    let out = dataset;
    if (query.trim()) {
      const q = query.toLowerCase();
      out = out.filter((it) => it.title.toLowerCase().includes(q));
    }
    if (activeFilter) {   
      const f = activeFilter.toLowerCase();
      const EMPLOY = new Set(["full-time", "part-time", "on-site", "remote"]);
      out = out.filter((it) => { // forum for filter
        const buckets =
          it.originalTags && typeof it.originalTags === "object" && !Array.isArray(it.originalTags)
            ? it.originalTags
            : it.tags && typeof it.tags === "object" && !Array.isArray(it.tags)
            ? it.tags
            : null;
        const allOrig = buckets
          ? [...(buckets.green || []), ...(buckets.yellow || []), ...(buckets.red || [])]
          : [];
        if (EMPLOY.has(f)) {
          return allOrig.map(String).map((s) => s.toLowerCase()).includes(f);}
        const tagArray = Array.isArray(it.tags) ? it.tags : Object.values(it.tags || {}).flat();
        const hay = [
          it.title,
          it.description,
          ...(tagArray || []),
          ...(it.tagsList || []),
          ...allOrig,]
          .filter(Boolean)
          .map((x) => String(x).toLowerCase());
        return hay.some((s) => s.includes(f));
      });}

    return sortByDate(out, sort);
  }, [dataset, sort, activeFilter, query]);

  const toShow = filtered.slice(0, visible);
  const canLoadMore = visible < filtered.length;

    // hello from Tony!
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
            <div className="flex items-center gap-2">
              <span className="whitespace-nowrap text-m font-medium text-black">
                Filters:
              </span>
              {["Full-time", "Part-time", "On-site", "Remote"].map((p) => (
                <button
                  key={p}
                  type="button"
                  onClick={() => setActiveFilter(cur => cur === p ? "" : p)}
                  className={[
                    "whitespace-nowrap rounded-full border px-3 py-1 text-m",
                    activeFilter === p
                      ? "bg-black text-white border-black"
                      : "bg-white text-black border-gray-700 hover:bg-gray-50",
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
                setVisible(6);
              }}
              className="rounded-md border border-gray-500 bg-white px-3 py-2 text-m text-black"
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
              className="w-80 md:w-96 rounded-md border border-gray-500 px-3 py-2 text-m text-black placeholder-gray-400"
            />
          </div>
        </div>
      </div>

      <main className="mx-auto px-20 py-15">
        <div className="grid gap-8 sm:grid-cols-2 items-stretch ">
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
