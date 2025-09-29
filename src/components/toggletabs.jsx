"use client";

export default function ToggleTabs({ value, onChange }) {
  const tabs = [
    { key: "recommended", label: "AI Recommended" },
    { key: "all", label: "All Opportunities" },
  ];
  return (
    <div className="inline-flex rounded-lg border border-gray-200 bg-white p-1">
      {tabs.map((t) => {
        const active = value === t.key;
        return (
          <button
            key={t.key}
            type="button"
            onClick={() => onChange?.(t.key)}
            className={[
              "px-4 py-2 text-m font-bold rounded-md",
              active ? "bg-black text-white" : "text-gray-700 hover:bg-gray-100",
            ].join(" ")}
          >
            {t.label}
          </button>
        );
      })}
    </div>
  );
}
