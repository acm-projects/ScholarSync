"use client";

export default function ProgressBar({ step, total }) {
  const bar = Math.round((step / total) * 100);
  return (
    <div className="mx-auto my-4 w-full max-w-2xl">
      <div className="h-2 w-full rounded-full bg-gray-200">
        <div className="h-2 rounded-full bg-blue-600 transition-all" style={{ width: `${bar}%` }} />
      </div>
      <p className="mt-1 text-center text-sm text-gray-500">Step {step} of {total}</p>
    </div>
  );
}
