"use client";

import TagChip from "@/components/tagchip";
import { useRouter } from "next/navigation";
import { useState, useEffect, useMemo } from "react";

const asArray = (v) => (Array.isArray(v) ? v : []);

function pickTopTagsColored(colored) {
  const out = [];
  const pushSome = (arr, color) => {
    for (const t of asArray(arr)) {
      if (out.length >= 3) break;
      out.push({ text: String(t), color });
    }
  };
  pushSome(colored?.green, "green");
  pushSome(colored?.yellow, "yellow");
  pushSome(colored?.red, "red");
  return out;
}

function computeThreeTagPctAndColor(topTags) {
  const W = { green: 33.3333, yellow: 22.2222, red: 11.1111 };
  let g = 0, y = 0, r = 0;
  for (const t of asArray(topTags).slice(0, 3)) {
    if (t.color === "green") g += W.green;
    else if (t.color === "yellow") y += W.yellow;
    else if (t.color === "red") r += W.red;
  }
  const pct = Math.min(100, Math.round(g + y + r));
  let color = "gray";
  if (pct > 0 && pct <= 33) color = "red";
  else if (pct >= 34 && pct <= 65) color = "yellow";
  else if (pct >= 66) color = "green";
  return { pct, color };
}

const rangeColor = (p) => {
  if (p == null || Number.isNaN(p)) return "gray";
  if (p <= 20) return "red";
  if (p <= 35) return "orange";
  if (p <= 50) return "yellow";
  return "green";
};

export default function OpportunityCard({ item, showPct = true, theme = "base", href, onOpen, useProvidedPct = false }) {
  const router = useRouter();

  const topTags = useMemo(() => {
    if (Array.isArray(item?.tags)) {
      return item.tags.slice(0, 3).map((t) => ({ text: String(t), color: "gray" }));
    }
    return pickTopTagsColored(item?.tags);
  }, [item?.tags]);

  const providedPctRaw = item?.score;
  const hasProvidedPct = providedPctRaw !== undefined && providedPctRaw !== null && String(providedPctRaw).trim() !== "";
  // Convert score (0-1) to percentage (0-100) if needed
  const rawValue = hasProvidedPct ? parseFloat(String(providedPctRaw)) : null;
  const providedPct = rawValue !== null ? Math.round(rawValue <= 1 ? rawValue * 100 : Math.max(0, Math.min(100, rawValue))) : null;

  // Always use provided score if available, otherwise compute from tags
  const computed = !hasProvidedPct && showPct ? computeThreeTagPctAndColor(topTags) : { pct: null, color: "gray" };
  const pct = hasProvidedPct ? providedPct : computed.pct;
  const badgeColor = hasProvidedPct ? rangeColor(providedPct) : computed.color;

  const cardStyle =
    theme === "base"
      ? "border border-[#e5e7eb] bg-[#ffffff] hover:bg-[#f9fafb] hover:border-[#d1d5db]"
      : "border border-[#fecaca] bg-[#fee2e2] hover:bg-[#fecaca] hover:border-[#fca5a5]";

  const keySeed = String(item.title ?? "");
  let hash = 0;
  for (let i = 0; i < keySeed.length; i++) hash = (hash * 31 + keySeed.charCodeAt(i)) | 0;
  const n = ((Math.abs(hash) % 6) + 1);

  const candidates = [`/research${n}.jpg`, `/research${n}.jpeg`, `/research${n}.png`, `/research${n}.webp`];

  const [resolvedImg, setResolvedImg] = useState(null);

  useEffect(() => {
    let alive = true;
    (async () => {
      for (const url of candidates) {
        const ok = await new Promise((resolve) => {
          const img = new Image();
          img.onload = () => resolve(true);
          img.onerror = () => resolve(false);
          img.src = url;
        });
        if (ok && alive) {
          setResolvedImg(url);
          return;
        }
      }
      if (alive) setResolvedImg("/research.webp");
    })();
    return () => { alive = false; };
  }, [keySeed]);

  const img = resolvedImg;

  const stroke =
    badgeColor === "green"
      ? "#22c55e"
      : badgeColor === "yellow"
      ? "#eab308"
      : badgeColor === "orange"
      ? "#f97316"
      : badgeColor === "red"
      ? "#ef4444"
      : "#9ca3af";

  const size = 128;
  const r = 60;
  const C = 2 * Math.PI * r;
  const dash = showPct && pct != null ? (pct / 100) * C : 0;

  const go = () => {
    if (onOpen) onOpen(item);
    else if (href) router.push(href);
  };

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={go}
      onKeyDown={(e) => (e.key === "Enter" ? go() : null)}
      className={`relative h-64 min-w-[380px] w-full overflow-hidden rounded-2xl p-7 shadow-md hover:shadow-[0_0_30px_rgba(0,0,0,0.2)] hover:shadow-[#ef4444] flex ${cardStyle} focus:outline-none focus:ring-2 focus:ring-[#ef4444]`}
      aria-label={`Open ${item.title}`}
    >
      <div className="w-[30%] p-3">
        <div className="relative h-full w-full">
          {img ? (
            <img
              src={img}
              alt={item.title || "image"}
              className="h-full w-full object-cover rounded-xl border border-[#e5e7eb]"
            />
          ) : (
            <div className="absolute inset-0 rounded-xl bg-[#e5e7eb] grid place-items-center text-3xl font-bold text-[#6b7280]">
              Image
            </div>
          )}
        </div>
      </div>

      <div className="flex-1 min-w-0 pl-4 pr-0 flex flex-col">
        <div className="left min-w-0">
          <div className="text-2xl font-bold text-[#111827] truncate">{item.title}</div>
        </div>

        <div className="text-m text-[#4b5563] truncate">Posted: {item.timestamp ? new Date(item.timestamp).toLocaleDateString() : 'N/A'} By {item.username || 'Unknown'}</div>

        <p className="mt-2 text-m font-medium leading-6 text-[#374151] line-clamp-3" style={{ hyphens: "auto", overflowWrap: "anywhere" }}>
          {item.body || item.description || ''}
        </p>

        <div className="mt-auto pt-6">
          <div className="whitespace-nowrap overflow-x-auto [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden -mr-[184px] pr-[184px]">
            {topTags.map((t, i) => (
              <span key={`${item.title || 'tag'}-t-${i}`} className="inline-block mr-2 align-middle">
                <TagChip text={t.text} color={t.color} />
              </span>
            ))}
          </div>
        </div>
      </div>

      <div className="pl-2 my-[10px] pr-0 flex-[0_0_170px] flex flex-col items-end justify-between shrink-0">
        <div className="mt-2 self-end mr-0">
          <div className="relative" style={{ width: size, height: size }}>
            <svg width={size} height={size} viewBox="0 0 160 160">
              <circle cx="80" cy="80" r={r} fill="none" stroke="#e5e7eb" strokeWidth="12" />
              <circle
                cx="80" cy="80" r={r}
                fill="none"
                stroke={stroke}
                strokeWidth="12"
                strokeLinecap="round"
                strokeDasharray={`${dash} ${C - dash}`}
                transform="rotate(-90 80 80)"
              />
            </svg>
            <div className="absolute inset-0 grid place-items-center text-[#111827] font-bold text-xl">
              {showPct && pct != null ? `${pct}%` : "N/A"}
            </div>
            <div className="mt-1 text-center text-xs text-[#6b7280]">match</div>
          </div>
        </div>
      </div>
    </div>
  );
}
