"use client";

export default function Loading() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f5f5f5] text-[#111827]">
      <div className="flex flex-col items-center gap-5">
        <div className="w-24 h-24 rounded-full border-8 border-[#fecaca] border-t-[#ef4444] animate-spin" />
        <div className="text-3xl font-semibold tracking-wide text-[#ef4444]">Loading…</div>
      </div>
    </div>
  );
}
