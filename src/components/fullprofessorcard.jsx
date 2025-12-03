"use client";

import { useMemo, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import TagChip from "@/components/tagchip";

const A = (v) => (Array.isArray(v) ? v : []);
const uniqTags = (item) => {
  const add = (xs, c) => A(xs).map((t) => ({ text: String(t), color: c }));
  const all = [
    ...add(item?.tags?.green, "green"),
    ...add(item?.tags?.yellow, "yellow"),
    ...add(item?.tags?.red, "red"),
    ...add(Array.isArray(item?.tags) ? item.tags : [], "gray"),
    ...add(item?.tagsList, "gray"),
  ];
  const seen = new Set();
  return all.filter((t) => {
    const k = `${t.color}|${t.text.toLowerCase()}`;
    if (seen.has(k)) return false; seen.add(k); return true;
  });
};

export default function FullProfessorCard({ item, onClose }) {
  const router = useRouter();

  const name    = item.full_name || item.name || "Unknown Faculty";
  const titles  = A(item.titles);
  const main    = titles[0] || item.department || item.field || "";
  const office  = item.office_room || "";
  const phone   = item.phone_number || "";
  const email   = item.email || "";
  const summary = item.summary || item.bio || "No summary available.";
  const tags    = uniqTags(item);
  const pubs    = A(item.publications);
  const mailto  = email ? `mailto:${email}?subject=${encodeURIComponent(`Inquiry about your research (${name})`)}` : "";

  const [open, setOpen] = useState(false);
  const [page, setPage] = useState(1);
  const size = 5, total = Math.max(1, Math.ceil(pubs.length / size));
  const slice = pubs.slice((page - 1) * size, page * size);
  const pageNums = useMemo(() => {
    const MAX = 5;
    if (total <= MAX) return Array.from({ length: total }, (_, i) => i + 1);
    const mid = Math.floor(MAX / 2);
    let s = Math.max(1, page - mid), e = s + MAX - 1;
    if (e > total) { e = total; s = e - MAX + 1; }
    return Array.from({ length: e - s + 1 }, (_, i) => s + i);
  }, [page, total]);

  const initials =
    (name || "").split(" ").filter(Boolean).map((w) => w[0]).join("").slice(0, 2).toUpperCase() || "NA";

  // Use S3 photo URL from DynamoDB (stored in 'photo' field)
  const photoUrl = item?.photo || item?.image || null;
  const [imageError, setImageError] = useState(false);

  // Reset error state when photo URL changes
  useEffect(() => {
    setImageError(false);
  }, [photoUrl]);

  return (
    <article className="mx-auto w-full max-w-7xl min-h-[calc(100vh-160px)] rounded-2xl border border-[#e5e7eb] bg-[#ffffff] p-4 md:p-8 lg:p-10 shadow flex flex-col text-[#111827]">
      <div className="mb-6 flex items-center justify-between">
        <button onClick={() => (onClose ? onClose() : router.back())} className="inline-flex items-center gap-2 rounded-lg border border-[#d1d5db] bg-[#ffffff] px-3 py-1.5 text-sm md:text-base font-medium text-[#374151] hover:bg-[#f3f4f6] hover:border-[#ef4444] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#ef4444]">← Back</button>
        <span />
      </div>

      <header className="mb-5 flex items-start gap-5 flex-wrap">
        {photoUrl && !imageError ? (
          <img
            src={photoUrl}
            alt={name}
            className="h-28 w-28 rounded-xl object-cover border border-[#e5e7eb]"
            onError={() => setImageError(true)}
          />
        ) : (
          <div className="h-28 w-28 rounded-xl bg-[#e5e7eb] grid place-items-center text-2xl font-bold text-[#6b7280]">
            {initials}
          </div>
        )}

        <div className="min-w-0 flex-1">
          <div className="flex items-baseline justify-between gap-4">
            <div className="min-w-0">
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-extrabold leading-tight truncate">{name}</h1>
              {main && <div className="text-lg md:text-xl text-[#4b5563] truncate">{main}</div>}
            </div>

            <div className="text-right text-sm md:text-base text-[#4b5563] space-y-0.5 max-w-[360px]">
              {office && <div>Office: {office}</div>}
              {phone  && <div>Phone: {phone}</div>}
              {email  && <div className="truncate">Email: <a href={mailto} className="underline hover:no-underline">{email}</a></div>}
            </div>
          </div>
        </div>
      </header>

      <div className="border-t border-[#e5e7eb] my-5" />

      <section className="flex-1">
        <h2 className="text-xl md:text-2xl font-semibold mb-2">Description:</h2>
        <div className="text-[#374151] text-lg md:text-xl leading-7 whitespace-pre-line">{summary}</div>

        {titles.length > 1 && (
          <div className="mt-5 text-[#4b5563]">
            <div className="font-semibold mb-1">Titles:</div>
            <ul className="list-disc pl-6 space-y-1">{titles.slice(1).map((t, i) => <li key={i}>{t}</li>)}</ul>
          </div>
        )}

        <div className="mt-6">
          <button onClick={() => setOpen((v) => !v)} className="w-full text-left rounded-xl border border-[#e5e7eb] bg-[#f9fafb] px-4 py-3 font-semibold text-[#111827] hover:bg-[#fef2f2] hover:border-[#ef4444] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#ef4444]">
            Publications {pubs.length ? `(${pubs.length})` : ""} <span className="float-right">{open ? "▲" : "▼"}</span>
          </button>

          {open && (
            <div className="mt-3 rounded-xl border border-[#e5e7eb] bg-[#ffffff] p-4">
              {slice.length === 0 ? (
                <div className="text-[#4b5563]">No publications found.</div>
              ) : (
                <ul className="space-y-3">
                  {slice.map((p, i) => {
                    const text = typeof p === "string" ? p : p?.text;
                    const pdf  = typeof p === "object" ? p?.pdf : "";
                    return (
                      <li key={i} className="leading-6">
                        <span className="text-[#111827] break-words">{text}</span>
                        {pdf && <> {" "}
                          <a href={pdf} target="_blank" rel="noopener noreferrer" className="underline text-[#b91c1c] hover:no-underline" title={pdf}>PDF</a>
                        </>}
                      </li>
                    );
                  })}
                </ul>
              )}

              {total > 1 && (
                <div className="mt-4 flex items-center gap-2 flex-wrap">
                  <button onClick={() => setPage((p) => Math.max(1, p - 1))} className="px-3 py-1 rounded-lg border border-[#e5e7eb] bg-[#ffffff] text-sm text-[#374151] hover:bg-[#f3f4f6] hover:border-[#ef4444]">Prev</button>
                  {pageNums.map((n) => (
                    <button
                      key={n}
                      onClick={() => setPage(n)}
                      className={`px-3 py-1 rounded-lg border text-sm ${
                        n === page
                          ? "border-[#ef4444] bg-[#ef4444] text-white"
                          : "border-[#e5e7eb] bg-[#ffffff] text-[#374151] hover:bg-[#f3f4f6] hover:border-[#ef4444]"
                      }`}
                    >
                      {n}
                    </button>
                  ))}
                  <button onClick={() => setPage((p) => Math.min(total, p + 1))} className="px-3 py-1 rounded-lg border border-[#e5e7eb] bg-[#ffffff] text-sm text-[#374151] hover:bg-[#f3f4f6] hover:border-[#ef4444]">Next</button>
                </div>
              )}
            </div>
          )}
        </div>
      </section>

      <div className="border-t border-[#e5e7eb] my-5" />

      <footer className="mt-auto pt-1 flex items-center justify-between gap-3 flex-wrap">
        <div className="flex items-center flex-wrap gap-2">
          <span className="text-sm font-semibold text-[#6b7280] mr-1">Related tags:</span>
          {tags.map((t, i) => <TagChip key={`prof-${item.email || item.id || name}-${i}`} text={t.text} color={t.color} />)}
        </div>
      </footer>
    </article>
  );
}
