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
    <div className="min-h-screen bg-[#3D110F] py-32 px-6">
      <div className="mx-auto max-w-6xl rounded-3xl bg-[#170F0E] p-8 shadow-xl border border-[#5A2B29] ">
        <h1 className="mb-1 text-center text-3xl font-semibold text-[#EEEef0]">
          Let’s set up your profile
        </h1>
        <ProgressBar step={1} total={4} />

        <div className="mx-auto mt-6 max-w-4xl rounded-2xl bg-[#201311] border border-[#5A2B29] p-6">
          <form onSubmit={onContinue} className="grid gap-8 md:grid-cols-2">
            <div>
              <h3 className="text-base font-semibold text-[#EEEef0]">Basic Information</h3>
              <p className="mb-4 text-sm text-[#E2E3E6]">Tell us your name</p>

              <div className="space-y-4">
                <LabeledInput
                  label="First name"
                  name="firstname"
                  value={data.firstname}
                  onChange={handleChange}
                  placeholder="Enter your first name"
                  className="text-[#E2E3E6] placeholder-[#EEEef0]/50"
                  required
                />
                <LabeledInput
                  label="Last name"
                  name="lastname"
                  value={data.lastname}
                  onChange={handleChange}
                  placeholder="Enter your last name"
                  className="text-[#E2E3E6] placeholder-[#EEEef0]/50"
                  required
                />
              </div>
            </div>

            <div>
              <h3 className="text-base font-semibold text-[#EEEef0]">Academics</h3>
              <p className="mb-4 text-sm text-[#E2E3E6]">Tell us about your studies</p>

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
                className="rounded-md bg-[#983734] px-4 py-2 text-sm font-medium text-[#EEEef0] hover:bg-[#983734]/70"
              >
                Back
              </button>
              <button
                type="submit"
                disabled={!canContinue}
                className={[
                  "rounded-md px-5 py-2 text-sm font-semibold",
                  !canContinue
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
