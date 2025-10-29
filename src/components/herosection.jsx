import Link from "next/link";

export default function HeroSection() {
  return (
    <section className="bg-[#3D110F] text-[#EEEef0] pt-25 pb-30">
      <div className="mx-auto flex max-w-6xl flex-col items-center px-5 py-20 text-center">
        <h1 className="text-4x font-extrabold sm:text-5xl">
          Welcome to ScholarSync
        </h1>

        <p className="mt-4 max-w-2xl text-[#E2E3E6] text-align-left">
          ScholarSync, an intelligent research collaboration platform designed specifically
          for students navigating the academic research landscape. Whether you’re seeking a new
          project, actively collaborating with faculty, or exploring literature for your current
          work, ScholarSync helps students discover opportunities, find relevant papers, and stay
          on top of academic progress—all in one place.
        </p>

        <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
          <Link href="/onboarding/onboarding1" 
           className="rounded-md border border-[#5A2B29] bg-[#983734] px-5 py-2.5 font-semibold text-[#EEEef0] hover:bg-[#a9443f] focus-visible:outline-none focus-visible:border-2 focus-visible:border-[#BA3F3D] transition" >
            Get Started
          </Link>
          <Link href="/signuplogin/login" 
           className="rounded-md border border-[#5A2B29] bg-[#201311] px-5 py-2.5 font-semibold text-[#EEEef0] hover:bg-[#3C1A19] focus-visible:outline-none focus-visible:border-2 focus-visible:border-[#BA3F3D] transition" >
            Login
          </Link>
        </div>
      </div>
    </section>
  );
}
