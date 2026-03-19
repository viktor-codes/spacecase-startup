"use client";
import { useState } from "react";
import {
  ReactCompareSlider,
  ReactCompareSliderImage,
} from "react-compare-slider";

import Section from "@/components/Section";
import { GlassCard } from "@/components/ui/glass-card";
import SectionHeading from "@/components/landing/SectionHeading";

const ORIGINAL_IMAGE = "/before.png";
const RESTORED_IMAGE = "/after.jpg";

const AIRestorationSection = () => {
  const [position, setPosition] = useState(50);
  const [isInteracting, setIsInteracting] = useState(false);

  return (
    <div id="restoration">
      <Section className="overflow-hidden">
        <SectionHeading
          kicker="AI restoration"
          title="From archive to artwork"
          subtitle={
            <>
              Many NASA images date back decades. Our AI-enhancement upgrades
              detail for print-ready clarity.
            </>
          }
          subtitleClassName="max-w-2xl mx-auto"
        />

        <div className="mt-12 px-6 lg:px-8 mx-auto max-w-3xl">
          {/* Interactive slider comparison (react-compare-slider) */}
          <div className="group relative aspect-video w-full overflow-hidden rounded-2xl border border-(--border-default) shadow-2xl bg-black">
            <ReactCompareSlider
              itemOne={
                <ReactCompareSliderImage
                  src={ORIGINAL_IMAGE}
                  alt="Original NASA archive image"
                  className="object-cover"
                />
              }
              itemTwo={
                <ReactCompareSliderImage
                  src={RESTORED_IMAGE}
                  alt="AI-restored NASA image"
                  className="object-cover"
                />
              }
              className="h-full w-full cursor-ew-resize"
              boundsPadding={0}
              position={position}
              onPositionChange={setPosition}
              onPointerDown={() => setIsInteracting(true)}
              onPointerUp={() => setIsInteracting(false)}
              onPointerLeave={() => setIsInteracting(false)}
              handle={
                <div
                  className={`relative flex h-10 w-10 items-center justify-center rounded-full border border-white/70 bg-surface-overlay/90 backdrop-blur-md shadow-lg transition-all duration-200 group-hover:w-32 ${
                    isInteracting ? "w-32" : ""
                  }`}
                >
                  {/* Arrows (always visible) */}
                  <div className="pointer-events-none absolute inset-0 flex items-center justify-center gap-1 text-white">
                    <svg
                      width="14"
                      height="14"
                      viewBox="0 0 16 16"
                      fill="none"
                      className="text-white"
                    >
                      <path
                        d="M6 3L3 8L6 13"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                    <svg
                      width="14"
                      height="14"
                      viewBox="0 0 16 16"
                      fill="none"
                      className="text-white"
                    >
                      <path
                        d="M10 3L13 8L10 13"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </div>

                  {/* Labels (hover/touch state, appear around arrows) */}
                  <div
                    className={`pointer-events-none flex w-full items-center justify-between px-2 text-[8px] font-technical uppercase tracking-[0.2em] text-white/80 opacity-0 group-hover:opacity-100 ${
                      isInteracting ? "opacity-100" : ""
                    }`}
                  >
                    <span className="pe-2">Before</span>
                    <span>After</span>
                  </div>
                </div>
              }
            />

            {/* Vertical divider line following handle */}
            <div
              className="pointer-events-none absolute inset-y-0 z-10 w-px bg-white/80 shadow-[0_0_12px_rgba(255,255,255,0.45)]"
              style={{ left: `${position}%`, transform: "translateX(-50%)" }}
            />
          </div>

          <p className="mt-4 text-center font-technical text-xs text-text-tertiary uppercase">
            Drag to compare
          </p>

          {/* Process steps */}
          <div className="mt-10 grid gap-4 sm:grid-cols-3">
            {[
              {
                step: "01",
                title: "NASA input",
                description:
                  "We fetch NASA’s Astronomy Picture of the Day image for your selected date (archive resolution).",
              },
              {
                step: "02",
                title: "AI enhancement",
                description:
                  "Our AI model reconstructs lost detail, sharpens edges, and restores color depth to 300+ DPI print resolution.",
              },
              {
                step: "03",
                title: "Chromatic Mastering",
                description:
                  "Color profiles are tuned for the ink and case material, ensuring deep blacks and vibrant nebula tones.",
              },
            ].map((item) => (
              <GlassCard
                key={item.step}
                variant="interactive"
                className="p-4 text-center sm:text-left"
              >
                <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-brand-pink">
                  {item.step}
                </p>
                <h3 className="mt-2 text-sm font-semibold text-text-primary">
                  {item.title}
                </h3>
                <p className="mt-2 text-xs leading-relaxed text-text-tertiary">
                  {item.description}
                </p>
              </GlassCard>
            ))}
          </div>
        </div>
      </Section>
    </div>
  );
};

export default AIRestorationSection;
