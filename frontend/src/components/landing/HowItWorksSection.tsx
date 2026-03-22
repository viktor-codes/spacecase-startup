import {
  ArrowRight,
  CalendarHeart,
  Sparkles,
  Printer,
  Package,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";

import Section from "@/components/Section";
import Phone from "@/components/Phone";
import SectionHeading from "@/components/landing/SectionHeading";
import { buttonVariants } from "@/components/ui/button";

const steps = [
  {
    number: "01",
    icon: CalendarHeart,
    title: "Pick your date",
    description:
      "Enter a date that mattered. We pull NASA's Astronomy Picture of the Day from that day (or the closest match).",
  },
  {
    number: "02",
    icon: Sparkles,
    title: "AI enhances the image",
    description:
      "Our AI enhances detail for print-ready clarity—sharper edges and richer color.",
  },
  {
    number: "03",
    icon: Printer,
    title: "Printed edge-to-edge",
    description:
      "Edge-to-edge printing on a premium dual-layer Tough case for long-lasting color.",
  },
  {
    number: "04",
    icon: Package,
    title: "Shipped with tracking",
    description:
      "Typical production is 2-3 business days, then your SpaceCase ships with tracking.",
  },
];

const HowItWorksSection = () => {
  return (
    <Section
      className="scroll-mt-20"
      containerClassName="relative"
      as="section"
    >
      <div id="how-it-works" className="absolute -top-24" />

      <SectionHeading
        kicker="How it works"
        title={
          <>
            From date to SpaceCase{" "}
            <span className="bg-brand-subtle px-2 text-brand-pink">
              in 4 steps
            </span>
          </>
        }
      />

      <div className="mt-16 mx-auto max-w-6xl px-6 lg:px-8">
        <div className="grid gap-12 lg:grid-cols-[1fr_1.2fr] items-center">
          {/* Visual: source → case */}
          <div className="flex flex-col items-center gap-6 sm:flex-row sm:justify-center lg:flex-col">
            <div className="relative w-56 sm:w-48 lg:w-56 rounded-xl overflow-hidden shadow-lg ring-1 ring-(--border-default)">
              <Image
                src="/rosette-cone.jpg"
                alt="NASA Rosette Cone Nebula — original archive"
                width={639}
                height={1024}
                quality={75}
                className="object-cover w-full h-full"
              />
              <div className="absolute inset-x-0 bottom-0 bg-linear-to-t from-black/60 to-transparent px-3 py-2">
                <p className="font-technical text-[10px] uppercase tracking-[0.15em] text-white/80">
                  NASA APOD · Archive
                </p>
              </div>
            </div>

            <div className="text-text-tertiary text-2xl select-none hidden sm:block lg:rotate-90">
              →
            </div>

            <Phone className="w-48 lg:w-56" imgSrc="/rosette-cone.jpg" dark />
          </div>

          {/* Steps */}
          <div className="relative">
            <div className="absolute left-[19px] top-4 bottom-4 w-px bg-(--border-default) hidden sm:block" />
            <div className="space-y-8">
              {steps.map((step) => (
                <div key={step.number} className="relative flex gap-5">
                  <div className="relative z-(--z-top) flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-brand-subtle text-brand-pink">
                    <step.icon className="h-4 w-4" />
                  </div>
                  <div className="pt-1">
                    <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-text-tertiary">
                      Step {step.number}
                    </p>
                    <h3 className="mt-1 text-base font-semibold text-text-primary">
                      {step.title}
                    </h3>
                    <p className="mt-1.5 text-sm leading-relaxed text-text-secondary">
                      {step.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="mt-12 flex justify-center">
        <Link
          className={buttonVariants({
            variant: "space",
            size: "lg",
            className: "px-8",
          })}
          href="/configure/upload"
        >
          Get Started <ArrowRight className="h-4 w-4 ml-1.5" />
        </Link>
      </div>
    </Section>
  );
};

export default HowItWorksSection;
