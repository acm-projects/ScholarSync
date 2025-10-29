"use client";

import { useMemo, useRef, useState } from "react";
import Navbar from "@/components/navbar";
import { LabeledInput } from "@/components/form";
import Dropdown from "@/components/dropdown";
import ProfileCard from "@/components/profilecard";
import Field from "@/components/field";
import TagTextBox from "@/components/tagtextbox"; 
import academics from "@/data/academics.json" assert { type: "json" };
import profileDefaults from "@/data/profile.json" assert { type: "json" };

/* option lists ) */
const YEARS  = ["Freshman", "Sophomore", "Junior", "Senior", "Graduate"];
const MAJORS = academics.majors;
const MINORS = academics.minors;

/* default shape of user profile */
const EMPTY = {
  firstname: "",
  lastname: "",
  major: "",
  minor: "",
  year: "",
  skills: [],
  projectTypes: [],
  interests: [],
  fields: [],
  researchTypes: [],
  careerGoals: [],
  resumeFile: null,
};

export default function ProfilePage() {
  /* state */
  const base = useMemo(() => ({ ...EMPTY, ...(profileDefaults || {}) }), []);
  const [form, setForm] = useState(base);
  const [edit, setEdit] = useState(false);
  const [saving, setSaving] = useState(false);
  const fileRef = useRef(null);

  /* computed display */
  const fullName = useMemo(
    () => [form.firstname, form.lastname].filter(Boolean).join(" ") || "Your Name",
    [form.firstname, form.lastname]
  );
  const initials = useMemo(
    () =>
      fullName
        .split(" ")
        .filter(Boolean)
        .map((w) => w[0])
        .slice(0, 2)
        .join("")
        .toUpperCase() || "NA",
    [fullName]
  );

  /* helpers */
  const setField = (name, value) => setForm((p) => ({ ...p, [name]: value }));
  const onChange = (eOrObj) => {
    const { name, value } = eOrObj?.target ? eOrObj.target : eOrObj;
    setField(name, value);
  };
  const onTags = (name, values) => setField(name, values);
  const onFile  = (e) => setField("resumeFile", e.target.files?.[0] || null);

  /* save */
  const onSave = async () => {
    setSaving(true);
    try {
      const fd = new FormData();
      Object.entries(form).forEach(([k, v]) => {
        if (v == null) return;
        fd.append(k, Array.isArray(v) ? JSON.stringify(v) : v);
      });
      await fetch("api.com", { method: "POST", body: fd });
      setEdit(false);
    } finally {
      setSaving(false);
    }
  };

  const onCancel = () => {
    setForm(base);
    setEdit(false);
    if (fileRef.current) fileRef.current.value = "";
  };

  /* tag for read only*/
  const Chips = ({ items = [] }) =>
    items?.length ? (
      <div className="flex flex-wrap gap-2">
        {items.map((t, i) => (
          <span
            key={`${t}-${i}`}
            className="inline-flex items-center rounded-full border border-[#5A2B29] bg-[#201311] px-2.5 py-1 text-s font-semibold text-[#EEEef0]"
          >
            {t}
          </span>
        ))}
      </div>
    ) : (
      <span className="text-sm text-[#E2E3E6]/70">None</span>
    );

  return (
    <div className="min-h-screen bg-[#3D110F] text-[#EEEef0]">
      <div className="relative z-10 rounded-b-2xl shadow">
        <Navbar />
      </div>

      <main className="mx-auto max-w-[1600px] px-6 md:px-10 lg:px-16 py-10">
        <ProfileCard>
          {/* header */}
          <div className="flex items-end gap-6">
            <div className="h-28 w-28 rounded-xl bg-[#983734] grid place-items-center text-3xl font-bold border border-[#5A2B29] shrink-0">
              {initials}
            </div>

            <div className="flex w-full items-end justify-between gap-4">
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-extrabold leading-none truncate">
                {fullName}
              </h1>

              {!edit ? (
                <button
                  onClick={() => setEdit(true)}
                  className="rounded-lg border border-[#5A2B29] bg-[#201311] px-4 py-2 font-semibold hover:bg-[#3C1A19] hover:border-[#BA3F3D]"
                >
                  Edit Profile
                </button>
              ) : (
                <div className="flex gap-3">
                  <button
                    onClick={onCancel}
                    className="rounded-lg border border-[#5A2B29] bg-[#201311] px-4 py-2 font-semibold hover:bg-[#3C1A19]"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={onSave}
                    disabled={saving}
                    className={`rounded-lg bg-[#983734] px-4 py-2 font-semibold text-white border border-[#5A2B29] ${
                      saving ? "opacity-70 cursor-not-allowed" : "hover:bg-[#983734]/80"
                    }`}
                  >
                    {saving ? "Saving..." : "Save"}
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* name */}
          <div className="mt-6 grid gap-6 md:grid-cols-2">
            <Field label="First name" locked={!edit}>
              {!edit ? (
                <div className="text-base">{form.firstname || <span className="text-[#E2E3E6]/70">Not set</span>}</div>
              ) : (
                <LabeledInput name="firstname" value={form.firstname} onChange={onChange} />
              )}
            </Field>
            <Field label="Last name" locked={!edit}>
              {!edit ? (
                <div className="text-base">{form.lastname || <span className="text-[#E2E3E6]/70">Not set</span>}</div>
              ) : (
                <LabeledInput name="lastname" value={form.lastname} onChange={onChange} />
              )}
            </Field>
          </div>

          <div className="border-t border-[#5A2B29] my-6" />

          {/* academics */}
          <section className="rounded-2xl border border-[#5A2B29] bg-[#201311] p-5 mb-6">
            <div className="grid gap-6 md:grid-cols-3">
              <Field label="Major" locked={!edit}>
                {!edit ? (
                  <div className="text-base">{form.major || <span className="text-[#E2E3E6]/70">Not set</span>}</div>
                ) : (
                  <Dropdown name="major" options={MAJORS} value={form.major} onChange={onChange} />
                )}
              </Field>
              <Field label="Minor (optional)" locked={!edit}>
                {!edit ? (
                  <div className="text-base">{form.minor || <span className="text-[#E2E3E6]/70">Not set</span>}</div>
                ) : (
                  <Dropdown name="minor" options={MINORS} value={form.minor} onChange={onChange} />
                )}
              </Field>
              <Field label="Academic Year" locked={!edit}>
                {!edit ? (
                  <div className="text-base">{form.year || <span className="text-[#E2E3E6]/70">Not set</span>}</div>
                ) : (
                  <Dropdown name="year" options={YEARS} value={form.year} onChange={onChange} />
                )}
              </Field>
            </div>
          </section>

          {/* preferences */}
          <section className="rounded-2xl border border-[#5A2B29] bg-[#201311] p-5 mb-6">
            <div className="grid gap-6 md:grid-cols-3">
              <Field label="Skills" locked={!edit}>
                {!edit ? (
                  <Chips items={form.skills} />
                ) : (
                  <TagTextBox
                    name="skills"
                    values={form.skills}
                    onChange={(v) => onTags("skills", v)}
                    placeholder="Type a skill and press Enter"
                  />
                )}
              </Field>
              <Field label="Preferred Project Types" locked={!edit}>
                {!edit ? (
                  <Chips items={form.projectTypes} />
                ) : (
                  <TagTextBox
                    name="projectTypes"
                    values={form.projectTypes}
                    onChange={(v) => onTags("projectTypes", v)}
                    placeholder="Add a project type"
                  />
                )}
              </Field>
              <Field label="Research Interests / Topics" locked={!edit}>
                {!edit ? (
                  <Chips items={form.interests} />
                ) : (
                  <TagTextBox
                    name="interests"
                    values={form.interests}
                    onChange={(v) => onTags("interests", v)}
                    placeholder="Add an interest"
                  />
                )}
              </Field>
              <Field label="Preferred Fields / Departments" locked={!edit}>
                {!edit ? (
                  <Chips items={form.fields} />
                ) : (
                  <TagTextBox
                    name="fields"
                    values={form.fields}
                    onChange={(v) => onTags("fields", v)}
                    placeholder="Add a field"
                  />
                )}
              </Field>
              <Field label="Type of Research" locked={!edit}>
                {!edit ? (
                  <Chips items={form.researchTypes} />
                ) : (
                  <TagTextBox
                    name="researchTypes"
                    values={form.researchTypes}
                    onChange={(v) => onTags("researchTypes", v)}
                    placeholder="Add a research type"
                  />
                )}
              </Field>
              <Field label="Career Goals / Applications" locked={!edit}>
                {!edit ? (
                  <Chips items={form.careerGoals} />
                ) : (
                  <TagTextBox
                    name="careerGoals"
                    values={form.careerGoals}
                    onChange={(v) => onTags("careerGoals", v)}
                    placeholder="Add a goal"
                  />
                )}
              </Field>
            </div>
          </section>

          {/* resume */}
          <section className="rounded-2xl border border-[#5A2B29] bg-[#201311] p-5">
            <Field label="Resume" locked={!edit}>
              {!edit ? (
                <div className="text-base">
                  {form.resumeFile
                    ? (typeof form.resumeFile === "string" ? form.resumeFile : form.resumeFile.name)
                    : <span className="text-[#E2E3E6]/70">No file uploaded</span>}
                </div>
              ) : (
                <>
                  <input
                    ref={fileRef}
                    type="file"
                    accept=".pdf,.doc,.docx"
                    onChange={onFile}
                    className="block w-full text-base text-[#EEEef0]
                      file:mr-4 file:rounded-md file:border file:border-[#5A2B29]
                      file:bg-[#983734] file:px-5 file:py-3 file:font-medium file:text-[#EEEef0]
                      hover:file:bg-[#983734]/80 focus:outline-none"
                  />
                  <div className="mt-2 text-sm text-[#E2E3E6] break-words">
                    {form.resumeFile
                      ? (typeof form.resumeFile === "string" ? form.resumeFile : form.resumeFile.name)
                      : "No file uploaded"}
                  </div>
                </>
              )}
            </Field>
          </section>
        </ProfileCard>
      </main>
    </div>
  );
}
