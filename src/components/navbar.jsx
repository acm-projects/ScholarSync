

import Link from "next/link";


export default function Navbar() {
  return (
    <header className="top-0 left-0 w-full h-18 z-50 bg-[#ffffff] text-[#11111] rounded-b-2xl">
      <div className="flex items-center justify-between px-6 py-6 text-black">
        
        <Link
          href="../homeresearchpage"
          className="font-extrabold text-3xl tracking-tight hover:text-[#ef4444] text-[#11111] "
        >
          ScholarSync
        </Link>

        <nav className="hidden items-center gap-6 md:flex">

          <Link
            href="/Create"
            className="hover:text-[#ef4444] font-medium transition-colors"
          >
            Create
          </Link>
          <Link
            href="/professorpage"
            className="hover:text-[#ef4444] font-medium transition-colors"
          >
            Professors
          </Link>
          <Link
            href="/homeresearchpage"
            className="hover:text-[#ef4444] font-medium transition-colors"
          >
            Discover
          </Link>
          <Link
            href="/discovery"
            className="hover:text-[#ef4444] font-medium transition-colors"
          >
            Papers
          </Link>
          <Link
            href="/LibrarySt"
            className=" hover:text-[#ef4444] font-medium transition-colors"
          >
            Library
          </Link>
           <Link
            href="/signuplogin/signup"
            className="rounded-md bg-[#ef4444] px-3 py-1.5 text-[#EEEef0] font-medium hover:bg-[#a9443f] transition"
          >
            Sign Up
          </Link>
        </nav>
      </div>
    </header>
  );
}

  /*<Link
            href="/"
            className="rounded-md bg-[#ef4444] px-3 py-1.5 text-[#EEEef0] font-medium hover:bg-[#a9443f] transition"
          >
            Profile
          </Link> */

