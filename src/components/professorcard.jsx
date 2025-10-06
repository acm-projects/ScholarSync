"use client";

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

export default function ProfessorCard({ item, userTags, showPct = true }) {
  const name = item?.full_name || "Unknown Faculty";
  const room = item?.office_room?.trim() ? item.office_room : "N/A";
  const summary = item?.summary?.trim() ? item.summary : "N/A";
  const email = item?.email?.trim() || null;

  const colored = item.tags;
  const topTags = pickTopTagsColored(colored);

  const { pct, color: badgeColor } = showPct
    ? computeThreeTagPctAndColor(topTags)
    : { pct: null, color: "gray" };

  const badgeClass =
    badgeColor === "green"
      ? "bg-green-600/10 text-green-700"
      : badgeColor === "yellow"
      ? "bg-yellow-500/10 text-yellow-700"
      : badgeColor === "red"
      ? "bg-red-600/10 text-red-700"
      : "bg-gray-300/30 text-gray-600";

  return (
    <div className="h-64 min-w-[380px] w-full overflow-hidden rounded-2xl border border-gray-200 bg-white p-7 shadow-md flex flex-col">
      <div className="flex items-start justify-between gap-6">
        <div className="min-w-0">
          <div className="text-2xl font-bold text-black">{name}</div>
          <div className="text-m text-gray-700 truncate">Room: {room}</div>
        </div>
        {showPct && pct != null && (
          <div className={`rounded-md px-3 py-1 text-m font-semibold shrink-0 ${badgeClass}`}>
            {pct}% match
          </div>
        )}
      </div>
      <p className="mt-3 text-m font-semibold leading-6 text-black line-clamp-3">{summary}</p>
      <div className="mt-auto pt-6 flex items-end justify-between">
        <div className="flex flex-wrap items-end gap-2">
          {topTags.length ? (
            topTags.map((t, i) => (
              <TagChip
                key={`${item.id || item.email || item.full_name || "x"}-t-${i}`} 
                text={t.text} 
                color={t.color}/>
            ))
          ) : (
            <div className="text-sm text-gray-500">No tags available</div>
          )}
        </div>
        {email ? (
          <a
            href={`mailto:${email}`}
            className="rounded-md border border-gray-300 bg-white px-3 py-1.5 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50">
            Email
          </a>
        ) : (
          <div className="text-sm text-gray-500 italic">N/A</div>
        )}
      </div>
    </div>
  );
}
