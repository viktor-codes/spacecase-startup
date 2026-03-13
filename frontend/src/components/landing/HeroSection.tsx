import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Star } from "lucide-react";

import Section from "@/components/Section";
import FloatingCase from "@/components/FloatingCase";
import { buttonVariants } from "@/components/ui/button";

const features = [
  "NASA APOD — curated since 1995",
  "AI-restored to 300+ DPI",
  "Dual-layer Tough case",
];

const HeroSection = () => {
  return (
    <Section containerClassName="lg:grid lg:grid-cols-3 lg:gap-x-0 xl:gap-x-8 mt-0 lg:mt-20">
      <div className="col-span-2 px-6 lg:px-0 lg:pt-4">
        <div className="relative mx-auto text-center lg:text-left flex flex-col items-center lg:items-start">
          <h1 className="relative w-fit tracking-tight text-balance mt-16 font-bold leading-[1.1]! text-gray-900 text-5xl md:text-6xl lg:text-7xl xl:text-8xl">
            The sky remembers.{" "}
            <span className="bg-brand px-2 text-brand-foreground">
              Carry it.
            </span>
          </h1>

          <p className="mt-8 text-lg lg:text-xl lg:pr-10 max-w-prose text-center lg:text-left text-balance text-slate-600">
            Pick a date that changed your world. We find NASA&apos;s Astronomy
            Picture of the Day from that exact moment, restore it with AI to
            print-grade resolution, and place it on a dual-layer phone case
            you&apos;ll never want to put down.
          </p>

          <div className="mt-6 flex flex-wrap items-center justify-center lg:justify-start gap-2">
            {features.map((f) => (
              <span
                key={f}
                className="inline-flex items-center rounded-full bg-brand/5 px-3.5 py-1.5 text-xs font-medium text-brand font-technical tracking-wide"
              >
                {f}
              </span>
            ))}
          </div>

          <div className="mt-10 sm:mt-12 flex flex-col sm:flex-row items-center sm:items-start gap-4">
            <Link
              href="/configure/upload"
              className={buttonVariants({
                variant: "space",
                size: "lg",
                className: "px-8 py-3 text-base",
              })}
            >
              Discover My Sky
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
            <a
              href="#how-it-works"
              className="text-sm font-medium text-slate-500 hover:text-slate-900 transition-colors py-3"
            >
              See how it works
            </a>
          </div>

          <div className="mt-8 flex items-center gap-3 text-sm text-slate-500">
            <div className="flex -space-x-2.5">
              {[1, 5, 4, 3, 2].map((n) => (
                <Image
                  key={n}
                  src={`/avatar-${n}.png`}
                  alt="customer"
                  width={28}
                  height={28}
                  className="inline-block h-7 w-7 rounded-full ring-2 ring-white"
                />
              ))}
            </div>
            <div className="flex items-center gap-1.5">
              <div className="flex gap-0.5">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    className="h-3 w-3 text-yellow-400 fill-yellow-400"
                  />
                ))}
              </div>
              <span className="text-xs">
                <span className="font-semibold text-slate-700">1,250+</span>{" "}
                happy customers
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="col-span-full lg:col-span-1 w-full flex justify-center px-8 sm:px-16 md:px-0 mt-32 lg:mx-0 lg:mt-20 h-fit">
        <div className="relative md:max-w-xl">
          <FloatingCase imgSrc="/nebula.png" />
        </div>
      </div>
    </Section>
  );
};

export default HeroSection;
