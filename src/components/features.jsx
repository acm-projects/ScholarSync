function Card({ icon, title, desc }) {
  return (
    <div className="flex h-full flex-col items-center rounded-xl border border-gray-200 bg-white p-6 text-center shadow-sm">
      <div className="mb-3 flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-blue-600">
        <span className="text-xl leading-none text-white">{icon}</span>
      </div>

      <h3 className="font-semibold text-black">{title}</h3>
      <p className="mt-1 text-sm text-gray-600">{desc}</p>
    </div>
  );
}

export default function Features() {
  return (
    <section className="bg-white">
      <div className="mx-auto max-w-6xl px-5 py-16">
        <h2 className="mb-6 text-center text-2xl font-extrabold text-black">
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
