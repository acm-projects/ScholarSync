"use client";

import { useContext } from "react";
import { useRouter } from "next/navigation";
import { OnboardingCtx } from "../layout";
import ProgressBar from "@/components/progressbar";
import MultiSelectDropdown from "@/components/multidropdown";
import tags from "@/data/tags.json";

const SKILLS        = tags.skills;
const INTEREST      = tags.interests;
const PROJECTTYPES  = tags.projectTypes;
const FIELDS        = tags.fields;
const RESEARCHTYPES = tags.researchTypes;
const CAREERGOALS   = tags.careerGoals;

export default function OnboardingStep4() {
  const router = useRouter();
  const { data, handleChange } = useContext(OnboardingCtx);

  const onContinue = (e) => {
    e.preventDefault();
    router.push("/onboarding/onboarding5complete");
  };

  return (
    <div className="min-h-screen bg-[#3D110F] px-6 py-32">
      <div className="mx-auto max-w-6xl rounded-3xl bg-[#170F0E] p-10 shadow-xl border border-[#5A2B29]">
        <h1 className="text-center text-3xl sm:text-4xl font-extrabold tracking-tight text-[#EEEef0]">
          Extra Questions
        </h1>

        <div className="mx-auto mt-3 w-full max-w-xl">
          <ProgressBar step={4} total={4} />
        </div>

        <form onSubmit={onContinue} className="mx-auto mt-8 max-w-4xl">
          <fieldset className="rounded-2xl border border-[#5A2B29] bg-[#201311] p-6 sm:p-8 shadow-sm">
            <div className="mb-6">
              <h2 className="text-lg font-semibold text-[#EEEef0]">
                Tell us a bit more
              </h2>
              <p className="mt-1 text-sm text-[#E2E3E6]">
                These questions are optional — you can skip if you like.
              </p>
            </div>

            <div className="grid gap-8 md:grid-cols-2">
              <MultiSelectDropdown
                label="Question 1"
                name="extraQ1"
                options={SKILLS}
                values={data.extraQ1 || []}
                onChange={(vals) => handleChange({ name: "extraQ1", value: vals })}
                placeholder="Select skills"
              />
              <MultiSelectDropdown
                label="Question 2"
                name="extraQ2"
                options={PROJECTTYPES}
                values={data.extraQ2 || []}
                onChange={(vals) => handleChange({ name: "extraQ2", value: vals })}
                placeholder="Select project types"
              />
              <MultiSelectDropdown
                label="Question 3"
                name="extraQ3"
                options={INTEREST}
                values={data.extraQ3 || []}
                onChange={(vals) => handleChange({ name: "extraQ3", value: vals })}
                placeholder="Select interests"
              />
              <MultiSelectDropdown
                label="Question 4"
                name="extraQ4"
                options={FIELDS}
                values={data.extraQ4 || []}
                onChange={(vals) => handleChange({ name: "extraQ4", value: vals })}
                placeholder="Select fields"
              />
              <MultiSelectDropdown
                label="Question 5"
                name="extraQ5"
                options={RESEARCHTYPES}
                values={data.extraQ5 || []}
                onChange={(vals) => handleChange({ name: "extraQ5", value: vals })}
                placeholder="Select research types"
              />
              <MultiSelectDropdown
                label="Question 6"
                name="extraQ6"
                options={CAREERGOALS}
                values={data.extraQ6 || []}
                onChange={(vals) => handleChange({ name: "extraQ6", value: vals })}
                placeholder="Select goals"
              />
            </div>

            <div className="mt-6 flex items-center justify-between border-t border-[#5A2B29] pt-6">
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
          </fieldset>
        </form>
      </div>
    </div>
  );
}
