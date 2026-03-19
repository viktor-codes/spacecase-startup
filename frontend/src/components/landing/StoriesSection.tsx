"use client";

import { useEffect, useState } from "react";
import useEmblaCarousel from "embla-carousel-react";

import Section from "@/components/Section";
import Phone from "@/components/Phone";
import SectionHeading from "@/components/landing/SectionHeading";

const stories = [
  {
    title: "Child's birthday",
    dateLabel: "12.03.2018",
    description:
      "The day Leo was born. On the case — a nebula published by NASA on this exact date.",
    imgSrc: "/testimonials/1.jpg",
  },
  {
    title: "Parents' anniversary",
    dateLabel: "05.05.1990",
    description:
      "Their wedding day, captured by a NASA image from that date and printed on a case they use every day.",
    imgSrc: "/testimonials/2.jpg",
  },
  {
    title: "First meeting",
    dateLabel: "21.06.2019",
    description:
      "The cosmos on that day — a distant galaxy that now lives on your shared phone case.",
    imgSrc: "/testimonials/3.jpg",
  },
  {
    title: "Personal breakthrough",
    dateLabel: "05.09.2021",
    description:
      "The case reminds you: once you already took the leap — and it worked.",
    imgSrc: "/testimonials/4.jpg",
  },
  {
    title: "Graduation day",
    dateLabel: "20.06.2016",
    description:
      "Your graduation date paired with the universe as it looked that day.",
    imgSrc: "/testimonials/5.jpg",
  },
  {
    title: "Big move abroad",
    dateLabel: "01.11.2023",
    description: "Your moving date, your new universe, on your phone.",
    imgSrc: "/testimonials/6.jpg",
  },
];

const StoriesSection = () => {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [emblaRef, emblaApi] = useEmblaCarousel({
    align: "start",
    containScroll: "trimSnaps",
    dragFree: true,
  });

  useEffect(() => {
    if (!emblaApi) return;

    const onSelect = () => {
      setSelectedIndex(emblaApi.selectedScrollSnap());
    };

    emblaApi.on("select", onSelect);
    emblaApi.on("reInit", onSelect);
    onSelect();

    return () => {
      emblaApi.off("select", onSelect);
      emblaApi.off("reInit", onSelect);
    };
  }, [emblaApi]);

  const handleDotClick = (index: number) => {
    emblaApi?.scrollTo(index);
  };

  return (
    <div id="gallery">
      <Section>
        <SectionHeading
          containerClassName="max-w-5xl"
          kicker="Stories from the universe"
          title="Your date, in the sky"
          subtitle={
            <>
              NASA publishes a photo of the universe every single day. We find
              the image from your exact date and turn it into a phone case that
              is always with you.
            </>
          }
          subtitleClassName="max-w-2xl mx-auto"
        />

        <div className="mt-14 px-6 lg:px-8 mx-auto max-w-6xl">
          <p className="text-xs text-text-tertiary mb-4 md:hidden">
            Swipe to explore stories
          </p>

          <div className="md:hidden">
            <div className="overflow-hidden" ref={emblaRef}>
              <div className="flex gap-5 pb-4">
                {stories.map((story) => (
                  <article
                    key={story.title}
                    className="group flex min-w-[72%] sm:min-w-[60%] flex-col items-center text-center"
                  >
                    <div className="mb-5 transition-transform duration-300 group-hover:scale-[1.03]">
                      <Phone className="w-44 md:w-48" imgSrc={story.imgSrc} dark />
                    </div>
                    <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-text-tertiary">
                      {story.dateLabel}
                    </p>
                    <h3 className="mt-1.5 text-base font-semibold text-text-primary">
                      {story.title}
                    </h3>
                    <p className="mt-1.5 text-sm text-text-secondary max-w-[22ch] mx-auto leading-relaxed">
                      {story.description}
                    </p>
                  </article>
                ))}
              </div>
            </div>

            <div className="mt-1 flex items-center justify-center gap-2">
              {stories.map((story, index) => (
                <button
                  key={story.title}
                  type="button"
                  aria-label={`Go to ${story.title}`}
                  className={`h-1.5 rounded-full transition-all ${
                    selectedIndex === index
                      ? "w-6 bg-brand-pink"
                      : "w-2 bg-white/30 hover:bg-white/50"
                  }`}
                  onClick={() => handleDotClick(index)}
                />
              ))}
            </div>
          </div>

          <div className="hidden md:grid md:grid-cols-3 md:gap-8">
            {stories.map((story) => (
              <article
                key={story.title}
                className="group flex flex-col items-center text-center"
              >
                <div className="mb-5 transition-transform duration-300 group-hover:scale-[1.03]">
                  <Phone className="w-44 md:w-48" imgSrc={story.imgSrc} dark />
                </div>
                <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-text-tertiary">
                  {story.dateLabel}
                </p>
                <h3 className="mt-1.5 text-base font-semibold text-text-primary">
                  {story.title}
                </h3>
                <p className="mt-1.5 text-sm text-text-secondary max-w-[22ch] mx-auto leading-relaxed">
                  {story.description}
                </p>
              </article>
            ))}
          </div>
        </div>
      </Section>
    </div>
  );
};

export default StoriesSection;
