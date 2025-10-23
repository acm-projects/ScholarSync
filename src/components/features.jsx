function Card({ icon, title, desc }) {
  return (
    <div className="flex h-full flex-col items-center rounded-xl border border-[#5A2B29] bg-[#201311] p-6 text-center shadow-sm hover:bg-[#3C1A19] hover:border-[#BA3F3D] transition">
      <div className="mb-3 flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[#983734]">
        <span className="ttext-xl leading-none text-[#EEEef0]">{icon}</span>
      </div>

      <h3 className="font-semibold text-[#EEEef0]">{title}</h3>
      <p className="mt-1 text-sm text-[#E2E3E6]">{desc}</p>
    </div>
  );
}

export default function Features() {
  return (
    <section className="bg-[#3D110F] border-t-2 border-[#5A2B29]">
      <div className="mx-auto max-w-6xl px-5 py-16">
        <h2 className="mb-6 text-center text-2xl font-extrabold text-[#EEEef0]">
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
