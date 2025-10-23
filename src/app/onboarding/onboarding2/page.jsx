"use client";

import { useContext, useMemo } from "react";
import { useRouter } from "next/navigation";
import { OnboardingCtx } from "../layout";
import ProgressBar from "@/components/progressbar";
import TagTextBox from "@/components/tagtextbox";

export default function OnboardingStep2() {
  const router = useRouter();
  const { data, setData } = useContext(OnboardingCtx);

  const updateBucket = (name, values) => {
    setData((prev) => {
      const next = { ...prev, [name]: values };
      const merged = Array.from(
        new Set([
          ...(next.skills || []),
          ...(next.projectTypes || []),
          ...(next.interests || []),
          ...(next.fields || []),
          ...(next.researchTypes || []),
          ...(next.careerGoals || []),
        ])
      );
      next.alltags = merged;
      return next;
    });
  };

  const canContinue = useMemo(
    () =>
      (data.skills?.length ?? 0) > 0 &&
      (data.interests?.length ?? 0) > 0 &&
      (data.projectTypes?.length ?? 0) > 0 &&
      (data.fields?.length ?? 0) > 0 &&
      (data.researchTypes?.length ?? 0) > 0 &&
      (data.careerGoals?.length ?? 0) > 0,
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
                Type a tag and press Enter to add it. Click a tag to remove.
              </p>

              <div className="grid gap-8 md:grid-cols-2">
                <TagTextBox
                  label="Skills"
                  name="skills"
                  values={data.skills || []}
                  onChange={(vals) => updateBucket("skills", vals)}
                />
                <TagTextBox
                  label="Preferred Project Types"
                  name="projectTypes"
                  values={data.projectTypes || []}
                  onChange={(vals) => updateBucket("projectTypes", vals)}
                />
                <TagTextBox
                  label="Research Interests / Topics"
                  name="interests"
                  values={data.interests || []}
                  onChange={(vals) => updateBucket("interests", vals)}
                />
                <TagTextBox
                  label="Preferred Research Fields / Departments"
                  name="fields"
                  values={data.fields || []}
                  onChange={(vals) => updateBucket("fields", vals)}
                />
                <TagTextBox
                  label="Type of Research"
                  name="researchTypes"
                  values={data.researchTypes || []}
                  onChange={(vals) => updateBucket("researchTypes", vals)}
                />
                <TagTextBox
                  label="Career Goals / Applications"
                  name="careerGoals"
                  values={data.careerGoals || []}
                  onChange={(vals) => updateBucket("careerGoals", vals)}
                />
              </div>
            </div>

            {!canContinue && (
              <p className="text-sm text-[#E2E3E6]/80">
                * Please add at least one tag in each category to continue.
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
