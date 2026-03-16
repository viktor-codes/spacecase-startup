"use client";

import HeroSection from "@/components/landing/HeroSection";
import HowItWorksSection from "@/components/landing/HowItWorksSection";
import TechnicalExcellenceSection from "@/components/landing/TechnicalExcellenceSection";
import AIRestorationSection from "@/components/landing/AIRestorationSection";
import StoriesSection from "@/components/landing/StoriesSection";
import TryNowSection from "@/components/landing/TryNowSection";
import GuaranteesSection from "@/components/landing/GuaranteesSection";
import FAQSection from "@/components/landing/FAQSection";
import FinalCTASection from "@/components/landing/FinalCTASection";

const LandingPage = () => {
  return (
    <div>
      <HeroSection />
      <HowItWorksSection />
      <TechnicalExcellenceSection />
      <AIRestorationSection />
      <StoriesSection />
      <TryNowSection />
      <GuaranteesSection />
      <FAQSection />
      <FinalCTASection />
    </div>
  );
};

export default LandingPage;
