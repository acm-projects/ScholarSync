import Navbar from "@/components/navbar";
import HeroSection from "@/components/herosection";
import Features from "@/components/features";
import HowItWorks from "@/components/steps";

export default function LandingPage() {
  return (
    <>
       <div className="min-h-screen bg-[#3D110F] text-[#EEEef0]">
      <div className="relative z-10 rounded-b-1xl shadow">
        <Navbar />
      </div>
      
      <HeroSection />
      <Features />
      <HowItWorks />
    </div>
    </>
  );
}
