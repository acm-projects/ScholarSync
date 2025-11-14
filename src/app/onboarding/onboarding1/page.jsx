"use client";

import { useContext } from "react";
import { useRouter } from "next/navigation";
import { OnboardingCtx } from "../layout";
import ProgressBar from "@/components/progressbar";
import { LabeledInput } from "@/components/form";
import Dropdown from "@/components/dropdown";
import academics from "@/data/academics.json";

const MAJORS = academics.majors;
const MINORS = academics.minors;
const YEARS  = ["Freshman","Sophomore","Junior","Senior","Graduate"];

export default function OnboardingStep1() {
  const router = useRouter();
  const { data, handleChange } = useContext(OnboardingCtx);

  const canContinue = data.firstname && data.lastname && data.major && data.year;

  const onContinue = (e) => {
    e.preventDefault();
    router.push("/onboarding/onboarding2");
  };

  return (
    <div className="min-h-screen bg-[#f5f5f5] py-32 px-6 text-[#111827]">
      <div className="mx-auto max-w-6xl rounded-3xl bg-[#ffffff] p-8 shadow-xl border border-[#e5e7eb]">
        <h1 className="mb-1 text-center text-3xl font-semibold text-[#111827]">
          Let’s set up your profile
        </h1>
        <ProgressBar step={1} total={4} />

        <div className="mx-auto mt-6 max-w-4xl rounded-2xl bg-[#ffffff] border border-[#e5e7eb] p-6">
          <form onSubmit={onContinue} className="grid gap-8 md:grid-cols-2">
            <div>
              <h3 className="text-base font-semibold text-[#111827]">Basic Information</h3>
              <p className="mb-4 text-sm text-[#6b7280]">Tell us your name</p>

              <div className="space-y-4">
                <LabeledInput
                  label="First name"
                  name="firstname"
                  value={data.firstname}
                  onChange={handleChange}
                  placeholder="Enter your first name"
                  className="text-[#111827] placeholder-[#9ca3af]"
                  required
                />
                <LabeledInput
                  label="Last name"
                  name="lastname"
                  value={data.lastname}
                  onChange={handleChange}
                  placeholder="Enter your last name"
                  className="text-[#111827] placeholder-[#9ca3af]"
                  required
                />
              </div>
            </div>

            <div>
              <h3 className="text-base font-semibold text-[#111827]">Academics</h3>
              <p className="mb-4 text-sm text-[#6b7280]">Tell us about your studies</p>

              <div className="space-y-4">
                <Dropdown
                  label="Major"
                  name="major"
                  options={MAJORS}
                  value={data.major}
                  onChange={handleChange}
                  placeholder="Select your major"
                  required
                />
                <Dropdown
                  label="Minor (optional)"
                  name="minor"
                  options={MINORS}
                  value={data.minor}
                  onChange={handleChange}
                  placeholder="Select your minor"
                />
                <Dropdown
                  label="Academic Year"
                  name="year"
                  options={YEARS}
                  value={data.year}
                  onChange={handleChange}
                  placeholder="Select your year"
                  required
                />
              </div>
            </div>

            <div className="mt-2 flex items-center justify-between md:col-span-2">
              <button
                type="button"
                onClick={() => router.back()}
                className="rounded-md border border-[#d1d5db] bg-[#ffffff] px-4 py-2 text-sm font-medium text-[#374151] hover:bg-[#f3f4f6] hover:border-[#ef4444] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#ef4444]"
              >
                Back
              </button>
              <button
                type="submit"
                disabled={!canContinue}
                className={[
                  "rounded-md px-5 py-2 text-sm font-semibold",
                  !canContinue
                    ? "bg-[#e5e7eb] text-[#9ca3af] cursor-not-allowed"
                    : "bg-[#ef4444] text-white hover:bg-[#dc2626] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#b91c1c]",
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
