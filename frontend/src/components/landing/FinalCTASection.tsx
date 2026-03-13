import Link from "next/link";

import Section from "@/components/Section";
import { buttonVariants } from "@/components/ui/button";

const FinalCTASection = () => {
  return (
    <Section>
      <div className="px-6 lg:px-8 mx-auto max-w-3xl text-center">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-500">
          Your moment, your universe
        </p>
        <h2 className="mt-4 tracking-tight text-balance !leading-tight font-bold text-4xl md:text-5xl text-gray-900">
          Your sky is waiting. Don&apos;t let it fade.
        </h2>
        <p className="mt-4 text-base md:text-lg text-slate-600">
          Every day that passes, another piece of the cosmos is archived by
          NASA. Pick the date that matters most — and carry the sky that
          witnessed it.
        </p>

        <div className="mt-8 flex flex-col items-center gap-3">
          <Link
            href="/configure/upload"
            className={buttonVariants({
              size: "lg",
              className: "px-8",
            })}
          >
            Discover My Sky
          </Link>
          <p className="text-xs text-slate-500">
            It takes less than 2 minutes. All you need is a date.
          </p>
        </div>
      </div>
    </Section>
  );
};

export default FinalCTASection;

