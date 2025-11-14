"use client";

import { useState, useMemo, useEffect } from "react";
import { useRouter } from "next/navigation";

import TagChip from "@/components/tagchip";

const asArray = (v) => (Array.isArray(v) ? v : []);

function pickTopTagsColored(colored) {
  const out = [];
  const pushSome = (arr, color) => {
    for (const t of asArray(arr)) {
      if (out.length >= 3) break;
      out.push({ text: t, color });
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

export default function ProfessorCard({ item, userTags, showPct = true , theme = "base", href, onOpen }) {
export default function ProfessorCard({
  item,
  userTags,
  showPct = true,
  theme = "base",
  href,
  onOpen,
}) {
  const router = useRouter();

  const name = item?.full_name || "Unknown Faculty";
  const room = item?.office_room?.trim() ? item.office_room : "N/A";
  const summary = item?.summary?.trim() ? item.summary : "N/A";
  const email = item?.email?.trim() || null;

  const colored = item.tags;
  const topTags = pickTopTagsColored(colored);

  const { pct, color: badgeColor } = showPct
    ? computeThreeTagPctAndColor(topTags)
    : { pct: null, color: "gray" };

  const cardStyle =
    theme === "base"
  const custom = "/AliAliev.jpg";
  const photo = custom || item?.photo || item?.image || null;

  const [errored, setErrored] = useState(false);


      ? "border border-[#e5e7eb] bg-[#ffffff] hover:bg-[#f9fafb] hover:border-[#d1d5db]"
      : "border border-[#fecaca] bg-[#fee2e2] hover:bg-[#fecaca] hover:border-[#fca5a5]";

  // --- IMAGE RESOLUTION (only change) ---
  const provided = item?.photo || item?.image || null;
  const candidates = useMemo(() => {
    const raw = name; // keep accents/spacing
    const enc = encodeURIComponent(name);
    return [
      provided,
      `/${raw}.jpg`,
      `/${enc}.jpg`,
      `/${raw}.jpeg`,
      `/${enc}.jpeg`,
      `/${raw}.png`,
      `/${enc}.png`,
      `/${raw}.webp`,
      `/${enc}.webp`,
    ].filter(Boolean);
  }, [name, provided]);

  const [photo, setPhoto] = useState(null);
  const [errored, setErrored] = useState(false);

  useEffect(() => {
    let alive = true;
    setPhoto(null);
    setErrored(false);

    (async () => {
      for (const url of candidates) {
        if (!url) continue;
        const ok = await new Promise((resolve) => {
          const img = new Image();
          img.onload = () => resolve(true);
          img.onerror = () => resolve(false);
          img.src = url;
        });
        if (ok && alive) {
          setPhoto(url);
          return;
        }
      }
      if (alive) setErrored(true);
    })();

    return () => {
      alive = false;
    };
  }, [candidates]);

  const initials =
    (name || "")
      .split(" ")
      .filter(Boolean)
      .map((w) => w[0])
      .join("")
      .slice(0, 2)
      .toUpperCase() || "NA";

  const go = () => {
    if (onOpen) onOpen(item);
    else if (href) router.push(href);
  };

  const stroke =
    badgeColor === "green"
      ? "#22c55e"
      : badgeColor === "yellow"
      ? "#eab308"
      : badgeColor === "red"
      ? "#f97316"
      : "#9ca3af";

  const size = 128;
  const r = 60;
  const C = 2 * Math.PI * r;
  const dash = showPct && pct != null ? (pct / 100) * C : 0;

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={go}
      onKeyDown={(e) => (e.key === "Enter" ? go() : null)}
      className={`h-64 min-w-[380px] w-full overflow-hidden rounded-2xl p-7 shadow-md hover:shadow-[0_0_30px_rgba(0,0,0,0.2)] hover:shadow-[#ef4444] flex ${cardStyle} focus:outline-none focus:ring-2 focus:ring-[#ef4444]`}
      aria-label={`Open ${name}`}
    >
      <div className="w-[30%] p-3">
        <div className="h-full w-full">
          {photo && !errored ? (
            <img
              src={photo}
              alt={name}
              className="h-full w-full object-cover rounded-xl border border-[#e5e7eb]"
            />
          ) : (
            <div className="h-full w-full rounded-xl bg-[#e5e7eb] grid place-items-center text-3xl font-bold text-[#6b7280]">
              {initials}
            </div>
          )}
        </div>
      </div>

      <div className="flex-1 min-w-0 pl-4 pr-0 flex flex-col">
        <div className="min-w-0">
          <div className="text-2xl font-bold text-[#111827] truncate">{name}</div>
        </div>

        <div className="text-m text-[#4b5563] truncate">Room: {room}</div>

        <p

          className="mt-2 text-m font-medium leading-6 text-[#374151] line-clamp-3"

          style={{ hyphens: "auto", overflowWrap: "anywhere" }}
        >
          {summary}
        </p>

        <div className="mt-auto pt-6">
          <div
            className=" my-[-10px]
              whitespace-nowrap overflow-x-auto
              [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden
              -mr-[184px] pr-[184px]
            "
          >
            {topTags.length ? (
              topTags.map((t, i) => (
                <span
                  key={`${item.id || item.email || item.full_name || "x"}-t-${i}`}
                  className="inline-block mr-2 align-middle"
                >
                  <TagChip text={t.text} color={t.color} />
                </span>
              ))
            ) : (
              <span className="text-sm text-gray-500">No tags available</span>
            )}
          </div>
        </div>
      </div>

      <div className="pl-2 pr-0 my-[10px] flex-[0_0_170px] flex flex-col items-end justify-between shrink-0">
        <div className="mt-2 self-end mr-0">
          <div className="relative" style={{ width: size, height: size }}>
            <svg width={size} height={size} viewBox="0 0 160 160">
              <circle cx="80" cy="80" r={r} fill="none" stroke="#e5e7eb" strokeWidth="12" />
              <circle
                cx="80"
                cy="80"
                r={r}
                fill="none"
                stroke={stroke}
                strokeWidth="12"
                strokeLinecap="round"
                strokeDasharray={`${dash} ${C - dash}`}
                transform="rotate(-90 80 80)"
              />
            </svg>
            <div className="absolute inset-0 grid place-items-center text-[#111827] font-bold text-xl">
              {showPct && pct != null ? `${pct}%` : "Summary not available"}
            </div>
            <div className="mt-1 text-center text-xs text-[#6b7280]">match</div>
          </div>
        </div>
      </div>
    </div>
  );
};

}

