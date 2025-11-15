import Link from "next/link";

export default function HeroSection() {
  return (
    <section className="bg-gradient-to-b from-[#fef2f2] to-[#ffffff] text-[#111827] pt-25 py-20 pb-50">
      <div className="mx-auto flex max-w-6xl flex-col items-center px-5 py-20 text-center">
        <h1 className="text-4x font-extrabold sm:text-5xl">
          Welcome to ScholarSync
        </h1>

        <p className="mt-4 max-w-2xl text-[#4b5563] text-align-left">
          ScholarSync, an intelligent research collaboration platform designed specifically
          for students navigating the academic research landscape. Whether you’re seeking a new
          project, actively collaborating with faculty, or exploring literature for your current
          work, ScholarSync helps students discover opportunities, find relevant papers, and stay
          on top of academic progress—all in one place.
        </p>

        <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
          <Link
            href="/signuplogin/signup" 
            className="rounded-md border border-[#ef4444] bg-[#ef4444] px-5 py-2.5 font-semibold text-[#ffffff] hover:bg-[#dc2626] focus-visible:outline-none focus-visible:border-2 focus-visible:border-[#b91c1c] transition"
          >
            Get Started
          </Link>
          
        </div>
      </div>
    </section>
  );
}
