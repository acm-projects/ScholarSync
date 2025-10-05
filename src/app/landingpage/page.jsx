import Navbar from "@/components/navbar";
import HeroSection from "@/components/herosection";
import Features from "@/components/features";
import HowItWorks from "@/components/steps";

export default function LandingPage() {
  return (
    <>
    <div className="min-h-screen bg-blue-500">
      <div className="relative z-10 bg-white rounded-b-2xl shadow">
        <Navbar />
      </div>
    
      <HeroSection />
      <Features />
      <HowItWorks />
    </div>
    </>
  );
}

