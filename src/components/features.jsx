function Card({ icon, title, desc }) {
  return (
    <div className="flex h-full flex-col items-center rounded-xl border border-[#e5e7eb] bg-[#ffffff] p-6 text-center shadow-sm hover:bg-[#f9fafb] hover:border-[#9ca3af] transition">
      <div className="mb-3 flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[#fee2e2]">
        <span className="ttext-xl leading-none text-[#b91c1c]">{icon}</span>
      </div>

      <h3 className="font-semibold text-[#111827]">{title}</h3>
      <p className="mt-1 text-sm text-[#4b5563]">{desc}</p>
    </div>
  );
}

export default function Features() {
  return (
    <section className="bg-[#f9fafb] border-t-2 border-[#e5e7eb]">
      <div className="mx-auto max-w-6xl px-5 py-16">
        <h2 className="mb-6 text-center text-2xl font-extrabold text-[#111827]">
          Everything you need for research success
        </h2>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          <Card
            icon={<span>🔎</span>}
            title="Discover Papers"
            desc="AI-powered search to find relevant research papers in your field."
          />
          <Card
            icon={<span>🎯</span>}
            title="Match to Opportunities"
            desc="Get matched to research opportunities based on your skills and interests."
          />
          <Card
            icon={<span>🗂️</span>}
            title="Summarize & Save"
            desc="AI summaries and an organized library to manage your research."
          />
        </div>
      </div>
    </section>
  );
}
