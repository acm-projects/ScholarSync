"use client";

export default function FiltersBar({ sort, onSort, query, onQuery }) {
  const pills = ["Paid", "Remote", "Part-time", "UG-friendly"]; 

  return (
    <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        <span className="text-sm font-medium text-gray-700 ">Filters:</span>
        <div className="flex items-center gap-2">
          {pills.map(p => (
            <button key={p} type="button" className="whitespace-nowrap rounded-full border border-gray-200 bg-white px-3 py-1 text-xs text-gray-700 hover:bg-gray-50">
              {p}
            </button>
          ))}
        </div>
      </div>

      <div className="flex items-center gap-3">
        <select
          value={sort}
          onChange={(e) => onSort?.(e.target.value)}
          className="rounded-md border border-gray-300 bg-white px-2.5 py-1.5 text-sm text-gray-900"
        >
          <option value="recent">Date posted: Recent</option>
          <option value="oldest">Date posted: Oldest</option>
        </select>

        <input
          value={query}
          onChange={(e) => onQuery?.(e.target.value)}
          placeholder="Search by title…"
          className="w-60 rounded-md border border-gray-300 px-3 py-1.5 text-sm text-gray-900 placeholder-gray-400"
        />
      </div>
    </div>
  );
}
