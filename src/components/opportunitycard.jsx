"use client";
import TagChip from "@/components/tagchip";

const asArray = (v) => (Array.isArray(v) ? v : []);

// If the item already has colored buckets { green/yellow/red }, pick up to 3.
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

// If the item has flat tags, color them by comparing to the user's profile buckets.
function colorForTag(tag, profile) {
  if (asArray(profile?.green).includes(tag)) return "green";
  if (asArray(profile?.yellow).includes(tag)) return "yellow";
  if (asArray(profile?.red).includes(tag)) return "red";
  return "gray";
}

export function computeMatchPct(colored, userTags) {
  const count = (arr, pool) => asArray(arr).filter((t) => asArray(pool).includes(t)).length;
  const g = count(colored?.green, userTags?.green);
  const y = count(colored?.yellow, userTags?.yellow);
  const r = count(colored?.red, userTags?.red);
  const score = g * 3 + y * 2 + r * 1;
  const max = 3 * 5 + 2 * 5 + 1 * 5;
  return Math.min(99, Math.max(60, Math.round((score / max) * 100)));
}

export default function OpportunityCard({ item, userTags, showPct = true }) {
  // Support both shapes: colored object OR flat array
  const isColoredShape =
    item?.tags && typeof item.tags === "object" && !Array.isArray(item.tags) &&
    ("green" in item.tags || "yellow" in item.tags || "red" in item.tags);

  const colored = isColoredShape
    ? item.tags
    : {                     // derive colored buckets from flat tags + user profile
        green: asArray(item.tags).filter((t) => colorForTag(t, userTags) === "green"),
        yellow: asArray(item.tags).filter((t) => colorForTag(t, userTags) === "yellow"),
        red: asArray(item.tags).filter((t) => colorForTag(t, userTags) === "red"),
      };

  // Choose up to 3 tags to show
  const topTags = isColoredShape
    ? pickTopTagsColored(colored)
    : asArray(item.tags).slice(0, 3).map((t) => ({ text: t, color: colorForTag(t, userTags) }));

  const pct = showPct ? computeMatchPct(colored, userTags) : null;

  // Fixed card height + bottom-pinned footer + slightly wider min width
  return (
    <div className="h-64 min-w-[380px] w-full overflow-hidden rounded-2xl border border-gray-200 bg-white p-7 shadow-md flex flex-col">
      {/* Header */}
      <div className="flex items-start justify-between gap-6">
        <div className="min-w-0">
          <div className="text-xl font-semibold text-black">{item.title}</div>
          <div className="text-sm text-gray-500 truncate">By {item.author}</div>
        </div>

        {showPct && pct != null && (
          <div className="rounded-md bg-green-600/10 px-3 py-1 text-xs font-semibold text-green-700 shrink-0">
            {pct}% match
          </div>
        )}
      </div>

      {/* Body */}
      <p className="mt-3 text-[15px] leading-6 text-gray-700 line-clamp-3">
        {item.description}
      </p>

      {/* Footer pinned to bottom-left */}
      <div className="mt-auto pt-4">
        <div className="flex flex-wrap items-center gap-2">
          {topTags.map((t, i) => (
            <TagChip key={`${item.id}-t-${i}`} text={t.text} color={t.color} />
          ))}
        </div>
        <div className="mt-3 text-xs text-gray-400">Posted: {item.datePosted}</div>
      </div>
    </div>
  );
}
