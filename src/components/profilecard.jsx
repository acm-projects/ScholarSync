"use client";

// outer shell that has theme border, bg, padding for profile page
export default function ProfileCard({ className = "", children }) {
  return (
    <article
      className={[
        "w-full rounded-2xlp border border-[#5A2B29] bg-[#170F0E] p-7 md:p-9 lg:p-12 shadow",
        className,
      ].join(" ")}>
      {children}
    </article>
  );
}
