"use client";

import TagChip from "@/components/tagchip";
import { useRouter } from "next/navigation";

// checks if v is array if so return v not return empty
const asArray = (v) => (Array.isArray(v) ? v : []);

// picks top 3 tags from g > y > r
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

// get 3 top tags and avg for user match %
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

// card: image left, content middle, circle right
export default function OpportunityCard({ item, userTags, showPct = true, theme = "base", href, onOpen }) {
  const router = useRouter();
  const colored = item.tags;
  const topTags = pickTopTagsColored(colored);

  const { pct, color: badgeColor } = showPct
    ? computeThreeTagPctAndColor(topTags)
    : { pct: null, color: "gray" };

  const cardStyle =
    theme === "base"
      ? "border border-[#5A2B29] bg-[#170F0E] hover:bg-[#241312] hover:border-[#BA3F3D]"
      : "border border-[#FFD1CC] bg-[#983734] hover:bg-[#a9443f] hover:border-[#ffb3a7]";

  const go = () => {
    if (onOpen) onOpen(item);
    else if (href) router.push(href);
  };

  const custom = "/research.webp";
  const img = custom || item.image || item.photo || null;

  const stroke =
    badgeColor === "green"
      ? "#34d399"
      : badgeColor === "yellow"
      ? "#fbbf24"
      : badgeColor === "red"
      ? "#f87171"
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
      className={`relative h-64 min-w-[380px] w-full overflow-hidden rounded-2xl p-7 shadow-md flex ${cardStyle} focus:outline-none focus:ring-2 focus:ring-[#BA3F3D]`}
      aria-label={`Open ${item.title}`}
    >
      <div className="w-[30%] p-3">
        <div className="relative h-full w-full">
          {img ? (
            <img
              src={img}
              alt={item.title || "image"}
              className="h-full w-full object-cover rounded-xl border border-[#5A2B29]"
            />
          ) : (
            <div className="absolute inset-0 rounded-xl bg-[#983734] grid place-items-center text-3xl font-bold text-[#EEEef0]">
              Image
            </div>
          )}
        </div>
      </div>

      <div className="flex-1 min-w-0 pl-4 pr-0 flex flex-col">
        <div className="min-w-0">
          <div className="text-2xl font-bold text-[#EEEef0] truncate">
            {item.title}
          </div>
        </div>

        {/* Posted + author inline under title */}
        <div className="text-m text-[#E2E3E6] truncate">
          Posted: {item.datePosted} By {item.author}
        </div>

        <p
          className="mt-2 text-m font-medium leading-6 text-[#F4F4F5] line-clamp-3"
          style={{ hyphens: "auto", overflowWrap: "anywhere" }}
        >
          {item.description}
        </p>

        <div className="mt-auto pt-6">
          <div
            className="
              whitespace-nowrap overflow-x-auto
              [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden
              -mr-[184px] pr-[184px]
            "
          >
            {topTags.map((t, i) => (
              <span key={`${item.id}-t-${i}`} className="inline-block mr-2 align-middle">
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
              <circle cx="80" cy="80" r={r} fill="none" stroke="#302525" strokeWidth="12" />
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
            <div className="absolute inset-0 grid place-items-center text-[#EEEef0] font-bold text-xl">
              {showPct && pct != null ? `${pct}%` : "N/A"}
            </div>
            <div className="mt-1 text-center text-xs text-[#E2E3E6]">match</div>
          </div>
        </div>
      </div>
    </div>
  );
}


