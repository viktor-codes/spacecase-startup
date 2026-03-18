import { useState } from "react";
import { motion } from "framer-motion";
import Section from "@/components/Section";
import { GlassCard } from "@/components/ui/glass-card";
import SectionHeading from "@/components/landing/SectionHeading";

const featureBullets = [
  {
    id: "durability",
    label: "Long-lasting durability",
    description: "Dual-layer Tough construction absorbs cosmic-level impacts.",
    position: { top: "14%", left: "28%" },
  },
  {
    id: "finish",
    label: "Polished finish",
    description: "Premium glossy coating with glass-like reflections.",
    position: { top: "40%", left: "18%" },
  },
  {
    id: "prints",
    label: "Vibrant non-fade prints",
    description:
      "UV-cured pigments keep every nebula and galaxy sharp for years.",
    position: { top: "68%", left: "26%" },
  },
  {
    id: "protection",
    label: "Dual-layer protection",
    description: "Rigid polycarbonate shell + TPU inner liner.",
    position: { top: "18%", left: "72%" },
  },
  {
    id: "materials",
    label: "Top-grade materials",
    description: "Aerospace-inspired polymers selected for impact resistance.",
    position: { top: "44%", left: "82%" },
  },
  {
    id: "weight",
    label: "Lightweight strength",
    description:
      "Slim profile keeps pocket weight minimal without losing protection.",
    position: { top: "70%", left: "74%" },
  },
];

const TechnicalExcellenceSection = () => {
  const [activeId, setActiveId] = useState<string>(featureBullets[0].id);
  const activeFeature =
    featureBullets.find((f) => f.id === activeId) ?? featureBullets[0];

  return (
    <Section className="overflow-visible">
      <SectionHeading
        className="mb-12"
        kicker="Anatomy of a SpaceCase"
        title="Engineered for orbit."
      />

      {/* Мобильный лэйаут: чехол + свайп карточек */}
      <div className="mx-auto w-full max-w-md flex flex-col gap-6 md:hidden">
        <div className="relative mx-auto w-96">
          <motion.img
            src="/excelence-2.png"
            alt="SpaceCase"
            className="w-full"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.5 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          />
        </div>

        <div className="flex gap-4 overflow-x-auto snap-x snap-mandatory pb-2 -mx-6 px-6">
          {featureBullets.map((f) => (
            <GlassCard
              key={f.id}
              className="min-w-[82%] snap-center p-4 shrink-0"
              onClick={() => setActiveId(f.id)}
            >
              <p className="text-[11px] font-technical uppercase tracking-[0.2em] text-brand-pink mb-2">
                {f.label}
              </p>
              <p className="text-sm leading-relaxed text-text-secondary">
                {f.description}
              </p>
            </GlassCard>
          ))}
        </div>
      </div>

      {/* Планшет и десктоп */}
      <div
        className="hidden md:grid mx-auto w-full max-w-6xl
             md:grid-cols-[minmax(0,0.8fr)_minmax(0,1.4fr)]
             lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1.6fr)_minmax(0,0.8fr)]
             gap-8 lg:gap-12 items-start"
      >
        {/* Левая колонка с фичами (только десктоп) */}
        <div className="hidden lg:flex flex-col gap-4">
          {featureBullets.slice(0, 3).map((f) => (
            <GlassCard
              key={f.id}
              className="p-4 cursor-pointer transition-transform duration-200 hover:-translate-y-1"
              onClick={() => setActiveId(f.id)}
            >
              <p className="text-[11px] font-technical uppercase tracking-[0.2em] text-brand-pink mb-2">
                {f.label}
              </p>
              <p className="text-sm leading-relaxed text-text-secondary">
                {f.description}
              </p>
            </GlassCard>
          ))}
        </div>

        {/* Центральный чехол с точками (планшет и десктоп) */}
        <div className="relative flex justify-center">
          <div className="relative w-full">
            <motion.img
              src="/excelence-2.png"
              alt="SpaceCase"
              className="w-full"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.5 }}
              transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            />
          </div>
        </div>

        {/* Правая колонка: на планшете — весь стек фич, на десктопе — вторая половина */}
        <div className="flex flex-col gap-4">
          {/* Планшеты (md–lg): показываем все фичи одной колонкой */}
          <div className="flex flex-col gap-4 lg:hidden">
            {featureBullets.map((f) => (
              <GlassCard
                key={f.id}
                className="p-4 cursor-pointer transition-transform duration-200 hover:-translate-y-1"
                onClick={() => setActiveId(f.id)}
              >
                <p className="text-[11px] font-technical uppercase tracking-[0.2em] text-brand-pink mb-2">
                  {f.label}
                </p>
                <p className="text-sm leading-relaxed text-text-secondary">
                  {f.description}
                </p>
              </GlassCard>
            ))}
          </div>

          {/* Десктоп (lg+): во второй колонке только вторая половина фич */}
          <div className="hidden lg:flex flex-col gap-4">
            {featureBullets.slice(3).map((f) => (
              <GlassCard
                key={f.id}
                className="p-4 cursor-pointer transition-transform duration-200 hover:-translate-y-1"
                onClick={() => setActiveId(f.id)}
              >
                <p className="text-[11px] font-technical uppercase tracking-[0.2em] text-brand-pink mb-2">
                  {f.label}
                </p>
                <p className="text-sm leading-relaxed text-text-secondary">
                  {f.description}
                </p>
              </GlassCard>
            ))}
          </div>

          {/* Активная фича как краткое резюме */}
          <GlassCard className="mt-2 p-4">
            <p className="text-[11px] font-technical uppercase tracking-[0.2em] text-brand-pink mb-2">
              {activeFeature.label}
            </p>
            <p className="text-sm leading-relaxed text-text-secondary">
              {activeFeature.description}
            </p>
          </GlassCard>
        </div>
      </div>
    </Section>
  );
};

export default TechnicalExcellenceSection;
