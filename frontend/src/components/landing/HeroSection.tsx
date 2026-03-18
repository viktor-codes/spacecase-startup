import Image from "next/image";
import Link from "next/link";
import { ArrowDown, ArrowUpRight } from "lucide-react";

import Container from "@/components/Container";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import SectionHeading from "@/components/landing/SectionHeading";

const HeroSection = () => {
  return (
    <section className="relative w-full overflow-hidden pt-16 pb-16 lg:pt-28 lg:pb-24">
      <Container className="relative z-(--z-top)">
        <div className="flex flex-col gap-12 lg:flex-row lg:items-center lg:justify-between">
          {/* Content */}
          <div className="flex flex-col space-y-6 md:space-y-8 text-center items-center lg:text-left lg:items-start max-w-xl">
            <Badge className="mb-4">Powered by NASA</Badge>

            <SectionHeading
              className="px-0 lg:px-0 text-center lg:text-left"
              containerClassName="max-w-none"
              align="left"
              titleAs="h1"
              title={
                <>
                  The sky remembers.
                  <br />
                  <span className="text-brand-pink bg-clip-text font-bold">
                    Carry it.
                  </span>
                </>
              }
              titleClassName="mt-0 text-6xl lg:text-6xl xl:text-7xl font-medium leading-[1.1] max-w-[12ch] mx-auto lg:mx-0"
              subtitle={
                <>
                  Pick a date that changed your world. We turn its NASA sky into
                  a print‑grade, AI‑restored case you carry every day.
                </>
              }
              subtitleClassName="max-w-[480px] leading-relaxed md:leading-loose mx-auto lg:mx-0"
            />

            <div className="flex flex-row items-center justify-center gap-3">
              <Button
                asChild
                variant="primary"
                size="hero"
                className="px-4 py-2.5 sm:px-5 sm:py-3 lg:px-8 lg:py-4"
              >
                <Link href="/configure/upload">
                  <span className="text-xs sm:text-sm md:text-base tracking-[0.14em] uppercase">
                    Discover My Sky
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
                  <span className="text-xs sm:text-sm md:text-base tracking-[0.14em] uppercase">
                    how it works
                  </span>
                  <ArrowDown className="ml-2 h-5 w-5" />
                </a>
              </Button>
            </div>
          </div>

          {/* Product */}
          <div className="relative flex flex-col items-center justify-center gap-6 mt-4 lg:mt-0">
            {/* Tech grid under the product */}
            {/* <div
              className="absolute -bottom-10 left-1/2 -translate-x-1/2 w-[120%] h-[120%] pointer-events-none"
              style={{
                perspective: "1000px", // Создает точку схода
              }}
            >
              <div
                className="w-full h-full"
                style={{
                  backgroundImage: `
        linear-gradient(to right, rgba(255,255,255,0.05) 1px, transparent 1px),
        linear-gradient(to bottom, rgba(255,255,255,0.05) 1px, transparent 1px)
      `,
                  backgroundSize: "70px 70px",
                  transform: "rotateZ(70deg)",
                  // Наклоняем сетку от себя
                  maskImage:
                    "radial-gradient(ellipse at center, black 20%, transparent 80%)", // Смягчаем края
                }}
              />
            </div> */}

            {/* Сферическая сетка "Рыбий глаз" за продуктом */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[160%] h-[160%] pointer-events-none z-(--z-bottom)">
              <div
                className="w-full h-full"
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
                  animation: "radar-pulse 14s linear infinite",
                }}
              />
            </div>

            <div className="relative">
              <Image
                src="/hero-phone.png"
                alt="SpaceCase — premium phone case with NASA nebula print"
                width={1024}
                height={1024}
                priority
                quality={85}
                className="relative z-(--z-top) w-72 sm:w-80 md:w-96 lg:w-[420px] xl:w-[520px] h-auto"
              />
            </div>

            {/* Feature badges orbiting around the phone on tablet+ */}

            <div className="pointer-events-none">
              <div className="absolute inset-0 opacity-50 block sm:hidden">
                <div className="absolute top-[5%] left-[4%]">
                  <Badge variant="outline">Dual protection</Badge>
                </div>
                <div className="absolute top-[25%] right-[3%]">
                  <Badge variant="outline">300+ DPI print</Badge>
                </div>
                <div className="absolute bottom-[12%] left-[5%]">
                  <Badge variant="outline">UV-resistant ink</Badge>
                </div>
                <div className="absolute bottom-[5%] right-[3%]">
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
