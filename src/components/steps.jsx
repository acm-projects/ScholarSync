function Step({ n, title, desc }) {
    return (
      <div className="flex items-start gap-3 justify-left ">
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#983734] text-xl font-bold text-[#EEEef0]">
          {n}
        </div>
        <div className="text-left">
          <div className="font-semibold text-[#EEEef0]">{title}</div>
          <div className="text-sm text-[#E2E3E6]">{desc}</div>
        </div>
      </div>
    );
  }
  
  export default function HowItWorks() {
    return (
      <section className="bg-[#3D110F] pt-10">
        <div className="mx-auto max-w-5xl px-5 pb-14" >
          <h2 className="mb-6 text-center text-3xl font-extrabold text-[#EEEef0]">How it works</h2>
  
          <div className="rounded-2xl border border-[#5A2B29] bg-[#201311] p-10 shadow-sm">
            <div className="grid gap-6 sm:grid-cols-2 ">
              <Step n="1" title="Profile" desc="Set up your academic profile and interests" />
              <Step n="3" title="Summarize" desc="Get AI-powered insights and summaries" />
              <Step n="2" title="Discover" desc="Find papers and opportunities that match you" />
              <Step n="4" title="Apply" desc="Apply to opportunities and track progress" />
            </div>
          </div>
        </div>
      </section>
    );
  }
  