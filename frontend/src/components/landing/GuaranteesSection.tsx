import { Clock, Truck, ShieldCheck, Lock } from "lucide-react";

import Section from "@/components/Section";
import { GlassCard } from "@/components/ui/glass-card";
import SectionHeading from "@/components/landing/SectionHeading";

const guarantees = [
  {
    icon: Clock,
    title: "Clear production timeline",
    description:
      "We start working on your CosmicCase as soon as you place the order. Typical production time is 3–5 business days before your case ships out.",
  },
  {
    icon: Truck,
    title: "Tracked delivery",
    description:
      "Your order is shipped with tracking, so you always know where your cosmic case is and when it is about to arrive.",
  },
  {
    icon: ShieldCheck,
    title: "Quality guarantee",
    description:
      "If your case arrives damaged, misprinted, or with a defect, we will reprint it or offer a refund. No arguing over tiny details.",
  },
  {
    icon: Lock,
    title: "Secure payments",
    description:
      "Payments are processed via trusted providers, so your card details are protected and never stored on our servers.",
  },
];

const deliveryNote =
  "Delivery times depend on your region and chosen shipping method. You will see estimated dates at checkout before you pay.";

const GuaranteesSection = () => {
  return (
    <Section>
      <SectionHeading
        kicker="Guarantees & delivery"
        title="Safe purchase, predictable delivery"
        subtitle={
          <>
            We want your CosmicCase to feel exciting, not stressful. That is why
            we keep our production, shipping, and guarantees as transparent as
            possible.
          </>
        }
        subtitleClassName="max-w-2xl mx-auto"
      />

      <div className="mx-auto mt-12 grid max-w-6xl gap-8 px-6 md:grid-cols-2 lg:px-8">
        {guarantees.map((item) => (
          <GlassCard
            key={item.title}
            variant="interactive"
            className="p-6 text-left"
          >
            <div className="mb-3 flex items-center gap-3">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-brand-subtle">
                <item.icon className="h-4 w-4 text-brand-pink" />
              </div>
              <h3 className="text-lg font-semibold text-text-primary">
                {item.title}
              </h3>
            </div>
            <p className="mt-1 text-sm text-text-secondary">
              {item.description}
            </p>
          </GlassCard>
        ))}
      </div>

      <p className="mx-auto mt-10 max-w-3xl px-6 text-center text-xs text-text-tertiary lg:px-8">
        {deliveryNote}
      </p>
    </Section>
  );
};

export default GuaranteesSection;
