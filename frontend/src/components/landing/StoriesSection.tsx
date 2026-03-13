import Section from "@/components/Section";
import Phone from "@/components/Phone";

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
    description:
      "Your moving date, your new universe, on your phone.",
    imgSrc: "/testimonials/6.jpg",
  },
];

const StoriesSection = () => {
  return (
    <Section>
      <div className="px-6 lg:px-8 mx-auto max-w-5xl text-center">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-500 font-technical">
          Stories from the universe
        </p>
        <h2 className="mt-4 tracking-tight text-balance leading-tight! font-bold text-4xl md:text-5xl text-gray-900">
          Every important date is already stored in space
        </h2>
        <p className="mt-4 text-base md:text-lg text-slate-600 max-w-2xl mx-auto">
          NASA publishes a photo of the universe every single day. We find the
          image from your exact date and turn it into a phone case that is
          always with you.
        </p>
      </div>

      <div className="mt-14 px-6 lg:px-8 mx-auto max-w-6xl">
        <p className="text-xs text-slate-400 mb-4 md:hidden">
          Swipe to explore stories
        </p>

        <div className="flex gap-5 overflow-x-auto pb-4 md:grid md:grid-cols-3 md:gap-8 md:overflow-visible md:pb-0 snap-x snap-mandatory">
          {stories.map((story) => (
            <article
              key={story.title}
              className="group flex min-w-[72%] sm:min-w-[60%] flex-col items-center text-center snap-center md:min-w-0"
            >
              <div className="mb-5 transition-transform duration-300 group-hover:scale-[1.03]">
                <Phone className="w-44 md:w-48" imgSrc={story.imgSrc} dark />
              </div>
              <p className="font-technical text-[11px] uppercase tracking-[0.2em] text-slate-400">
                {story.dateLabel}
              </p>
              <h3 className="mt-1.5 text-base font-semibold text-slate-900">
                {story.title}
              </h3>
              <p className="mt-1.5 text-sm text-slate-500 max-w-[22ch] mx-auto leading-relaxed">
                {story.description}
              </p>
            </article>
          ))}
        </div>
      </div>
    </Section>
  );
};

export default StoriesSection;
