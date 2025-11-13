"use client";

export default function ProgressBar({ step, total }) {
  const bar = Math.round((step / total) * 100);
  return (
    <div className="mx-auto my-4 w-full max-w-2xl">
      <div className="h-2 w-full rounded-full bg-[#e5e7eb]">
        <div
          className="h-2 rounded-full bg-[#ef4444] transition-all"
          style={{ width: `${bar}%` }}
        />
      </div>
      <p className="mt-1 text-center text-sm text-[#6b7280]">
        Step {step} of {total}
      </p>
    </div>
  );
}
