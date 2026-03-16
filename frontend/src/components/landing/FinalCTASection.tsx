import Link from "next/link";
import { ArrowRight, Check } from "lucide-react";

import Section from "@/components/Section";
import { buttonVariants } from "@/components/ui/button";

const included = [
  "NASA APOD image for your exact date",
  "AI restoration to 300+ DPI",
  "Dual-layer Tough case (PC + TPU)",
  "Full-wrap edge-to-edge print",
  "Fade-resistant UV ink",
  "Tracked delivery included",
];

const FinalCTASection = () => {
  return (
    <Section className="overflow-hidden">
      <div className="px-6 lg:px-8 mx-auto max-w-3xl text-center">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-text-secondary font-technical">
          Your moment, your universe
        </p>
        <h2 className="mt-4 tracking-tight text-balance leading-tight! font-bold text-4xl md:text-5xl text-text-primary">
          Your sky is waiting. Don&apos;t let it fade.
        </h2>
        <p className="mt-4 text-base md:text-lg text-text-secondary">
          Every day that passes, another piece of the cosmos is archived by
          NASA. Pick the date that matters most — and carry the sky that
          witnessed it.
        </p>

        <div className="mt-10 inline-flex flex-col items-center gap-1">
          <p className="font-technical text-sm uppercase tracking-[0.2em] text-text-tertiary">
            Starting from
          </p>
          <p className="text-5xl font-bold text-text-primary">&euro;39</p>
          <p className="text-sm text-text-tertiary">Express from &euro;49</p>
        </div>

        <div className="mx-auto mt-8 max-w-xs space-y-2">
          {included.map((item) => (
            <div key={item} className="flex items-center gap-2.5">
              <Check className="h-3.5 w-3.5 shrink-0 text-brand-pink" />
              <span className="text-left font-technical text-xs text-text-secondary">
                {item}
              </span>
            </div>
          ))}
        </div>

        <div className="mt-10 flex flex-col items-center gap-3">
          <Link
            href="/configure/upload"
            className={buttonVariants({
              size: "lg",
              variant: "space",
              className: "px-8",
            })}
          >
            Discover My Sky
            <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
          <p className="text-xs text-text-tertiary">
            It takes less than 2 minutes. All you need is a date.
          </p>
        </div>
      </div>
    </Section>
  );
};

export default FinalCTASection;
