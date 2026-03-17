import { ArrowRight } from "lucide-react";

import Link from "next/link";

import Container from "@/components/Container";
import { buttonVariants } from "@/components/ui/button";

function Logo() {
  return (
    <span className="flex items-center gap-1.5 select-none">
      <svg
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="none"
        className="text-brand-pink"
        aria-hidden="true"
      >
        <circle
          cx="12"
          cy="12"
          r="10"
          stroke="currentColor"
          strokeWidth="1.5"
        />
        <circle cx="12" cy="12" r="4" fill="currentColor" opacity="0.3" />
        <circle cx="12" cy="12" r="1.5" fill="currentColor" />
        <circle cx="18" cy="7" r="0.8" fill="currentColor" opacity="0.5" />
        <circle cx="7" cy="17" r="0.6" fill="currentColor" opacity="0.4" />
        <circle cx="16" cy="16" r="0.5" fill="currentColor" opacity="0.3" />
      </svg>
      <span className="text-base font-bold tracking-tight text-text-primary uppercase">
        Space<span className="text-brand-pink">Case</span>
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
