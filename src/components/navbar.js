import Link from "next/link";

export default function Navbar() {
  return (
    <header className="top-0 left-0 w-full z-50 bg-black text-white rounded-b-xl shadow-md">
      <div className="flex items-center justify-between px-6 py-6 ">
    
        <Link href="/" className="font-extrabold text-3xl tracking-tight">
          ScholarSync
        </Link>

        
        <nav className="hidden items-center gap-6 md:flex">
          <Link href="/" className="hover:opacity-80 font-medium">create</Link>
          <Link href="/" className="hover:opacity-80 font-medium">discover</Link>
          <Link href="/" className="hover:opacity-80 font-medium">library</Link>
          <Link href="/" className="rounded-md bg-white px-3 py-1.5 text-black font-medium hover:bg-gray-200">Profile</Link>
        </nav>
      </div>
    </header>
  );
}
