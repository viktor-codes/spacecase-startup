import Section from "@/components/Section";

const faqs = [
  {
    question: "Where do the images come from?",
    answer:
      "We use NASA’s official Astronomy Picture of the Day (APOD) archive. For your chosen date, we fetch the image that was published on or closest to that day.",
  },
  {
    question: "What if the image for my date is too dark or not very pretty?",
    answer:
      "If the original APOD is very dark or technical, we can suggest nearby dates with more visually striking imagery while still keeping the meaning of your moment.",
  },
  {
    question: "Can I add text to my case?",
    answer:
      "Yes. You can add a short caption like a date, name, or phrase. We’ll place it so it complements the NASA imagery rather than covering it.",
  },
  {
    question: "Which phone models do you support?",
    answer:
      "We currently support popular iPhone models, with more devices coming soon. You’ll see the full list of supported models when you configure your SpaceCase.",
  },
  {
    question: "What happens if the case doesn’t fit or arrives damaged?",
    answer:
      "If your case arrives damaged, misprinted, or not as described, reach out to us. We will offer a reprint or a refund according to our guarantee policy.",
  },
  {
    question: "How long will it take to receive my order?",
    answer:
      "Production typically takes X–Y business days. Shipping times depend on your region and the method you select at checkout, where you’ll also see estimated delivery dates.",
  },
];

const FAQSection = () => {
  return (
    <Section className="py-20">
      <div className="px-6 lg:px-8 mx-auto max-w-4xl text-center">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-500">
          FAQ
        </p>
        <h2 className="mt-4 tracking-tight text-balance !leading-tight font-bold text-4xl md:text-5xl text-gray-900">
          Answers before you launch your SpaceCase
        </h2>
        <p className="mt-4 text-base md:text-lg text-slate-600 max-w-2xl mx-auto">
          If you are wondering about how we use NASA imagery, shipping, or
          customization, you will probably find your answer below.
        </p>
      </div>

      <div className="mt-12 px-6 lg:px-8 mx-auto max-w-4xl space-y-6">
        {faqs.map((item) => (
          <div
            key={item.question}
            className="rounded-2xl border border-slate-200 bg-white/60 p-5 shadow-sm backdrop-blur-sm text-left"
          >
            <h3 className="text-base md:text-lg font-semibold text-slate-900">
              {item.question}
            </h3>
            <p className="mt-2 text-sm md:text-base text-slate-600">
              {item.answer}
            </p>
          </div>
        ))}
      </div>
    </Section>
  );
};

export default FAQSection;

