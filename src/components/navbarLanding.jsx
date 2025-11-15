import Link from "next/link";

export default function Navbar2() {
  return (
    <header className="sticky top-0 left-0 w-full z-50 bg-[#ffffff] text-[#111827] rounded-b-2xl shadow-sm">
      <div className="flex items-center justify-between px-6 py-4">
        <Link href="/homeresearchpage" className="font-extrabold text-3xl tracking-tight hover:text-[#ef4444] transition-colors">
          ScholarSync
        </Link>

        <nav className="hidden md:flex items-center gap-6">
        
          <Link href="/signuplogin/login" className="hover:text-[#ef4444] font-medium transition-colors">Login</Link>
          <Link
            href="/signuplogin/signup"
            className="rounded-md bg-[#ef4444] px-3 py-1.5 text-[#ffffff] font-medium hover:bg-[#dc2626] transition"
          >
            Sign Up
          </Link>
        </nav>
      </div>
    </header>
  );
}
