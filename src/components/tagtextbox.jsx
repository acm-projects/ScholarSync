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
  // 
  const removeTag = (idx) => {
    const next = (values || []).filter((_, i) => i !== idx);
    onChange(next);
  };

  return (
    <div className="space-y-2">
      {label && <div className="text-sm font-semibold text-[#EEEef0]">{label}</div>}

      <input
        name={name}
        value={text}
        onChange={(e) => setText(e.target.value)}
        onKeyDown={onKeyDown}
        placeholder={placeholder}
        className="inline-flex items-center rounded-full border border-[#5A2B29] bg-[#201311] px-3.5 py-1.5 text-[0.95rem] font-semibold text-[#EEEef0]"
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
              <span className="ml-1 text-[10px] text-[#D1D2D6] opacity-70 group-hover:opacity-100">
                ×
              </span>
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}
