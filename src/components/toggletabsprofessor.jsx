"use client";

// switch button for home page
export default function ToggleTabs({ value, onChange }) {
  const tabs = [
    { key: "recommended", label: "AI Recommended" },
    { key: "all", label: "All Professors" },
  ];
  return (
    <div className="inline-flex rounded-lg border border-[#5A2B29] bg-[#201311] p-1">
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
                ? "bg-[#983734] text-white hover:bg-[#a9443f]"
                : "bg-transparent text-[#EEEef0]/90 hover:bg-[#3C1A19]",
            ].join(" ")}
          >
            {t.label}
          </button>
        );
      })}
    </div>
  );
}
