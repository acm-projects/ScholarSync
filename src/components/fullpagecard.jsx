"use client";

import { useRouter } from "next/navigation";
import TagChip from "@/components/tagchip";

// helper: array or empty
const asArray = (v) => (Array.isArray(v) ? v : []);

// simple tag gather 
const getAllTags = (item) => {
  const to = (arr, color) => asArray(arr).map((t) => ({ text: String(t), color }));

  const green = [...to(item?.tags?.green, "green"), ...to(item?.originalTags?.green, "green")];
  const yellow = [...to(item?.tags?.yellow, "yellow"), ...to(item?.originalTags?.yellow, "yellow")];
  const red = [...to(item?.tags?.red, "red"), ...to(item?.originalTags?.red, "red")];
  const gray = [
    ...to(Array.isArray(item?.tags) ? item.tags : [], "gray"),
    ...to(item?.tagsList, "gray"),
  ];

  const ordered = [...green, ...yellow, ...red, ...gray];
  const seen = new Set();
  return ordered.filter((t) => {
    const k = `${t.color}|${t.text.toLowerCase()}`;
    if (seen.has(k)) return false;
    seen.add(k);
    return true;
  });
};

export default function FullPageCard({ item, onClose }) {
  const router = useRouter();

  // data we show
  const tags = getAllTags(item);
  const username = item.username || "";
  const posted = item.timestamp ? new Date(item.timestamp).toLocaleDateString() : "";
  const email = item.email || item.contactEmail || "";
  const mailto = `mailto:${email || ""}?subject=${encodeURIComponent(
    item.title || "Opportunity Inquiry"
  )}`;

  // big full card
  return (
    <article className="mx-auto w-full max-w-7xl min-h-[calc(100vh-160px)] rounded-2xl border border-[#e5e7eb] bg-[#ffffff] p-4 md:p-8 lg:p-10 shadow flex flex-col text-[#111827]">
      {/* top bar */}
      <div className="mb-6 flex items-center justify-between">
        <button
          type="button"
          onClick={() => {
            if (typeof onClose === "function") onClose();
            else if (typeof window !== "undefined" && window.history.length > 1) router.back();
            else router.push("/homeresearchpage");
          }}
          className="inline-flex items-center gap-2 rounded-lg border border-[#d1d5db] bg-[#ffffff] px-3 py-1.5 text-sm md:text-base font-medium text-[#374151] hover:bg-[#f3f4f6] hover:border-[#ef4444] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#ef4444]"
        >
          ← Back
        </button>
        <span />
      </div>

      {/* header row title date author */}
      <header className="mb-0 grid grid-cols-[1fr_auto] grid-rows-2 gap-x-4">
        <h1 className="col-start-1 row-start-1 text-3xl md:text-4xl lg:text-5xl font-extrabold leading-tight truncate">
          {item.title}
        </h1>
        {username ? (
          <div className="col-start-1 row-start-2 mt-1 text-base md:text-lg font-medium text-[#4b5563] truncate">
            By {username}
          </div>
        ) : (
          <div className="col-start-1 row-start-2" />
        )}
        <div className="col-start-2 row-span-2 flex flex-col items-end justify-center gap-1 text-right">
          <div className="text-sm md:text-base font-semibold text-[#4b5563] whitespace-nowrap">
            {email ? <>Email: <a href={mailto} className="underline hover:no-underline">{email}</a></> : "Email: N/A"}
          </div>
          <div className="text-sm md:text-base font-semibold text-[#4b5563] whitespace-nowrap">
            {posted ? `Posted: ${posted}` : null}
          </div>
        </div>
      </header>

      {/* line break */}
      <div className="border-t border-[#e5e7eb] mb-5" />

      {/* uploaded image if available */}
      {item.imageUrl && (
        <div className="mb-5">
          <img
            src={item.imageUrl}
            alt={item.title || "Opportunity image"}
            className="w-full max-h-96 object-cover rounded-xl border border-[#e5e7eb]"
          />
        </div>
      )}

      {/* description */}
      <section className="flex-1">
        <h2 className="text-2xl md:text-2xl font-semibold mb-2">Description:</h2>
        <div className="text-[#374151] text-2xl md:text-xl leading-7 whitespace-pre-line">
          {item.body || ''}
        </div>
      </section>

      {/* line break */}
      <div className="border-t border-[#e5e7eb] my-5" />

      {/* tags + email */}
      <footer className="mt-auto pt-1 flex items-center justify-between gap-3 flex-wrap">
        <div className="flex items-center flex-wrap gap-2">
          <span className="text-sm font-semibold text-[#6b7280] mr-1">Related tags:</span>
          {tags.map((t, i) => (
            <TagChip key={`full-${item.title || 'tag'}-${i}`} text={t.text} color={t.color} />
          ))}
        </div>
      </footer>
    </article>
  );
}
