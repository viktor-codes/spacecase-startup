import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import useEmblaCarousel from "embla-carousel-react";
import Section from "@/components/Section";
import { GlassCard } from "@/components/ui/glass-card";
import SectionHeading from "@/components/landing/SectionHeading";
import { cn } from "@/lib/utils";

const featureBullets = [
  {
    id: "raised-bezel",
    label: "Raised Bezel Screen Protection",
    description: "Thicker build for more protection, without looking bulkier.",
  },
  {
    id: "shock-absorption-tpu",
    label: "Shock Absorption with Black TPU Liner",
    description:
      "No more unexpected surprises, thanks to intelligent technology and robust engineering.",
  },
  {
    id: "ports-accessible",
    label: "All Ports Accessible",
    description:
      "Unlike mediocre phone cases, you can still access all ports — no compromise.",
  },
  {
    id: "no-fade-prints",
    label: "High-Quality, No-Fade Prints",
    description:
      "No worries about the print fading over time. The quality is so high, it'll look just as good next year as it does today.",
  },
  {
    id: "responsive-buttons",
    label: "Responsive and Protected Buttons",
    description:
      "Easily use your phone without any limitations while having the buttons protected. Nothing is standing in the way of comfortable usage.",
  },
  {
    id: "dual-layer-pc-tpu",
    label: "Dual Layer PC+TPU Design",
    description:
      "Offer your phone max protection with this double layer bodyguard. The outside has a hard PC cover, while on the inside the impact is absorbed by a soft TPU layer.",
  },
];

/* ─── Mobile carousel ─────────────────────────────────────────── */
const MobileCarousel = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [emblaRef, emblaApi] = useEmblaCarousel({
    align: "start",
    containScroll: "trimSnaps",
    dragFree: true,
  });

  useEffect(() => {
    if (!emblaApi) return;
    const onSelect = () => setActiveIndex(emblaApi.selectedScrollSnap());
    emblaApi.on("select", onSelect);
    emblaApi.on("reInit", onSelect);
    return () => {
      emblaApi.off("select", onSelect);
      emblaApi.off("reInit", onSelect);
    };
  }, [emblaApi]);

  const scrollTo = (index: number) => {
    setActiveIndex(index);
    emblaApi?.scrollTo(index);
  };

  return (
    <div className="flex flex-col gap-6 md:hidden">
      {/* Phone image */}
      <motion.img
        src="/excelence-2.png"
        alt="CosmicCase"
        className="mx-auto w-full max-w-sm"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.5 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      />

      {/* Carousel */}
      <div className="min-w-0">
        <div className="overflow-hidden" ref={emblaRef}>
          <div className="flex gap-3 pb-2">
            {featureBullets.map((f, index) => (
              <div
                key={f.id}
                className="min-w-0 shrink-0 grow-0 basis-[min(100%,22rem)] sm:basis-[85%]"
              >
                <GlassCard
                  className={cn(
                    "flex min-h-[16rem] flex-col p-4",
                    activeIndex === index &&
                      "ring-2 ring-brand-pink/45 ring-inset",
                  )}
                  onClick={() => scrollTo(index)}
                >
                  <p className="font-technical mb-2 shrink-0 text-[11px] tracking-[0.2em] text-brand-pink uppercase">
                    {f.label}
                  </p>
                  <p className="flex-1 text-sm leading-relaxed text-text-secondary">
                    {f.description}
                  </p>
                </GlassCard>
              </div>
            ))}
          </div>
        </div>

        {/* Dot indicators */}
        <div className="mt-3 flex items-center justify-center gap-2">
          {featureBullets.map((f, index) => (
            <button
              key={f.id}
              type="button"
              aria-label={`Go to ${f.label}`}
              className={cn(
                "h-1.5 rounded-full transition-all",
                activeIndex === index
                  ? "w-6 bg-brand-pink"
                  : "w-2 bg-white/30 hover:bg-white/50",
              )}
              onClick={() => scrollTo(index)}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

/* ─── Desktop two-column sticky layout ───────────────────────── */
const DesktopLayout = () => (
  <div className="hidden md:grid md:grid-cols-[minmax(0,0.7fr)_1fr] md:gap-10 lg:gap-16 xl:gap-20">
    {/* Left: sticky phone image */}
    <div className="flex items-start justify-center">
      <div className="sticky top-[20vh] w-full">
        <motion.img
          src="/excelence-2.png"
          alt="CosmicCase"
          className="w-full"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        />
      </div>
    </div>

    {/* Right: scrollable feature cards */}
    <div className="flex flex-col gap-5">
      {featureBullets.map((f) => (
        <GlassCard key={f.id} className="flex min-h-[9rem] flex-col p-5">
          <p className="font-technical mb-2 shrink-0 text-[11px] tracking-[0.2em] text-brand-pink uppercase">
            {f.label}
          </p>
          <p className="flex-1 text-sm leading-relaxed text-text-secondary">
            {f.description}
          </p>
        </GlassCard>
      ))}
    </div>
  </div>
);

/* ─── Root section ────────────────────────────────────────────── */
const TechnicalExcellenceSection = () => (
  <div id="case-anatomy" className="overflow-x-clip">
    <Section className="overflow-x-clip overflow-y-visible">
      <SectionHeading
        className="mb-12"
        kicker="Case highlights"
        title="Engineered for everyday."
      />
      <MobileCarousel />
      <DesktopLayout />
    </Section>
  </div>
);

export default TechnicalExcellenceSection;
