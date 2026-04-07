import Image from "next/image";
import Link from "next/link";
import { ArrowDown, ArrowUpRight } from "lucide-react";

import Container from "@/components/Container";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import SectionHeading from "@/components/landing/SectionHeading";

const HeroSection = () => {
  return (
    <section
      id="home"
      className="relative w-full scroll-mt-16 overflow-hidden pt-16 pb-16 md:pt-28 md:pb-24"
    >
      <Container className="relative z-(--z-top)">
        <div className="flex flex-col gap-12 md:flex-row md:items-center md:justify-between md:gap-1">
          {/* Content */}
          <div className="mx-auto flex max-w-xl flex-col items-center space-y-6 text-center md:mx-0 md:items-start md:space-y-8 md:text-left">
            <Badge className="mb-4">From NASA APOD</Badge>

            <SectionHeading
              className="px-0 text-center md:text-left lg:px-0"
              containerClassName="max-w-none"
              align="left"
              titleAs="h1"
              title={
                <>
                  The sky remembers.
                  <br />
                  <span className="bg-clip-text text-brand-pink">
                    Carry it.
                  </span>
                </>
              }
              titleClassName="mt-0 font-bold leading-[1.1] max-w-[12ch] mx-auto md:mx-0"
              subtitle={
                <>
                  Pick a date. We fetch NASA&apos;s Astronomy Picture of the Day
                  and AI-enhance it for print-ready detail.
                </>
              }
              subtitleClassName="max-w-[380px] leading-relaxed md:leading-loose mx-auto md:mx-0 text-pretty"
            />

            <div className="flex flex-row items-center justify-center gap-3 lg:justify-start">
              <Button
                asChild
                variant="primary"
                size="hero"
                className="px-4 py-2.5 sm:px-5 sm:py-3 lg:px-8 lg:py-4"
              >
                <Link href="#try-now">
                  <span className="text-xs tracking-[0.14em] uppercase sm:text-sm lg:text-base">
                    Preview My Sky
                  </span>
                  <ArrowUpRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>

              <Button
                asChild
                variant="secondary"
                size="hero"
                className="px-4 py-2.5 sm:px-5 sm:py-3 lg:px-8 lg:py-4"
              >
                <a href="#how-it-works">
                  <span className="text-xs tracking-[0.14em] uppercase sm:text-sm lg:text-base">
                    How it works
                  </span>
                  <ArrowDown className="ml-2 h-5 w-5" />
                </a>
              </Button>
            </div>
          </div>

          {/* Product */}
          <div className="relative mt-4 flex flex-col items-center justify-center gap-6 md:mt-0">
            {/* Сферическая сетка "Рыбий глаз" за продуктом */}
            <div className="pointer-events-none absolute top-1/2 left-1/2 z-(--z-bottom) h-[160%] w-[160%] -translate-x-1/2 -translate-y-1/2">
              <div
                className="h-full w-full"
                style={{
                  backgroundImage: `
        repeating-radial-gradient(
          circle at center,
          rgba(77, 48, 255, 0.2) 0px,
          rgba(77, 48, 255, 0.2) 1px,
          transparent 1px,
          transparent 40px
        )
      `,
                  WebkitMaskImage:
                    "radial-gradient(circle at center, black 10%, transparent 70%)",
                  animation: "radar-pulse 20s linear infinite",
                }}
              />
            </div>

            <div className="relative">
              <Image
                src="/hero-phone.png"
                alt="CosmicCase — premium phone case with NASA nebula print"
                width={1024}
                height={1024}
                priority
                quality={85}
                className="relative z-(--z-top) h-auto w-72 sm:w-80 md:w-96 lg:w-[420px] xl:w-[520px]"
              />
            </div>

            {/* Feature badges orbiting around the phone on mobile only*/}

            <div className="pointer-events-none">
              <div className="absolute inset-0 block opacity-50 md:hidden">
                <div className="absolute top-[5%] left-[4%]">
                  <Badge variant="outline">Dual protection</Badge>
                </div>
                <div className="absolute top-[25%] right-[3%]">
                  <Badge variant="outline">300+ DPI print</Badge>
                </div>
                <div className="absolute bottom-[12%] left-[5%]">
                  <Badge variant="outline">UV-resistant ink</Badge>
                </div>
                <div className="absolute right-[3%] bottom-[5%]">
                  <Badge variant="outline">Official NASA imagery</Badge>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
};

export default HeroSection;
