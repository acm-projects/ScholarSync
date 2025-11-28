"use client";

import { useContext } from "react";
import { useRouter } from "next/navigation";
import { OnboardingCtx } from "../layout";
import ProgressBar from "@/components/progressbar";

export default function OnboardingComplete() {
  const router = useRouter();
  const { submitData } = useContext(OnboardingCtx);

  const handleFinish = async () => {
    try {
      await submitData();
      router.push("/homeresearchpage");
    } catch (err) {
      console.error("Failed to submit onboarding data:", err);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-tr from-white to-[#fdf1f1] px-6 py-32">
      <div className="mx-auto max-w-4xl rounded-3xl bg-[#ffffff] p-10 shadow-xl border border-[#e5e7eb] text-center">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-[#111827]">
          Profile done!
        </h1>
        <p className="mt-1 text-sm text-[#6b7280]">Complete</p>

        <div className="mx-auto mt-3 w-full max-w-xl">
          <ProgressBar step={3} total={3} />
        </div>

        <div className="my-12 flex justify-center">
          <img
            src="/thumbup.png"
            alt="Completed"
            className="h-48 w-48"
          />
        </div>

        <button
          onClick={handleFinish}
          className="rounded-md bg-[#ef4444] px-6 py-3 text-sm font-semibold text-white hover:bg-[#dc2626] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#b91c1c]"
        >
          Continue to Home
        </button>
      </div>
    </div>
  );
}