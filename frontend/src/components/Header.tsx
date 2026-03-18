import { ArrowRight } from "lucide-react";

import Link from "next/link";

import Container from "@/components/Container";
import Logo from "@/components/Logo";
import { buttonVariants } from "@/components/ui/button";

export default function Header() {
  return (
    <header className="sticky top-0 inset-x-0 z-(--z-header) bg-transparent backdrop-blur-lg transition-all">
      <Container>
        <div className="flex h-14 items-center justify-between">
          <Link href="/" className="flex items-center gap-2 z-(--z-top)">
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
