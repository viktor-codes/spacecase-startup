"use client";

import Image from "next/image";
import { Sparkles } from "lucide-react";
import { ReactCompareSlider, ReactCompareSliderImage } from "react-compare-slider";

import Section from "@/components/Section";

const COMPARISON_IMAGE = "/rosette-cone.jpg";

const AIRestorationSection = () => {
  return (
    <Section className="overflow-hidden">
      <div className="px-6 lg:px-8 mx-auto max-w-4xl text-center">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-text-secondary font-technical">
          AI restoration
        </p>
        <h2 className="mt-4 tracking-tight text-balance leading-tight! font-bold text-4xl md:text-5xl text-text-primary">
          From archive to artwork
        </h2>
        <p className="mt-4 text-base md:text-lg text-text-secondary max-w-2xl mx-auto">
          Many NASA images date back decades. Our neural network reconstructs
          every pixel to 300+ DPI — turning a compressed archive file into a
          print-ready masterpiece.
        </p>
      </div>

      <div className="mt-12 px-6 lg:px-8 mx-auto max-w-3xl">
        {/* Interactive slider comparison (react-compare-slider) */}
        <div className="relative aspect-video w-full overflow-hidden rounded-2xl border border-(--border-default) shadow-2xl bg-black">
          <ReactCompareSlider
            itemOne={
              <ReactCompareSliderImage
                src={COMPARISON_IMAGE}
                alt="Original NASA archive image"
                className="object-cover blur-[2px] brightness-75 saturate-50 contrast-75"
              />
            }
            itemTwo={
              <ReactCompareSliderImage
                src={COMPARISON_IMAGE}
                alt="AI-restored NASA image"
                className="object-cover"
              />
            }
            className="h-full w-full cursor-ew-resize"
            boundsPadding={0}
            position={50}
          />

          {/* Grain overlay for "old archive" side */}
          <div className="pointer-events-none absolute inset-y-0 left-0 w-1/2 bg-[url('/grain.png')] opacity-40 mix-blend-overlay" />

          {/* Labels */}
          <div className="pointer-events-none absolute left-4 top-4 z-[var(--z-top)] rounded-lg bg-black/60 px-3 py-1.5 backdrop-blur-sm">
            <p className="font-technical text-[10px] uppercase tracking-[0.2em] text-text-secondary">
              Original Archive
            </p>
          </div>
          <div className="pointer-events-none absolute right-4 top-4 z-[var(--z-top)] flex items-center gap-1.5 rounded-lg bg-white/15 px-3 py-1.5 backdrop-blur-sm">
            <Sparkles className="h-3 w-3 text-brand-pink" />
            <p className="font-technical text-[10px] uppercase tracking-[0.2em] text-text-primary">
              AI-Restored · 300+ DPI
            </p>
          </div>
        </div>

        <p className="mt-4 text-center font-technical text-xs text-text-tertiary">
          Drag the slider to compare
        </p>

        {/* Process steps */}
        <div className="mt-10 grid gap-4 sm:grid-cols-3">
          {[
            {
              step: "01",
              title: "Archive Retrieval",
              description:
                "We fetch the original NASA APOD image — some dating back to 1995, often compressed at web-resolution.",
            },
            {
              step: "02",
              title: "Neural Upscaling",
              description:
                "Our AI model reconstructs lost detail, sharpens edges, and restores color depth to 300+ DPI print resolution.",
            },
            {
              step: "03",
              title: "Print Calibration",
              description:
                "Color profiles are tuned for the ink and case material, ensuring deep blacks and vibrant nebula tones.",
            },
          ].map((item) => (
            <div key={item.step} className="text-center sm:text-left">
              <p className="font-technical text-[11px] uppercase tracking-[0.2em] text-brand-pink">
                {item.step}
              </p>
              <h3 className="mt-1 text-sm font-semibold text-text-primary">
                {item.title}
              </h3>
              <p className="mt-1.5 text-xs leading-relaxed text-text-tertiary">
                {item.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </Section>
  );
};

export default AIRestorationSection;
