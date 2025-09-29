"use client";

import { useContext } from "react";
import { useRouter } from "next/navigation";
import { OnboardingCtx } from "../onboarding/layout";
import ProgressBar from "@/components/progressbar";

export default function OnboardingStep3() {
  const router = useRouter();
  const { data, handleChange } = useContext(OnboardingCtx);

  const onContinue = (e) => {
    e.preventDefault();

    if (!data.resumeFile) {
      alert("Please upload a resume before continuing.");
      return;
    }

    console.log("Uploaded file:", data.resumeFile);

    router.push("/onboarding/onboarding4");
  };

  return (
    <div className="min-h-screen bg-blue-500 px-6 py-42">
      <div className="mx-auto max-w-6xl rounded-3xl bg-white p-8 shadow-xl">
        <h1 className="mb-1 text-center text-3xl font-semibold text-black">
          Let’s set up your profile
        </h1>

        <div className="mx-auto mt-3 w-full max-w-xl">
          <ProgressBar step={3} total={4} />
        </div>

        <form onSubmit={onContinue} className="mx-auto mt-8 max-w-4xl space-y-6">
          <div className="rounded-2xl border-2 border-dashed border-gray-300 h-80 flex flex-col items-center justify-center text-center p-14">
            <div className="text-7xl mb-6">⬆️</div>
            <p className="text-2xl font-bold text-black">Upload your resume</p>
            <p className="mt-2 text-base text-gray-600">
              PDF, DOC, or DOCX (Max 5MB)
            </p>

            <input
              type="file"
              accept=".pdf,.doc,.docx"
              onChange={(e) =>
                handleChange({ name: "resumeFile", value: e.target.files?.[0] || null })
              }
              className="mt-6 block w-full text-base text-gray-800 file:mr-4 file:rounded-md file:border-0 file:bg-blue-600 file:px-5 file:py-3 file:text-base file:font-medium file:text-white hover:file:bg-blue-700"
            />
          </div>

          <div className="flex justify-between">
            <button
              type="button"
              onClick={() => router.back()}
              className="rounded-md border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-200"
            >
              Back
            </button>
            <button
              type="submit"
              className="rounded-md bg-black px-5 py-2 text-sm font-semibold text-white hover:bg-gray-800"
            >
              Continue
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

