import Section from "@/components/Section";

const features = [
  {
    title: "Everyday protection you can trust",
    description:
      "Reinforced corners, raised bezels around the screen and camera, and a snug fit help protect your phone from daily drops and bumps.",
  },
  {
    title: "Prints that don’t fade away",
    description:
      "High-quality printing keeps NASA imagery crisp and vibrant. The design is resistant to scratching, peeling, and everyday wear.",
  },
  {
    title: "Made to feel good in hand",
    description:
      "Smooth edges, comfortable grip, and precise cutouts for buttons and ports so your case looks special but still feels familiar.",
  },
  {
    title: "Built for your device",
    description:
      "We support popular iPhone models (and more coming soon), so your cosmic case is tailored to your exact device.",
  },
];

const QualitySection = () => {
  return (
    <Section>
      <div className="px-6 lg:px-8 mx-auto max-w-4xl text-center">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-500">
          Not just pretty
        </p>
        <h2 className="mt-4 tracking-tight text-balance !leading-tight font-bold text-4xl md:text-5xl text-gray-900">
          A cosmic story on a case that actually protects
        </h2>
        <p className="mt-4 text-base md:text-lg text-slate-600 max-w-2xl mx-auto">
          SpaceCase is designed to be both a meaningful keepsake and a reliable
          everyday case, so you never have to choose between emotions and
          practicality.
        </p>
      </div>

      <div className="mt-12 px-6 lg:px-8 mx-auto max-w-6xl grid gap-8 md:grid-cols-2">
        {features.map((feature) => (
          <div
            key={feature.title}
            className="rounded-2xl border border-slate-200 bg-white/60 p-6 shadow-sm backdrop-blur-sm text-left"
          >
            <h3 className="text-lg font-semibold text-slate-900">
              {feature.title}
            </h3>
            <p className="mt-3 text-sm text-slate-600">
              {feature.description}
            </p>
          </div>
        ))}
      </div>
    </Section>
  );
};

export default QualitySection;

