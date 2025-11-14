"use client";

export default function ToggleTabs({ value, onChange }) {
  const tabs = [
    { key: "recommended", label: "AI Recommended" },
    { key: "all", label: "All Opportunities" },
  ];
  return (
    <div className="inline-flex rounded-lg border border-[#e5e7eb] bg-[#f9fafb] p-1">
      {tabs.map((t) => {
        const active = value === t.key;
        return (
          <button
            key={t.key}
            type="button"
            onClick={() => onChange?.(t.key)}
            className={[
              "px-4 py-2 text-m font-bold rounded-md transition-all duration-150",
              active
                ? "bg-[#ef4444] text-white hover:bg-[#dc2626]"
                : "bg-transparent text-[#4b5563] hover:bg-[#f3f4f6]",
            ].join(" ")}
          >
            {t.label}
          </button>
        );
      })}
    </div>
  );
}
