import {
  Cpu,
  Fingerprint,
  Layers,
  Maximize,
  ScanEye,
  Shield,
} from "lucide-react";

import Section from "@/components/Section";
import { GlassCard } from "@/components/ui/glass-card";

const layers = [
  {
    label: "Fade-Resistant UV Ink",
    color: "bg-gradient-to-r from-violet-500 via-fuchsia-500 to-cyan-400",
    height: "h-3",
  },
  {
    label: "AI-Enhanced Print · 300+ DPI",
    color: "bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-800",
    height: "h-5",
  },
  {
    label: "Polycarbonate Outer Shell",
    color: "bg-gradient-to-r from-slate-300 via-slate-200 to-slate-300",
    height: "h-8",
  },
  {
    label: "TPU Inner Liner",
    color: "bg-gradient-to-r from-slate-500 via-slate-400 to-slate-500",
    height: "h-6",
  },
];

const specs = [
  {
    icon: Cpu,
    title: "AI-Enhanced Detail",
    description:
      "Every NASA archive image is reconstructed by a neural network to 300+ DPI — sharp enough for edge-to-edge print.",
  },
  {
    icon: Layers,
    title: "Dual-Layer Protection",
    description:
      "Impact-resistant polycarbonate outer shell fused with a flexible TPU inner liner. Built for daily drops and bumps.",
  },
  {
    icon: Maximize,
    title: "3D Full Wrap Print",
    description:
      "The image extends to every edge and corner — no white borders, no blank spots. The cosmos covers every surface.",
  },
  {
    icon: Fingerprint,
    title: "Fade-Resistant Ink",
    description:
      "UV-cured ink technology preserves deep blacks and vibrant nebulas. No peeling, no yellowing — even after months of use.",
  },
  {
    icon: ScanEye,
    title: "Optical Precision",
    description:
      "Raised camera bezel protection and precise port cutouts engineered to sub-millimeter accuracy for every device model.",
  },
  {
    icon: Shield,
    title: "Reinforced Corners",
    description:
      "Internal shock-absorbing structure at every corner distributes impact energy away from your device.",
  },
];

const TechnicalExcellenceSection = () => {
  return (
    <Section className="overflow-x-hidden">
      <div className="px-6 lg:px-8 mx-auto max-w-4xl text-center">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-text-secondary font-technical">
          Anatomy of a SpaceCase
        </p>
        <h2 className="mt-4 tracking-tight text-balance leading-tight! font-bold text-4xl md:text-5xl text-text-primary">
          Engineered for the cosmos. Built for your pocket.
        </h2>
        <p className="mt-4 text-base md:text-lg text-text-secondary max-w-2xl mx-auto">
          Every SpaceCase is a dual-layer Tough case with AI-restored NASA
          imagery printed at 300+ DPI. Here&apos;s what&apos;s inside.
        </p>
      </div>

      <div className="mt-16 px-6 lg:px-8 mx-auto max-w-6xl grid gap-12 lg:grid-cols-[1fr_1.4fr] items-center">
        {/* Exploded view */}
        <div className="flex justify-center">
          <div
            className="relative w-56 sm:w-64"
            style={{ perspective: "600px" }}
          >
            <div className="flex flex-col items-center gap-5">
              {layers.map((layer, i) => (
                <div key={layer.label} className="relative w-full group">
                  <div
                    className={`${layer.color} ${layer.height} w-full rounded-2xl shadow-lg ring-1 ring-(--border-default) transition-transform duration-300 hover:scale-105`}
                    style={{
                      transform: `rotateX(8deg) rotateY(-4deg) translateZ(${(layers.length - i) * 12}px)`,
                    }}
                  />
                  <div className="absolute left-full top-1/2 -translate-y-1/2 ml-4 flex items-center gap-2 whitespace-nowrap">
                    <div className="h-px w-6 bg-(--border-default)" />
                    <span className="font-technical text-[10px] uppercase tracking-[0.15em] text-text-secondary">
                      {layer.label}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Specs grid */}
        <div className="grid gap-5 sm:grid-cols-2">
          {specs.map((spec) => (
            <GlassCard
              key={spec.title}
              variant="interactive"
              className="p-5 text-left"
            >
              <div className="flex items-center gap-3 mb-3">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-brand-subtle">
                  <spec.icon className="h-4 w-4 text-brand-pink" />
                </div>
                <h3 className="text-sm font-semibold text-text-primary">
                  {spec.title}
                </h3>
              </div>
              <p className="text-xs leading-relaxed text-text-secondary">
                {spec.description}
              </p>
            </GlassCard>
          ))}
        </div>
      </div>
    </Section>
  );
};

export default TechnicalExcellenceSection;
