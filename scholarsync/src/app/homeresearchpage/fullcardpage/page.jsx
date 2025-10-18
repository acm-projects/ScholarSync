import Navbar from "@/components/navbar";
import FullPageCard from "@/components/fullpagecard";
import { normalizeAllItems } from "@/components/pagesort";
import recommendedData from "@/data/opportunities_recommended.json" assert { type: "json" };
import allData from "@/data/opportunities_all.json" assert { type: "json" };
import userTags from "@/data/user_tags.json" assert { type: "json" };

export default function FullCardPage({ searchParams }) {
  // get id from query
  const id = decodeURIComponent(searchParams?.id || "");

  // combine and replicate quickly then normalize like the list page
  const combined = normalizeAllItems(
    Array.from(new Map([...recommendedData, ...allData].map(it => [String(it.id), it])).values()),
    userTags
  );

  // find the exact item we clicked
  const item = combined.find(it => String(it.id) === id);

  // page shell with navbar then the big card inside
  return (
    <div className="min-h-screen bg-[#3D110F] text-[#EEEef0]">
      <div className="relative z-10 rounded-b-2xl shadow">
        <Navbar />
      </div>
      <main className="mx-auto max-w-[1400px] px-4 md:px-8 py-6">
        {item ? (
          <FullPageCard item={item} userTags={userTags} />
        ) : (
          <div className="mx-auto max-w-3xl px-6 py-16 text-center text-[#EEEef0]">
            <h1 className="text-2xl font-bold mb-2">Opportunity not found</h1>
            <p className="text-[#EEEef0]/80">The card you’re looking for doesn’t exist or was removed.</p>
          </div>
        )}
      </main>
    </div>
  );
}
