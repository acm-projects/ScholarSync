import Link from "next/link";

export default function Navbar() {
  return (
    <header className="sticky top-0 left-0 w-full z-50 bg-[#170F0E] text-[#EEEef0] rounded-b-2xl shadow-2xl">
      <div className="flex items-center justify-between px-6 py-6">
        <Link href="/" className="font-extrabold text-3xl tracking-tight hover:text-[#ffb3a7] transition-colors">
          ScholarSync
        </Link>

        <nav className="hidden md:flex items-center gap-6">
          <Link href="/onboarding/onboarding1" className="hover:text-[#ffb3a7] font-medium transition-colors">create</Link>
          <Link href="/professorpage" className="hover:text-[#ffb3a7] font-medium transition-colors">professors</Link>
          <Link href="/homeresearchpage" className="hover:text-[#ffb3a7] font-medium transition-colors">opportunities</Link>
          <Link href="/" className="hover:text-[#ffb3a7] font-medium transition-colors">papers</Link>
          <Link href="/" className="hover:text-[#ffb3a7] font-medium transition-colors">library</Link>
          <Link href="/profile" className="rounded-md bg-[#983734] px-3 py-1.5 text-[#EEEef0] font-medium hover:bg-[#a9443f] transition">Profile</Link>
        </nav>
      </div>
    </header>
  );
}

