import { ArrowRight } from "lucide-react";
import Image from "next/image";

import Link from "next/link";

import Container from "@/components/Container";
import { buttonVariants } from "@/components/ui/button";

function Logo() {
  return (
    <span className="select-none flex items-center justify-center">
      {/* Добавляем flex и items-center для главной строки текста */}
      <span className="font-display text-base font-bold tracking-tight leading-none text-text-primary uppercase flex items-center">
        Space
        {/* Контейнер для иконки и хвоста слова тоже делаем flex items-center */}
        <span className="text-brand-pink flex items-center">
          <Image
            src="/spacecasenewlogo.png"
            alt="C"
            width={56}
            height={56}
            className="inline-block w-12 h-12 rotate-50 shrink-0 -ms-1 -me-3"
          />
          ase
        </span>
      </span>
    </span>
  );
}

export default function Header() {
  return (
    <header className="sticky top-0 inset-x-0 z-[var(--z-header)]  bg-transparent backdrop-blur-lg transition-all">
      <Container>
        <div className="flex h-14 items-center justify-between">
          <Link href="/" className="flex items-center gap-2 z-[var(--z-top)]">
            <Logo />
          </Link>

          <div className="flex h-full items-center space-x-4">
            <Link
              href="/configure/upload"
              className={buttonVariants({
                variant: "space",
                size: "sm",
                className: "hidden sm:flex items-center gap-1",
              })}
            >
              Create Your SpaceCase
              <ArrowRight className="ml-1.5 h-5 w-5" />
            </Link>
          </div>
        </div>
      </Container>
    </header>
  );
}
