"use client";

import { useContext } from "react";
import { useRouter } from "next/navigation";
import { OnboardingCtx } from "../onboarding/layout";
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
    <div className="min-h-screen bg-blue-500 px-6 py-32">
      <div className="mx-auto max-w-4xl rounded-3xl bg-white p-10 shadow-xl text-center">

        <h1 className="text-3xl sm:text-4xl font-extrabold text-black">
          Profile done!
        </h1>
        <p className="mt-1 text-gray-500 text-sm">Complete</p>

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
          className="rounded-md bg-black px-6 py-3 text-white font-semibold hover:bg-gray-800"
        >
          Continue to Home
        </button>
      </div>
    </div>
  );
}
