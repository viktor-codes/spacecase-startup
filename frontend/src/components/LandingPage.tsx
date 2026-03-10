"use client";

import HeroSection from "@/components/landing/HeroSection";
import HowItWorksSection from "@/components/landing/HowItWorksSection";
import TestimonialsSection from "@/components/landing/TestimonialsSection";
import StoriesSection from "@/components/landing/StoriesSection";
import TryNowSection from "@/components/landing/TryNowSection";
import QualitySection from "@/components/landing/QualitySection";
import GuaranteesSection from "@/components/landing/GuaranteesSection";
import FAQSection from "@/components/landing/FAQSection";
import FinalCTASection from "@/components/landing/FinalCTASection";

const LandingPage = () => {
  return (
    <div className="grain">
      <HeroSection />
      <StoriesSection />
      <TryNowSection />
      <HowItWorksSection />
      <QualitySection />
      <TestimonialsSection />
      <GuaranteesSection />
      <FAQSection />
      <FinalCTASection />
    </div>
  );
};

export default LandingPage;
