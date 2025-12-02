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
    <div className="min-h-screen bg-gradient-to-tr from-white to-[#fdf1f1] py-32 px-6 text-[#111827]">
      <div className="mx-auto max-w-6xl rounded-3xl bg-[#ffffff] p-8 shadow-xl border border-[#e5e7eb]">
        <h1 className="mb-1 text-center text-3xl font-semibold text-[#111827]">
          Let’s set up your profile
        </h1>
        <ProgressBar step={1} total={3} />

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
  type="submit"
  disabled={!canContinue}
  style={{
    borderRadius: "0.375rem", 
    padding: "0.5rem 1.25rem", 
    fontSize: "0.875rem",
    fontWeight: 600,
    border: "none",
    cursor: canContinue ? "pointer" : "not-allowed",
    backgroundColor: canContinue ? "#ef4444" : "#e5e7eb",
    color: canContinue ? "white" : "#9ca3af",
    outline: "none",
    transition: "background-color 0.2s",
  }}
  onMouseOver={(e) => {
    if (canContinue) e.target.style.backgroundColor = "#dc2626"; 
  }}
  onMouseOut={(e) => {
    if (canContinue) e.target.style.backgroundColor = "#ef4444"; 
  }}
  onFocus={(e) => {
    if (canContinue) e.target.style.boxShadow = "0 0 0 2px #b91c1c";
  }}
  onBlur={(e) => {
    e.target.style.boxShadow = "none";
  }}
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