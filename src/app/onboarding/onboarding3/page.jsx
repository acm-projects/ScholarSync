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
    
    if (!data.resumeFile) {
      alert("Please upload a resume before continuing.");
      return;
    } 

    console.log("Uploaded file:", data.resumeFile);

    router.push("/onboarding/onboarding4");
  };

  return (
    <div className="min-h-screen bg-[#3D110F] px-6 py-42">
      <div className="mx-auto max-w-6xl rounded-3xl bg-[#170F0E] p-8 shadow-xl border border-[#5A2B29]">
        <h1 className="mb-1 text-center text-3xl font-semibold text-[#EEEef0]">
          Let’s set up your profile
        </h1>

        <div className="mx-auto mt-3 w-full max-w-xl">
          <ProgressBar step={3} total={4} />
        </div>

        <form onSubmit={onContinue} className="mx-auto mt-8 max-w-4xl space-y-6">
          <div className="rounded-2xl border-2 border-dashed border-[#5A2B29] h-80 flex flex-col items-center bg-[#201311] justify-center text-center p-14 ">
            <div className="text-7xl mb-6">⬆️</div>
            <p className="text-2xl font-bold text-[#EEEef0]">Upload your resume</p>
            <p className="mt-2 text-base text-[#EEEef0]/70">
              PDF, DOC, or DOCX (Max 5MB)
            </p>

            <input
              type="file"
              accept=".pdf,.doc,.docx"
              onChange={(e) =>
                handleChange({ name: "resumeFile", value: e.target.files?.[0] || null })
              }
              className="mt-6 block w-full text-base text-[#EEEef0]
                         file:mr-4 file:rounded-md file:border file:border-[#5A2B29]
                         file:bg-[#983734] file:px-5 file:py-3 file:text-base file:font-medium file:text-[#EEEef0]
                         hover:file:bg-[#983734]/80 focus:outline-none"
            />
          </div>

          <div className="flex justify-between">
            <button
              type="button"
              onClick={() => router.back()}
              className="rounded-md bg-[#983734] px-4 py-2 text-sm font-medium text-[#EEEef0] hover:bg-[#983734]/70"
            >
              Back
            </button>
            <button
              type="submit"
              className="rounded-md bg-[#983734] px-5 py-2 text-sm font-semibold text-white hover:bg-[#983734]/70"
            >
              Continue
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
