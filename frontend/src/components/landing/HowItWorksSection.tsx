import {
  ArrowRight,
  Binoculars,
  CalendarHeart,
  Paintbrush,
  ShoppingBasket,
} from "lucide-react";
import Link from "next/link";

import Section from "@/components/Section";
import Phone from "@/components/Phone";
import { buttonVariants } from "@/components/ui/button";

const HowItWorksSection = () => {
  return (
    <Section>
      <div className="mb-12 px-6 lg:px-8">
        <div className="mx-auto max-w-2xl sm:text-center">
          <h2 className="order-1 mt-2 tracking-tight text-center text-balance !leading-tight font-bold text-5xl md:text-6xl text-gray-900">
            Turn a date into your own{" "}
            <span className="relative px-2 bg-[#4A325E] text-white">
              SpaceCase
            </span>{" "}
          </h2>
        </div>
      </div>

      <div className="mx-auto max-w-6xl px-6 lg:px-8">
        <div className="relative flex flex-col items-center md:grid grid-cols-2 gap-40">
          <img
            src="/arrow.png"
            className="absolute top-[25rem] md:top-1/2 -translate-y-1/2 z-10 left-1/2 -translate-x-1/2 rotate-90 md:rotate-0"
          />

          <div className="relative h-80 md:h-full w-full md:justify-self-end max-w-sm rounded-xl bg-gray-900/5 ring-inset ring-gray-900/10 lg:rounded-2xl">
            <img
              src="/rosette-cone.jpg"
              className="rounded-md object-cover bg-white shadow-2xl ring-1 ring-gray-900/10 h-full w-full"
            />
          </div>

          <Phone className="w-60" imgSrc="/rosette-cone.jpg" />
        </div>
      </div>

      <ul className="mx-auto mt-12 max-w-prose sm:text-lg space-y-2 w-fit">
        <li className="w-fit">
          <CalendarHeart className="h-5 w-5 text-[#4A325E] inline mr-1.5" />|
          Choose a meaningful date that matters to you
        </li>
        <li className="w-fit">
          <Binoculars className="h-5 w-5 text-[#4A325E] inline mr-1.5" />|
          Discover the perfect NASA image from that day
        </li>
        <li className="w-fit">
          <Paintbrush className="h-5 w-5 text-[#4A325E] inline mr-1.5" />|
          Personalize it with your unique design choices
        </li>
        <li className="w-fit">
          <ShoppingBasket className="h-5 w-5 text-[#4A325E] inline mr-1.5" />|
          Submit your order, and let us handle the magic
        </li>

        <div className="flex justify-center">
          <Link
            className={buttonVariants({
              size: "lg",
              className: "mx-auto mt-8",
            })}
            href="/configure/upload"
          >
            Create your case now <ArrowRight className="h-4 w-4 ml-1.5" />
          </Link>
        </div>
      </ul>
    </Section>
  );
};

export default HowItWorksSection;
