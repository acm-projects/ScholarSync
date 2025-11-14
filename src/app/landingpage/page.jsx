import Navbar2 from "@/components/navbarLanding";
import HeroSection from "@/components/herosection";
import Features from "@/components/features";
import HowItWorks from "@/components/steps";
import Loading from "@/components/loading";

export default function LandingPage() {
  return (
    <>
    <div className="min-h-screen bg-[#ffffff] text-[#EEEef0]">
      <div className="relative z-10 rounded-b-2xl shadow">
        <Navbar2 />
      </div>
      <HeroSection />
      
      <HowItWorks />
    </div>
    </>
  );
}
