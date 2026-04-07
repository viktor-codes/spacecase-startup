import { Check, Star } from "lucide-react";

import { Icons } from "@/components/Icons";
import Section from "@/components/Section";
import { Reviews } from "@/components/Reviews";

const TestimonialsSection = () => {
  return (
    <Section className="bg-[#0A0A0A]">
      <div className="flex flex-col items-center gap-16 sm:gap-32">
        <div className="flex flex-col items-center gap-4 sm:gap-6">
          <p className="font-technical text-sm font-semibold tracking-[0.2em] text-slate-400 uppercase">
            Trusted by space enthusiasts
          </p>
          <h2 className="mt-2 text-center text-5xl leading-tight! font-bold tracking-tight text-balance text-white md:text-6xl">
            What our{" "}
            <span className="relative px-2">
              customers{" "}
              <Icons.underline className="pointer-events-none absolute inset-x-0 -bottom-6 hidden text-brand sm:block" />
            </span>{" "}
            say
          </h2>
        </div>

        <div className="mx-auto grid max-w-2xl grid-cols-1 gap-y-16 px-4 lg:mx-0 lg:max-w-none lg:grid-cols-2">
          <div className="flex flex-auto flex-col gap-4 lg:pr-8 xl:pr-20">
            <div className="mb-2 flex gap-0.5">
              <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
              <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
              <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
              <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
              <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
            </div>
            <div className="text-lg leading-8 text-slate-300">
              <p>
                &quot;The case feels durable and I even got a compliment on the
                design. Had the case for two and a half months now and{" "}
                <span className="bg-white/10 p-0.5 text-white">
                  the image is super clear
                </span>
                , on the case I had before, the image started fading into
                yellow-ish color after a couple weeks. Love it.&quot;
              </p>
            </div>
            <div className="mt-2 flex gap-4">
              <img
                className="h-12 w-12 rounded-full object-cover"
                src="/avatar-1.png"
                alt="user"
              />
              <div className="flex flex-col">
                <p className="font-semibold text-white">Orla</p>
                <div className="flex items-center gap-1.5 text-slate-400">
                  <Check className="h-4 w-4 stroke-[3px] text-brand" />
                  <p className="text-sm">Verified Customer</p>
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-auto flex-col gap-4 lg:pr-8 xl:pr-20">
            <div className="mb-2 flex gap-0.5">
              <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
              <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
              <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
              <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
              <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
            </div>
            <div className="text-lg leading-8 text-slate-300">
              <p>
                &quot;I usually keep my phone together with my keys in my pocket
                and that led to some pretty heavy scratchmarks on all of my last
                phone cases. This one, besides a barely noticeable scratch on
                the corner,{" "}
                <span className="bg-white/10 p-0.5 text-white">
                  looks brand new after about half a year
                </span>
                . I dig it.&quot;
              </p>
            </div>
            <div className="mt-2 flex gap-4">
              <img
                className="h-12 w-12 rounded-full object-cover"
                src="/avatar-2.png"
                alt="user"
              />
              <div className="flex flex-col">
                <p className="font-semibold text-white">Josh</p>
                <div className="flex items-center gap-1.5 text-slate-400">
                  <Check className="h-4 w-4 stroke-[3px] text-brand" />
                  <p className="text-sm">Verified Customer</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="pt-16">
        <Reviews />
      </div>
    </Section>
  );
};

export default TestimonialsSection;
