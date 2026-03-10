import Image from "next/image";
import { Check, Star } from "lucide-react";

import Section from "@/components/Section";
import FloatingCase from "@/components/FloatingCase";

const HeroSection = () => {
  return (
    <Section containerClassName="pb-24 pt-10 lg:grid lg:grid-cols-3 sm:pb-32 lg:gap-x-0 xl:gap-x-8 lg:pt-24 xl:pt-32 lg:pb-52">
      <div className="col-span-2 px-6 lg:px-0 lg:pt-4">
        <div className="relative mx-auto text-center lg:text-left flex flex-col items-center lg:items-start">
          <div className="mb-6 w-36 sm:w-40 lg:hidden">
            <Image
              src="/logo.png"
              alt="funny astronaut"
              width={160}
              height={160}
              className="w-full animate-float mx-auto"
            />
          </div>
          <div className="absolute w-52 left-0 -top-32 hidden lg:block">
            <div className="absolute inset-x-0 bottom-0 bg-linear-to-t via-slate-50/50 from-slate-50 h-10" />
            <Image
              src="/logo.png"
              alt="funny astronaut"
              width={208}
              height={208}
              className="w-full animate-float"
            />
          </div>
          <h1 className="relative w-fit tracking-tight text-balance mt-16 font-bold leading-tight! text-grey-900 text-5xl md:text-6xl lg:text-7xl">
            Turn a date into a{" "}
            <span className="bg-[#4A325E] px-2 text-white">SpaceCase</span>
          </h1>
          <p className="mt-8 text-lg lg:pr-10 max-w-prose text-center lg:text-left text-balance md:text-wrap">
            We take NASA&apos;s Astronomy Picture of the Day from a date that
            matters to you and print it on a custom case, so your moment is
            always in your hand.
          </p>
          <ul className="mt-8 space-y-2 text-left font-medium flex flex-col items-center sm:items-start">
            <div className="space-y-2">
              <li className="flex gap-1 5 items-center text-left">
                <Check className="h-5 w-5 shrink-0 text-[#4A325E]" />
                High-quality durable prints
              </li>
              <li className="flex gap-1 5 items-center text-left">
                <Check className="h-5 w-5 shrink-0 text-[#4A325E]" />
                Eco-friendly materials
              </li>
              <li className="flex gap-1 5 items-center text-left">
                <Check className="h-5 w-5 shrink-0 text-[#4A325E]" />
                Satisfaction guarantee
              </li>
            </div>
          </ul>
          <div className="mt-10 sm:mt-12 flex flex-col sm:flex-row items-center sm:items-start gap-5">
            <div className="flex -space-x-4">
              <Image
                src="/avatar-1.png"
                alt="user avatar"
                width={40}
                height={40}
                className="inline-block h-10 w-10 rounded-full ring-2 ring-slate-100"
              />
              <Image
                src="/avatar-5.png"
                alt="user avatar"
                width={40}
                height={40}
                className="inline-block h-10 w-10 rounded-full ring-2 ring-slate-100"
              />
              <Image
                src="/avatar-4.png"
                alt="user avatar"
                width={40}
                height={40}
                className="inline-block h-10 w-10 rounded-full ring-2 ring-slate-100"
              />
              <Image
                src="/avatar-3.png"
                alt="user avatar"
                width={40}
                height={40}
                className="inline-block h-10 w-10 rounded-full ring-2 ring-slate-100"
              />
              <Image
                src="/avatar-2.png"
                alt="user avatar"
                width={40}
                height={40}
                className="inline-block h-10 w-10 rounded-full ring-2 ring-slate-100"
              />
            </div>
            <div className="flex flex-col justify-between items-center sm:items-start">
              <div className="flex gap-0 5">
                <Star className="h-4 w-4 shrink-0 text-yellow-400 fill-yellow-400" />
                <Star className="h-4 w-4 shrink-0 text-yellow-400 fill-yellow-400" />
                <Star className="h-4 w-4 shrink-0 text-yellow-400 fill-yellow-400" />
                <Star className="h-4 w-4 shrink-0 text-yellow-400 fill-yellow-400" />
                <Star className="h-4 w-4 shrink-0 text-yellow-400 fill-yellow-400" />
              </div>
              <p>
                <span className="font-semibold">1.250 </span>
                happy costumers
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="col-span-full lg:col-span-1 w-full flex justify-center px-8 sm:px-16 md:px-0 mt-32 lg:mx-0 lg:mt-20 h-fit">
        <div className="relative md:max-w-xl">
          <Image
            src="/your-image.png"
            alt="case detail"
            width={208}
            height={208}
            className="absolute w-40 lg:w-52 left-56 -top-20 select-none hidden sm:block lg:hidden xl:block"
          />
          <Image
            src="/line.png"
            alt=""
            width={80}
            height={80}
            className="absolute w-20 -left-6 -bottom-6 select-none"
          />
          <FloatingCase imgSrc="/nebula.png" />
        </div>
      </div>
    </Section>
  );
};

export default HeroSection;
