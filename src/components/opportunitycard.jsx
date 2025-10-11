"use client";

import TagChip from "@/components/tagchip";

// checks if v is aray if so return v not return empty
const asArray = (v) => (Array.isArray(v) ? v : []);

// picks up top 3 tags from g > y > r
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

// get 3 top tags and avg them to find user match %
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

// more simple way of declaring variables now
export default function OpportunityCard({ item, userTags, showPct = true, theme = "base" }) {
  const colored = item.tags;
  const topTags = pickTopTagsColored(colored);

  const { pct, color: badgeColor } = showPct
    ? computeThreeTagPctAndColor(topTags)
    : { pct: null, color: "gray" };

  const badgeClass =
    badgeColor === "green"
      ? "bg-green-700/15 text-green-300 border border-green-600/40"
      : badgeColor === "yellow"
      ? "bg-amber-600/15 text-amber-200 border border-amber-500/40"
      : badgeColor === "red"
      ? "bg-rose-700/15 text-rose-300 border border-rose-600/40"
      : "bg-gray-500/10 text-gray-300 border border-gray-500/30";


  const cardStyle =
    theme === "base"
      ? "border border-[#5A2B29] bg-[#170F0E] hover:bg-[#241312] hover:border-[#BA3F3D]"
      : "border border-[#FFD1CC] bg-[#983734] hover:bg-[#a9443f] hover:border-[#ffb3a7]";

  return (
    <div
      className={`h-48 w-full overflow-hidden rounded-2xl p-5 shadow-md flex flex-col transition-all duration-200 ${cardStyle}`}
    >
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <div className="text-xl font-bold text-[#EEEef0] truncate">{item.title}</div>
          <div className="text-sm text-[#E2E3E6] truncate">By {item.author}</div>
        </div>
        {showPct && pct != null && (
          <div className={`rounded-md px-2.5 py-0.5 text-sm font-semibold shrink-0 ${badgeClass}`}>
            {pct}% match
          </div>
        )}
      </div>

      <p className="mt-2 text-m font-medium leading-5 text-[#F4F4F5] line-clamp-2">
        {item.description}
      </p>

      <div className="mt-auto pt-3 flex items-end justify-between">
        <div className="flex flex-wrap items-end gap-2">
          {topTags.map((t, i) => (
            <TagChip key={`${item.id}-t-${i}`} text={t.text} color={t.color} />
          ))}
        </div>
        <div className="text-xs text-[#D1D2D6] shrink-0">Posted: {item.datePosted}</div>
      </div>
    </div>
  );
}
