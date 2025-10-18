"use client";

import { useContext, useMemo } from "react";
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
    <div className="min-h-screen bg-[#3D110F] py-32 px-6">
      <div className="mx-auto max-w-6xl rounded-3xl bg-[#170F0E] p-8 shadow-xl border border-[#5A2B29] ">
        <h1 className="mb-1 text-center text-3xl font-semibold text-[#EEEef0]">
          Let’s set up your profile
        </h1>
        <ProgressBar step={2} total={4} />

        <div className="mx-auto mt-6 max-w-4xl rounded-2xl border bg-[#201311] border-[#5A2B29] p-6">
          <form onSubmit={onContinue} className="grid gap-8">
            <div>
              <h3 className="text-base font-semibold text-[#EEEef0]">
                Research & Skills
              </h3>
              <p className="mb-4 text-sm text-[#E2E3E6]">
                Tell us about your interests and skills
              </p>

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
            </div>

            {!canContinue && (
              <p className="text-sm text-[#E2E3E6]/80">
                * Please select at least one option in each category to continue.
              </p>
            )}

            <div className="mt-2 flex items-center justify-between">
              <button
                type="button"
                onClick={() => router.back()}
                className="rounded-md bg-[#983734] px-4 py-2 text-sm font-medium text-[#EEEef0] hover:bg-[#983734]/70"
              >
                Back
              </button>
              <button
                type="submit"
                disabled={!canContinue}
                className={[
                  "rounded-md px-5 py-2 text-sm font-semibold",
                  canContinue
                    ? "bg-[#983734] text-white hover:bg-[#983734]/70"
                    : "bg-[#983734] text-[#EEEef0] cursor-not-allowed",
                ].join(" ")}
              >
                Continue
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
