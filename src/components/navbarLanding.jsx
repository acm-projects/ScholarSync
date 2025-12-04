import Image from "next/image";
import Link from "next/link";


export default function Navbar() {
  return (
    <header className="sticky top-0 left-0 w-full z-50 bg-[#ffffff] text-[#111827] rounded-b-2xl shadow-sm">
       <div className="flex items-center justify-between px-6 py-4">

    <Link href="../professorpage" className="flex items-center gap-3">
    <div className="w-12 h-12 relative"> 
      <Image
        src="/logo.png"
        alt="Logo"
        fill
        className="rounded-full object-cover"
      />
    </div>
    <span className="font-extrabold text-3xl tracking-tight hover:text-[#ef4444]">
      ScholarSync
    </span>
  </Link>
        <nav className="hidden items-center gap-6 md:flex">


          <Link
            href="/signuplogin/login"
            className=" hover:text-[#ef4444] font-medium transition-colors"
          >
            Login
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

