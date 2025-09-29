import Link from "next/link";

export default function HeroSection() {
  return (
    <section className="bg-blue-500 text-white pt-25 pb-30">
      <div className="mx-auto flex max-w-6xl flex-col items-center px-5 py-20 text-center">
        <h1 className="text-4xl font-extrabold sm:text-5xl">
          Welcome to ScholarSync
        </h1>

        <p className="mt-4 max-w-2xl text-blue-100 text-align-left ">
          ScholarSync, an intelligent research collaboration platform designed specifically
          for students navigating the academic research landscape. Whether you’re seeking a new
          project, actively collaborating with faculty, or exploring literature for your current
          work, ScholarSync helps students discover opportunities, find relevant papers, and stay
          on top of academic progress—all in one place.
        </p>

        <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
          <Link href="/signuplogin/signup" className="rounded-md bg-black px-5 py-2.5 font-semibold text-white hover:bg-gray-800" >
            Get Started
          </Link>
          <Link href="/signuplogin/login" className="rounded-md bg-white px-5 py-2.5 font-semibold text-black hover:bg-gray-200" >
            Login
          </Link>
        </div>
      </div>
    </section>
  );
}
