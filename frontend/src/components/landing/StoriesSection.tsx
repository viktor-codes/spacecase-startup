import Section from "@/components/Section";
import Phone from "@/components/Phone";

const stories = [
  {
    title: "Child's birthday",
    dateLabel: "12.03.2018",
    description:
      "The day Leo was born. On the case — a nebula published by NASA on this exact date. Now this moment is always in your hand.",
    imgSrc: "/examples/birthday.jpg",
  },
  {
    title: "Parents’ anniversary",
    dateLabel: "05.05.1990",
    description:
      "A way to say thank you for everything. Their wedding day, captured by a NASA image from that date and printed on a case they use every day.",
    imgSrc: "/examples/parents-anniversary.jpg",
  },
  {
    title: "First meeting",
    dateLabel: "21.06.2019",
    description:
      "The day you met. The cosmos on that day — a distant galaxy that now lives on your shared phone case.",
    imgSrc: "/examples/first-meet.jpg",
  },
  {
    title: "Personal breakthrough",
    dateLabel: "05.09.2021",
    description:
      "A move, a new job, or a project launch. The case reminds you: once you already took the leap — and it worked.",
    imgSrc: "/examples/breakthrough.jpg",
  },
  {
    title: "Graduation day",
    dateLabel: "20.06.2016",
    description:
      "The moment you closed one chapter and opened another. Your graduation date paired with the universe as it looked that day.",
    imgSrc: "/examples/graduation.jpg",
  },
  {
    title: "Big move abroad",
    dateLabel: "01.11.2023",
    description:
      "A reminder that you were brave enough to start over in a new place. Your moving date, your new universe, on your phone.",
    imgSrc: "/examples/move-abroad.jpg",
  },
];

const StoriesSection = () => {
  return (
    <Section>
      <div className="px-6 lg:px-8 mx-auto max-w-5xl text-center">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-500">
          Stories from the universe
        </p>
        <h2 className="mt-4 tracking-tight text-balance !leading-tight font-bold text-4xl md:text-5xl text-gray-900">
          Every important date is already stored in space
        </h2>
        <p className="mt-4 text-base md:text-lg text-slate-600 max-w-2xl mx-auto">
          NASA publishes a photo of the universe every single day. We find the
          image from your exact date and turn it into a phone case that is
          always with you.
        </p>
      </div>

      <div className="mt-12 px-6 lg:px-8 mx-auto max-w-6xl">
        <div className="flex items-center justify-between mb-4 md:hidden">
          <p className="text-xs text-slate-500">
            Swipe to explore different stories
          </p>
        </div>

        <div className="flex gap-6 overflow-x-auto pb-4 md:grid md:gap-10 md:grid-cols-2 md:overflow-visible md:pb-0 snap-x snap-mandatory">
          {stories.map((story) => (
            <article
              key={story.title}
              className="flex min-w-[80%] max-w-xs flex-col items-stretch rounded-2xl border border-slate-200 bg-white/60 p-6 shadow-sm backdrop-blur-sm snap-center md:min-w-0 md:max-w-none"
            >
              <div className="mb-6 flex justify-center">
                <Phone className="w-52" imgSrc={story.imgSrc} />
              </div>
              <div className="flex-1 flex flex-col text-left">
                <div className="text-xs font-semibold tracking-[0.2em] text-slate-500 uppercase">
                  {story.dateLabel}
                </div>
                <h3 className="mt-2 text-lg font-semibold text-slate-900">
                  {story.title}
                </h3>
                <p className="mt-3 text-sm text-slate-600">
                  {story.description}
                </p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </Section>
  );
};

export default StoriesSection;
