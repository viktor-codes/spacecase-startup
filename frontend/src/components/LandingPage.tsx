"use client";

import HeroSection from "@/components/landing/HeroSection";
import HowItWorksSection from "@/components/landing/HowItWorksSection";
import TechnicalExcellenceSection from "@/components/landing/TechnicalExcellenceSection";
import StoriesSection from "@/components/landing/StoriesSection";
import TryNowSection from "@/components/landing/TryNowSection";
import TestimonialsSection from "@/components/landing/TestimonialsSection";
import GuaranteesSection from "@/components/landing/GuaranteesSection";
import FAQSection from "@/components/landing/FAQSection";
import FinalCTASection from "@/components/landing/FinalCTASection";

const LandingPage = () => {
  return (
    <div className="grain-dark">
      <HeroSection />
      <HowItWorksSection />
      <TechnicalExcellenceSection />
      <StoriesSection />
      <TryNowSection />
      <TestimonialsSection />
      <GuaranteesSection />
      <FAQSection />
      <FinalCTASection />
    </div>
  );
};

export default LandingPage;
