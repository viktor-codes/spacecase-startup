import Image from "next/image";
import Link from "next/link";
import { ArrowDown, ArrowUpRight } from "lucide-react";

import Container from "@/components/Container";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

const HeroSection = () => {
  return (
    <section
      className="relative w-full overflow-hidden  pt-24 pb-16 lg:pt-28 lg:pb-20"
      style={{
        backgroundImage: [
          "radial-gradient(ellipse 70% 50% at 88% 10%, var(--glow-pink) 0%, transparent 70%)",
          "radial-gradient(ellipse 40% 40% at 92% 5%, rgba(255,255,255,0.06) 0%, transparent 50%)",
          "radial-gradient(ellipse 50% 50% at 78% 15%, var(--glow-purple) 0%, transparent 60%)",
        ].join(", "),
      }}
    >
      {/* Star dots near light source */}
      <div
        className="pointer-events-none absolute inset-0 right-0 z-(--z-bottom)"
        aria-hidden="true"
      >
        <div className="absolute top-[6%] right-[14%] h-1.5 w-1.5 rounded-full bg-white/80 shadow-[0_0_6px_2px_var(--glow-pink)]" />
        <div className="absolute top-[4%] right-[22%] h-1 w-1 rounded-full bg-white/60 shadow-[0_0_4px_1px_var(--glow-purple)]" />
        <div className="absolute top-[10%] right-[8%] h-[5px] w-[5px] rounded-full bg-brand-pink/50 shadow-[0_0_4px_1px_var(--glow-pink)]" />
        <div className="absolute top-[14%] right-[30%] h-1 w-1 rounded-full bg-brand-pink/40 shadow-[0_0_3px_1px_var(--glow-purple)]" />
        <div className="absolute top-[20%] right-[5%] h-[3px] w-[3px] rounded-full bg-white/50 shadow-[0_0_3px_1px_var(--glow-purple)]" />
        <div className="absolute top-[8%] right-[38%] h-[3px] w-[3px] rounded-full bg-brand-pink/40 shadow-[0_0_2px_1px_var(--glow-purple)]" />
        <div className="absolute top-[25%] right-[12%] h-0.5 w-0.5 rounded-full bg-white/40" />
        <div className="absolute top-[18%] right-[26%] h-0.5 w-0.5 rounded-full bg-brand-pink/35" />
      </div>

      <Container className="relative z-(--z-top)">
        <div className="grid lg:grid-cols-[1.1fr_1fr] xl:grid-cols-[1fr_1.05fr] gap-10 xl:gap-20 items-center">
          {/* Content */}
          <div className="flex flex-col space-y-7 text-center lg:text-left items-center lg:items-start">
            <Badge>Powered by NASA</Badge>

            <h1 className="text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-bold tracking-tight leading-[1.05]! text-text-primary">
              The sky remembers.
              <br />
              <span className="text-brand-pink bg-clip-text">Carry it.</span>
            </h1>

            <p className="max-w-[480px] text-lg text-text-secondary leading-relaxed">
              Pick a date that changed your world. We find NASA&apos;s exact
              astronomy photo from that moment and restore it with AI to
              print-grade resolution.
            </p>
            <p className="max-w-[480px] text-lg text-text-secondary leading-relaxed -mt-3">
              The result? A dual-layer phone case you&apos;ll never want to put
              down.
            </p>

            <div className="flex flex-col sm:flex-row items-center gap-5">
              <Button asChild variant="primary" size="hero">
                <Link href="/configure/upload">
                  <span className="tracking-[0.16em] text-xs uppercase">
                    Discover My Sky
                  </span>
                  <ArrowUpRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>

              <Button asChild variant="secondary" size="hero">
                <a href="#how-it-works">
                  <span className="text-xs tracking-[0.16em] uppercase">
                    how it works
                  </span>
                  <ArrowDown className="ml-2 h-4 w-4" />
                </a>
              </Button>
            </div>
          </div>

          {/* Product */}
          <div className="relative flex flex-col items-center lg:items-end justify-center gap-4">
            <div
              className="pointer-events-none absolute -top-[30%] -right-[20%] w-[70%] h-[60%] rounded-full bg-brand-pink/15 blur-3xl lg:hidden z-(--z-bottom)"
              aria-hidden="true"
            />

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
                className="relative z-(--z-top) w-96 sm:w-80 md:w-96 lg:w-[420px] xl:w-[600px] h-auto"
              />
            </div>

            {/* <div className="flex flex-wrap items-center justify-center lg:justify-end gap-2">
              {[
                "Dual-layer protection",
                "300+ DPI print",
                "UV-resistant ink",
              ].map((label) => (
                <Badge key={label} variant="outline">
                  {label}
                </Badge>
              ))}
            </div> */}
          </div>
        </div>
      </Container>
    </section>
  );
};

export default HeroSection;
