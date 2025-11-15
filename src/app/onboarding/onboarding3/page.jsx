"use client";

import { useContext } from "react";
import { useRouter } from "next/navigation";
import { OnboardingCtx } from "../layout";
import ProgressBar from "@/components/progressbar";

export default function OnboardingStep3() {
  const router = useRouter();
  const { data, handleChange } = useContext(OnboardingCtx);

  const onContinue = (e) => {
    e.preventDefault();

    {/* 
    if (!data.resumeFile) {
      alert("Please upload a resume before continuing.");
      return;
    }
    */}

    console.log("Uploaded file:", data.resumeFile);

    router.push("/onboarding/onboarding4");
  };

  return (
    <div className="min-h-screen bg-gradient-to-tr from-white to-[#fdf1f1]] px-6 py-32">
      <div className="mx-auto max-w-6xl rounded-3xl bg-[#ffffff] p-8 shadow-xl border border-[#e5e7eb]">
        <h1 className="mb-1 text-center text-3xl font-semibold text-[#111827]">
          Let’s set up your profile
        </h1>

        <div className="mx-auto mt-3 w-full max-w-xl">
          <ProgressBar step={3} total={4} />
        </div>

        <form onSubmit={onContinue} className="mx-auto mt-8 max-w-4xl space-y-6">
          <div className="rounded-2xl border-2 border-dashed border-[#e5e7eb] h-80 flex flex-col items-center bg-[#f9fafb] justify-center text-center p-14">
            <div className="text-7xl mb-6">⬆️</div>
            <p className="text-2xl font-bold text-[#111827]">Upload your resume</p>
            <p className="mt-2 text-base text-[#6b7280]">
              PDF, DOC, or DOCX (Max 5MB)
            </p>

            <input
              type="file"
              accept=".pdf,.doc,.docx"
              onChange={(e) =>
                handleChange({ name: "resumeFile", value: e.target.files?.[0] || null })
              }
              className="mt-6 block w-full text-base text-[#111827]
                         file:mr-4 file:rounded-md file:border file:border-[#d1d5db]
                         file:bg-[#ef4444] file:px-5 file:py-3 file:text-base file:font-medium file:text-white
                         hover:file:bg-[#dc2626] focus:outline-none"
            />
          </div>

          <div className="flex justify-between">
            <button
              type="button"
              onClick={() => router.back()}
              className="rounded-md bg-white px-4 py-2 text-sm font-medium text-[#374151] border border-[#d1d5db] hover:border-[#ef4444] hover:text-[#111827]"
            >
              Back
            </button>
            <button
              type="submit"
              className="rounded-md bg-[#ef4444] px-5 py-2 text-sm font-semibold text-white hover:bg-[#dc2626] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#b91c1c]"
            >
              Continue
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
