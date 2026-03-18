import Section from "@/components/Section";
import SectionHeading from "@/components/landing/SectionHeading";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const faqs = [
  {
    question: "Where do the images come from?",
    answer:
      "We use NASA's official Astronomy Picture of the Day (APOD) archive. For your chosen date, we fetch the image that was published on or closest to that day.",
  },
  {
    question: "What if the image for my date is too dark or not very pretty?",
    answer:
      "If the original APOD is very dark or technical, we can suggest nearby dates with more visually striking imagery while still keeping the meaning of your moment.",
  },
  {
    question: "Can I add text to my case?",
    answer:
      "Yes. You can add a short caption like a date, name, or phrase. We'll place it so it complements the NASA imagery rather than covering it.",
  },
  {
    question: "Which phone models do you support?",
    answer:
      "We currently support popular iPhone models, with more devices coming soon. You'll see the full list of supported models when you configure your SpaceCase.",
  },
  {
    question: "What happens if the case doesn't fit or arrives damaged?",
    answer:
      "If your case arrives damaged, misprinted, or not as described, reach out to us. We will offer a reprint or a refund according to our guarantee policy.",
  },
  {
    question: "How long will it take to receive my order?",
    answer:
      "Production typically takes 3–5 business days. Shipping times depend on your region and the method you select at checkout, where you'll also see estimated delivery dates.",
  },
];

const FAQSection = () => {
  return (
    <Section>
      <SectionHeading
        kicker="FAQ"
        title="Answers before you launch your SpaceCase"
        subtitle={
          <>
            If you are wondering about how we use NASA imagery, shipping, or
            customization, you will probably find your answer below.
          </>
        }
        subtitleClassName="max-w-2xl mx-auto"
      />

      <div className="mt-12 px-6 lg:px-8 mx-auto max-w-3xl">
        <Accordion type="single" collapsible>
          {faqs.map((item, i) => (
            <AccordionItem key={item.question} value={`faq-${i}`}>
              <AccordionTrigger className="text-text-primary">
                {item.question}
              </AccordionTrigger>
              <AccordionContent className="text-text-secondary">
                {item.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </Section>
  );
};

export default FAQSection;
