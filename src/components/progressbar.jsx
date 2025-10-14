"use client";

export default function ProgressBar({ step, total }) {
  const bar = Math.round((step / total) * 100);
  return (
    <div className="mx-auto my-4 w-full max-w-2xl">
      <div className="h-2 w-full rounded-full text-[#EEEef0]">
        <div className="h-2 rounded-full bg-[#983734] transition-all" style={{ width: `${bar}%` }} />
      </div>
      <p className="mt-1 text-center text-sm text-[#E2E3E6]">Step {step} of {total}</p>
    </div>
  );
}
