"use client";

//  field; when locked, show not-allowed
export default function Field({ label, locked = false, className = "", children }) {
  return (
    <div className={["space-y-2", className].join(" ")}>
      {label ? <div className="text-sm text-[#E2E3E6]">{label}</div> : null}
      <div className="relative">
        {locked && (
          <div className="absolute inset-0 cursor-not-allowed pointer-events-auto rounded-md" />
        )}
        <div className={locked ? "pointer-events-none" : ""}>{children}</div>
      </div>
    </div>
  );
}
