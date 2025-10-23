"use client";

import { useMemo, useState } from "react";
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
  const custom  = "/AliAliev.jpg"
  const photo   = custom || item.photo || item.image || null;
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

  const [imgOk, setImgOk] = useState(true);
  const initials =
    (name || "").split(" ").filter(Boolean).map((w) => w[0]).join("").slice(0, 2).toUpperCase() || "NA";

  return (
    <article className="mx-auto w-full max-w-7xl min-h-[calc(100vh-160px)] rounded-2xl border border-[#5A2B29] bg-[#170F0E] p-4 md:p-8 lg:p-10 shadow flex flex-col text-[#EEEef0]">
      <div className="mb-6 flex items-center justify-between">
        <button onClick={() => (onClose ? onClose() : router.back())} className="inline-flex items-center gap-2 rounded-lg border border-[#5A2B29] bg-[#201311] px-3 py-1.5 text-sm md:text-base font-medium hover:bg-[#3C1A19] hover:border-[#BA3F3D] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#BA3F3D]">← Back</button>
        <span />
      </div>

      <header className="mb-5 flex items-start gap-5 flex-wrap">
        {photo && imgOk ? (
          <img
            src={photo}
            alt={name}
            className="h-28 w-28 rounded-xl object-cover border border-[#5A2B29]"
            onError={() => setImgOk(false)}
          />
        ) : (
          <div className="h-28 w-28 rounded-xl bg-[#983734] grid place-items-center text-2xl font-bold">
            {initials}
          </div>
        )}

        <div className="min-w-0 flex-1">
          <div className="flex items-baseline justify-between gap-4">
            <div className="min-w-0">
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-extrabold leading-tight truncate">{name}</h1>
              {main && <div className="text-lg md:text-xl text-[#E2E3E6] truncate">{main}</div>}
            </div>

            <div className="text-right text-sm md:text-base text-[#E9EAED] space-y-0.5 max-w-[360px]">
              {office && <div>Office: {office}</div>}
              {phone  && <div>Phone: {phone}</div>}
              {email  && <div className="truncate">Email: <a href={mailto} className="underline hover:no-underline">{email}</a></div>}
            </div>
          </div>
        </div>
      </header>

      <div className="border-t border-[#5A2B29] my-5" />

      <section className="flex-1">
        <h2 className="text-xl md:text-2xl font-semibold mb-2">Description:</h2>
        <div className="text-[#F4F4F5] text-lg md:text-xl leading-7 whitespace-pre-line">{summary}</div>

        {titles.length > 1 && (
          <div className="mt-5 text-[#E2E3E6]">
            <div className="font-semibold mb-1">Titles:</div>
            <ul className="list-disc pl-6 space-y-1">{titles.slice(1).map((t, i) => <li key={i}>{t}</li>)}</ul>
          </div>
        )}

        <div className="mt-6">
          <button onClick={() => setOpen((v) => !v)} className="w-full text-left rounded-xl border border-[#5A2B29] bg-[#201311] px-4 py-3 font-semibold hover:bg-[#3C1A19] hover:border-[#BA3F3D] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#BA3F3D]">
            Publications {pubs.length ? `(${pubs.length})` : ""} <span className="float-right">{open ? "▲" : "▼"}</span>
          </button>

          {open && (
            <div className="mt-3 rounded-xl border border-[#5A2B29] bg-[#120B0B] p-4">
              {slice.length === 0 ? (
                <div className="text-[#E2E3E6]">No publications found.</div>
              ) : (
                <ul className="space-y-3">
                  {slice.map((p, i) => {
                    const text = typeof p === "string" ? p : p?.text;
                    const pdf  = typeof p === "object" ? p?.pdf : "";
                    return (
                      <li key={i} className="leading-6">
                        <span className="text-[#F4F4F5] break-words">{text}</span>
                        {pdf && <> {" "}
                          <a href={pdf} target="_blank" rel="noopener noreferrer" className="underline text-[#FFEAE7] hover:no-underline" title={pdf}>PDF</a>
                        </>}
                      </li>
                    );
                  })}
                </ul>
              )}

              {total > 1 && (
                <div className="mt-4 flex items-center gap-2 flex-wrap">
                  <button onClick={() => setPage((p) => Math.max(1, p - 1))} className="px-3 py-1 rounded-lg border border-[#5A2B29] bg-[#201311] hover:bg-[#3C1A19]">Prev</button>
                  {pageNums.map((n) => (
                    <button key={n} onClick={() => setPage(n)} className={`px-3 py-1 rounded-lg border ${n === page ? "border-[#BA3F3D] bg-[#983734] text-[#FFEAE7]" : "border-[#5A2B29] bg-[#201311] hover:bg-[#3C1A19]"}`}>{n}</button>
                  ))}
                  <button onClick={() => setPage((p) => Math.min(total, p + 1))} className="px-3 py-1 rounded-lg border border-[#5A2B29] bg-[#201311] hover:bg-[#3C1A19]">Next</button>
                </div>
              )}
            </div>
          )}
        </div>
      </section>

      <div className="border-t border-[#5A2B29] my-5" />

      <footer className="mt-auto pt-1 flex items-center justify-between gap-3 flex-wrap">
        <div className="flex items-center flex-wrap gap-2">
          <span className="text-sm font-semibold text-[#E9EAED]/90 mr-1">Related tags:</span>
          {tags.map((t, i) => <TagChip key={`prof-${item.email || item.id || name}-${i}`} text={t.text} color={t.color} />)}
        </div>
      </footer>
    </article>
  );
}
