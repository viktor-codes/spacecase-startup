"use client";

import { useCallback, useRef, useState } from "react";
import Image from "next/image";
import { Sparkles } from "lucide-react";

import Section from "@/components/Section";

const COMPARISON_IMAGE = "/rosette-cone.jpg";

const AIRestorationSection = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [sliderPosition, setSliderPosition] = useState(50);
  const [isDragging, setIsDragging] = useState(false);

  const updatePosition = useCallback(
    (clientX: number) => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const x = Math.max(0, Math.min(clientX - rect.left, rect.width));
      setSliderPosition((x / rect.width) * 100);
    },
    [],
  );

  const handlePointerDown = useCallback(
    (e: React.PointerEvent) => {
      setIsDragging(true);
      updatePosition(e.clientX);
      (e.target as HTMLElement).setPointerCapture(e.pointerId);
    },
    [updatePosition],
  );

  const handlePointerMove = useCallback(
    (e: React.PointerEvent) => {
      if (!isDragging) return;
      updatePosition(e.clientX);
    },
    [isDragging, updatePosition],
  );

  const handlePointerUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  return (
    <Section className="relative bg-slate-950 overflow-hidden">
      <div className="pointer-events-none absolute inset-0 bg-[url('/grain.png')] bg-repeat opacity-[0.03] mix-blend-soft-light" />
      <div className="px-6 lg:px-8 mx-auto max-w-4xl text-center">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-400 font-technical">
          AI restoration
        </p>
        <h2 className="mt-4 tracking-tight text-balance leading-tight! font-bold text-4xl md:text-5xl text-white">
          From archive to artwork
        </h2>
        <p className="mt-4 text-base md:text-lg text-slate-400 max-w-2xl mx-auto">
          Many NASA images date back decades. Our neural network reconstructs
          every pixel to 300+ DPI — turning a compressed archive file into a
          print-ready masterpiece.
        </p>
      </div>

      <div className="mt-12 px-6 lg:px-8 mx-auto max-w-3xl">
        {/* Interactive slider comparison */}
        <div
          ref={containerRef}
          className="relative aspect-video w-full cursor-ew-resize select-none overflow-hidden rounded-2xl border border-white/10 shadow-2xl"
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
        >
          {/* After (AI-Restored) — full layer behind */}
          <Image
            src={COMPARISON_IMAGE}
            alt="AI-restored NASA image"
            fill
            sizes="(min-width: 1024px) 768px, 100vw"
            quality={75}
            className="object-cover"
            draggable={false}
          />

          {/* Before (Original Archive) — clipped layer on top */}
          <div
            className="absolute inset-0 overflow-hidden"
            style={{ width: `${sliderPosition}%` }}
          >
            <Image
              src={COMPARISON_IMAGE}
              alt="Original NASA archive image"
              fill
              sizes="(min-width: 1024px) 768px, 100vw"
              quality={75}
              className="object-cover blur-[2px] brightness-75 saturate-50 contrast-75"
              style={{ width: containerRef.current?.offsetWidth ?? "100%" }}
              draggable={false}
            />
            {/* Noise/grain overlay for "old archive" feel */}
            <div className="absolute inset-0 bg-[url('/grain.png')] opacity-40 mix-blend-overlay" />
          </div>

          {/* Slider line */}
          <div
            className="absolute top-0 bottom-0 z-10 w-0.5 bg-white shadow-[0_0_12px_rgba(255,255,255,0.4)]"
            style={{ left: `${sliderPosition}%` }}
          >
            {/* Slider handle */}
            <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 flex h-10 w-10 items-center justify-center rounded-full border-2 border-white bg-slate-900/80 backdrop-blur-sm shadow-lg">
              <svg
                width="16"
                height="16"
                viewBox="0 0 16 16"
                fill="none"
                className="text-white"
              >
                <path
                  d="M5 3L2 8L5 13M11 3L14 8L11 13"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
          </div>

          {/* Labels */}
          <div className="absolute left-4 top-4 z-10 rounded-lg bg-black/60 px-3 py-1.5 backdrop-blur-sm">
            <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-slate-300">
              Original Archive
            </p>
          </div>
          <div className="absolute right-4 top-4 z-10 flex items-center gap-1.5 rounded-lg bg-white/15 px-3 py-1.5 backdrop-blur-sm">
            <Sparkles className="h-3 w-3 text-violet-300" />
            <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-white">
              AI-Restored · 300+ DPI
            </p>
          </div>
        </div>

        <p className="mt-4 text-center font-mono text-xs text-slate-500">
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
              <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-violet-400">
                {item.step}
              </p>
              <h3 className="mt-1 text-sm font-semibold text-white">
                {item.title}
              </h3>
              <p className="mt-1.5 text-xs leading-relaxed text-slate-500">
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
