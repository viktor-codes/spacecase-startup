import { Clock, Truck, ShieldCheck, Lock } from "lucide-react";

import Section from "@/components/Section";

const guarantees = [
  {
    icon: Clock,
    title: "Clear production timeline",
    description:
      "We start working on your SpaceCase as soon as you place the order. Typical production time is 3–5 business days before your case ships out.",
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
    <Section className="relative bg-slate-950">
      <div className="pointer-events-none absolute inset-0 bg-[url('/grain.png')] bg-repeat opacity-[0.03] mix-blend-soft-light" />

      <div className="px-6 lg:px-8 mx-auto max-w-4xl text-center">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-400 font-technical">
          Guarantees & delivery
        </p>
        <h2 className="mt-4 tracking-tight text-balance leading-tight! font-bold text-4xl md:text-5xl text-white">
          Safe purchase, predictable delivery
        </h2>
        <p className="mt-4 text-base md:text-lg text-slate-400 max-w-2xl mx-auto">
          We want your SpaceCase to feel exciting, not stressful. That is why we
          keep our production, shipping, and guarantees as transparent as
          possible.
        </p>
      </div>

      <div className="mt-12 px-6 lg:px-8 mx-auto max-w-6xl grid gap-8 md:grid-cols-2">
        {guarantees.map((item) => (
          <div
            key={item.title}
            className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-sm text-left"
          >
            <div className="flex items-center gap-3 mb-3">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-brand/15">
                <item.icon className="h-4 w-4 text-brand" />
              </div>
              <h3 className="text-lg font-semibold text-white">
                {item.title}
              </h3>
            </div>
            <p className="mt-1 text-sm text-slate-400">{item.description}</p>
          </div>
        ))}
      </div>

      <p className="mt-10 px-6 lg:px-8 mx-auto max-w-3xl text-center text-xs text-slate-500">
        {deliveryNote}
      </p>
    </Section>
  );
};

export default GuaranteesSection;

