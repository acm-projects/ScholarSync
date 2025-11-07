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
    <div className="min-h-screen bg-[#3D110F] px-6 py-32">
      <div className="mx-auto max-w-4xl rounded-3xl bg-[#170F0E] p-10 shadow-xl border border-[#5A2B29] text-center">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-[#EEEef0]">
          Profile done!
        </h1>
        <p className="mt-1 text-sm text-[#E2E3E6]">Complete</p>

        <div className="mx-auto mt-3 w-full max-w-xl">
          <ProgressBar step={5} total={5} />
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
          className="rounded-md bg-[#983734] px-6 py-3 text-sm font-semibold text-[#EEEef0] hover:bg-[#983734]/70"
        >
          Continue to Home
        </button>
      </div>
    </div>
  );
}
