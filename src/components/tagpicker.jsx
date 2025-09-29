"use client";

import { useState } from "react";

export default function TagPicker({ label, options = [], value = [], onChange }) {
  const [query, setQuery] = useState("");

  const filtered = query
    ? options.filter(t => t.toLowerCase().includes(query.toLowerCase()))
    : options;

  const toggle = (tag) => {
    const exists = value.includes(tag);
    const next = exists ? value.filter(t => t !== tag) : [...value, tag];
    onChange?.(next);
  };

  return (
    <div className="space-y-2">
      {label && <label className="block text-sm font-medium text-gray-700">{label}</label>}

      <input
        placeholder="Search tags…"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-900 placeholder-gray-500 focus:border-blue-500 focus:outline-none"
      />
      

      <div className="flex flex-wrap gap-2 rounded-lg border border-gray-200 p-3">
        {filtered.slice(0, 60).map((tag) => {
          const active = value.includes(tag);
          return (
            <button
              key={tag}
              type="button"
              onClick={() => toggle(tag)}
              className={
                "rounded-full border px-3 py-1 text-sm transition " +
                (active ? "border-blue-600 bg-blue-50 text-blue-700"
                        : "border-gray-300 hover:border-gray-400")
              }
            >
              {tag}
            </button>
          );
        })}
        {filtered.length === 0 && (
          <span className="text-sm text-gray-400">No matches</span>
        )}
      </div>

      {value.length > 0 && (
        <div className="text-sm text-gray-600">
          Selected: <span className="font-medium">{value.join(", ")}</span>
        </div>
      )}
    </div>
  );
}

