"use client";

import { useState } from "react";
import TagChip from "@/components/tagchip";

export default function TagTextBox({
  label,
  name,
  values = [],
  onChange,
  placeholder = "Type a tag and press Enter",
}) {
  const [text, setText] = useState("");

  const addTag = (raw) => {
    const t = String(raw).trim();
    if (!t) return;
    const next = Array.from(new Set([...(values || []), t]));
    onChange(next);
    setText("");
  };

  const onKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      addTag(text);
    }
    if (e.key === "," && text.trim()) {
      e.preventDefault();
      addTag(text.replace(",", ""));
    }
  };

  const removeTag = (idx) => {
    const next = (values || []).filter((_, i) => i !== idx);
    onChange(next);
  };

  return (
    <div className="space-y-2">
      {label && (
        <div className="text-sm font-semibold text-[#111827]">{label}</div>
      )}

      <input
        name={name}
        value={text}
        onChange={(e) => setText(e.target.value)}
        onKeyDown={onKeyDown}
        placeholder={placeholder}
        className="w-full rounded-md border border-[#d1d5db] bg-[#ffffff] px-3.5 py-1.5 text-[0.95rem] font-semibold text-[#111827] placeholder-[#9ca3af] focus:border-[#ef4444] focus:outline-none focus:ring-1 focus:ring-[#ef4444]"
      />

      <div className="flex flex-wrap gap-1">
        {(values || []).map((t, i) => (
          <button
            key={`${t}-${i}`}
            type="button"
            onClick={() => removeTag(i)}
            className="group"
            title="Remove"
          >
            <span className="inline-flex items-center scale-90 origin-left">
              <TagChip text={t} />
              <span className="ml-1 text-[10px] text-[#6b7280] opacity-70 group-hover:opacity-100">
                ×
              </span>
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}
