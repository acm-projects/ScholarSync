"use client";

import { useState } from "react";
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

export default function ProfessorCard({ item, userTags, showPct = true , theme = "base", href }) {
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
      ? "border border-[#5A2B29] bg-[#170F0E] hover:bg-[#241312] hover:border-[#BA3F3D]"
      : "border border-[#FFD1CC] bg-[#983734] hover:bg-[#a9443f] hover:border-[#ffb3a7]";

  const badgeClass =
    badgeColor === "green"
      ? "bg-green-700/15 text-green-300 border border-green-600/40"
      : badgeColor === "yellow"
      ? "bg-amber-600/15 text-amber-200 border border-amber-500/40"
      : badgeColor === "red"
      ? "bg-rose-700/15 text-rose-300 border border-rose-600/40"
      : "bg-gray-500/10 text-gray-300 border border-gray-500/30";

  const photo = item?.photo || item?.image || null;
  const [imgOk, setImgOk] = useState(true);
  const initials =
    (name || "")
      .split(" ")
      .filter(Boolean)
      .map((w) => w[0])
      .join("")
      .slice(0, 2)
      .toUpperCase() || "NA";

  const go = () => { if (href) router.push(href); };

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={go}
      onKeyDown={(e) => e.key === "Enter" ? go() : null}
      className={`h-64 min-w-[380px] w-full overflow-hidden rounded-2xl p-7 shadow-md flex ${cardStyle} focus:outline-none focus:ring-2 focus:ring-[#BA3F3D]`}
      aria-label={`Open ${name}`}
    >
      <div className="w-[30%] p-3">
        {photo && imgOk ? (
          <img
            src={photo}
            alt={name}
            className="h-full w-full object-cover rounded-xl"
            onError={() => setImgOk(false)}
          />
        ) : (
          <div className="h-full w-full rounded-xl bg-[#983734] grid place-items-center text-3xl font-bold text-[#EEEef0]">
            {initials}
          </div>
        )}
      </div>

      <div className="w-[70%] min-w-0 pl-4 flex flex-col">
        <div className="flex items-start justify-between gap-6">
          <div className="min-w-0">
            <div className="text-2xl font-bold text-[#EEEef0]">{name}</div>
            <div className="text-m text-[#E2E3E6] truncate">Room: {room}</div>
          </div>
          {showPct && pct != null && (
            <div className={`rounded-md px-3 py-1 text-m font-semibold shrink-0 ${badgeClass}`}>
              {pct}% match
            </div>
          )}
        </div>
        <p
          className="mt-3 text-m font-medium leading-6 text-[#F4F4F5] line-clamp-3"
          style={{ hyphens: "auto", overflowWrap: "anywhere" }}
        >
          {summary}
        </p>
        <div className="mt-auto pt-6 flex items-end justify-between">
          <div className="flex flex-wrap items-end gap-2">
            {topTags.length ? (
              topTags.map((t, i) => (
                <TagChip
                  key={`${item.id || item.email || item.full_name || "x"}-t-${i}`}
                  text={t.text}
                  color={t.color}
                />
              ))
            ) : (
              <div className="text-sm text-gray-500">No tags available</div>
            )}
          </div>
          {email ? (
            <a
              href={`mailto:${email}`}
              onClick={(e) => e.stopPropagation()}
              className="rounded-md border border-[#5A2B29] bg-[#983734] px-3 py-1.5 text-sm font-medium text-[#F4F4F5] shadow-sm hover:bg-[#3C1A19]"
            >
              Email
            </a>
          ) : (
            <div className="text-sm text-gray-500 italic">N/A</div>
          )}
        </div>
      </div>
    </div>
  );
}

