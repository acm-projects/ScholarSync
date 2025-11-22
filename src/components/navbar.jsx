

import Link from "next/link";
import logo from "./logo.png";

export default function Navbar() {
  return (
    <header className="sticky top-0 left-0 w-full z-50 bg-[#ffffff] text-[#111827] rounded-b-2xl shadow-sm">
      <div className="flex items-center justify-between px-6 py-4">
        <Link href="/" className="font-extrabold text-3xl tracking-tight hover:text-[#ef4444] transition-colors">
          ScholarSync
        </Link>

        <nav className="hidden md:flex items-center gap-6">
          <Link href="/onboarding/onboarding1" className="hover:text-[#ef4444] font-medium transition-colors"></Link>
          <Link href="/professorpage" className="hover:text-[#ef4444] font-medium transition-colors">Professors</Link>
          <Link href="/homeresearchpage" className="hover:text-[#ef4444] font-medium  transition-colors">Opportunities</Link>
          <Link href="/discovery" className="hover:text-[#ef4444] font-medium transition-colors">Papers</Link>
          <Link href="/LibrarySt" className="hover:text-[#ef4444] font-medium transition-colors">Library</Link>
          <Link
            href="/profile"
            className="rounded-md bg-[#ef4444] px-3 py-1.5 text-[#ffffff] font-medium hover:bg-[#dc2626] transition"
          >
            Sign Up
          </Link>
        </nav>
      </div>
    </header>
  );
}
