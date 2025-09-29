"use client";

import { useContext, useMemo } from "react";
import { useRouter } from "next/navigation";
import { OnboardingCtx } from "../onboarding/layout";
import ProgressBar from "@/components/progressbar";
import MultiSelectDropdown from "@/components/multidropdown";
import tags from "@/data/tags.json";

const SKILLS        = tags.skills;
const INTEREST      = tags.interests;
const PROJECTTYPES  = tags.projectTypes;
const FIELDS        = tags.fields;
const RESEARCHTYPES = tags.researchTypes;
const CAREERGOALS   = tags.careerGoals;

export default function OnboardingStep2() {
  const router = useRouter();
  const { data, setData } = useContext(OnboardingCtx);

  const handleMultiChange = (name, values) => {
    setData((prev) => ({
      ...prev,
      [name]: values, 
    }));
  };

  const canContinue = useMemo(
    () =>
      data.skills?.length > 0 &&
      data.interests?.length > 0 &&
      data.projectTypes?.length > 0 &&
      data.fields?.length > 0 &&
      data.researchTypes?.length > 0 &&
      data.careerGoals?.length > 0,
    [data]
  );

  const onContinue = (e) => {
    e.preventDefault();
    router.push("/onboarding/onboarding3");
  };

  return (
    <div className="min-h-screen bg-blue-500 px-6 py-32">
      <div className="mx-auto max-w-6xl rounded-3xl bg-white p-10 shadow-xl">

        <h1 className="text-center text-3xl sm:text-4xl font-extrabold tracking-tight text-black">
          Let’s set up your profile
        </h1>

        <div className="mx-auto mt-3 w-full max-w-xl">
          <ProgressBar step={2} total={4} />
        </div>

        <form onSubmit={onContinue} className="mx-auto mt-8 max-w-4xl">
          <fieldset className="rounded-2xl border border-gray-200 bg-white p-6 sm:p-8 shadow-sm">

            <div className="mb-6">
              <h2 className="text-lg font-semibold text-gray-900">
                Research &amp; Skills
              </h2>
              <p className="mt-1 text-sm text-gray-500">
                Tell us about your interests &amp; skills
              </p>
            </div>

            <div className="grid gap-8 md:grid-cols-2">
              <MultiSelectDropdown
                label="Skills"
                name="skills"
                options={SKILLS}
                values={data.skills || []}
                onChange={(vals) => handleMultiChange("skills", vals)}
                placeholder="Select skills"
              />
              <MultiSelectDropdown
                label="Preferred Project Types"
                name="projectTypes"
                options={PROJECTTYPES}
                values={data.projectTypes || []}
                onChange={(vals) => handleMultiChange("projectTypes", vals)}
                placeholder="Select project types"
              />
              <MultiSelectDropdown
                label="Research Interests / Topics"
                name="interests"
                options={INTEREST}
                values={data.interests || []}
                onChange={(vals) => handleMultiChange("interests", vals)}
                placeholder="Select interests"
              />
              <MultiSelectDropdown
                label="Preferred Research Fields / Departments"
                name="fields"
                options={FIELDS}
                values={data.fields || []}
                onChange={(vals) => handleMultiChange("fields", vals)}
                placeholder="Select fields"
              />
              <MultiSelectDropdown
                label="Type of Research"
                name="researchTypes"
                options={RESEARCHTYPES}
                values={data.researchTypes || []}
                onChange={(vals) => handleMultiChange("researchTypes", vals)}
                placeholder="Select research types"
              />
              <MultiSelectDropdown
                label="Career Goals / Applications"
                name="careerGoals"
                options={CAREERGOALS}
                values={data.careerGoals || []}
                onChange={(vals) => handleMultiChange("careerGoals", vals)}
                placeholder="Select goals"
              />
            </div>

            {!canContinue && (
              <p className="mt-4 text-sm text-red-500">
                * Please select at least one option in each category to continue.
              </p>
            )}

            <div className="mt-6 flex items-center justify-between border-t border-gray-200 pt-6">
              <button
                type="button"
                onClick={() => router.back()}
                className="rounded-md border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-200"
              >
                Back
              </button>
              <button
                type="submit"
                disabled={!canContinue}
                className={[
                  "rounded-md px-5 py-2 text-sm font-semibold",
                  canContinue
                    ? "bg-black text-white hover:bg-gray-800"
                    : "bg-gray-200 text-gray-500 cursor-not-allowed",
                ].join(" ")}
                aria-disabled={!canContinue}
                title={
                  !canContinue
                    ? "Select at least one option in each category"
                    : undefined
                }
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
