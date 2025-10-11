function Step({ n, title, desc }) {
    return (
      <div className="flex items-start gap-3 justify-left ">
        <div className=" flex h-12 w-12 items-center justify-center rounded-full bg-blue-600 text-xl font-bold text-white">
          {n}
        </div>
        <div className="text-left">
          <div className="font-semibold text-black ">{title}</div>
          <div className="text-sm text-gray-500">{desc}</div>
        </div>
      </div>
    );
  }
  
  export default function HowItWorks() {
    return (
      <section className="bg-white pt-10">
        <div className="mx-auto max-w-5xl px-5 pb-14" >
          <h2 className="mb-6 text-center text-3xl font-extrabold text-black ">How it works</h2>
  
          <div className="rounded-2xl border border-gray-200 bg-white p-10 shadow-sm">
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
  