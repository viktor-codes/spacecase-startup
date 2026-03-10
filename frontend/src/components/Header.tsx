import { ArrowRight } from "lucide-react";
import Link from "next/link";

import Container from "@/components/Container";
import { buttonVariants } from "@/components/ui/button";

export default function Header() {
  return (
    <header className="sticky top-0 inset-x-0 z-100 border-b border-gray-200 bg-white/75 backdrop-blur-lg transition-all">
      <Container>
        <div className="flex h-18 items-center justify-between">
          <Link href="/" className="flex items-center gap-2 z-40">
            <img
              src="/spacecase-logo-2.svg"
              alt="SpaceCase"
              className="h-24 w-auto"
            />
          </Link>

          <div className="flex h-full items-center space-x-4">
            <Link
              href="/create"
              className={buttonVariants({
                size: "sm",
                className: "hidden sm:flex items-center gap-1",
              })}
            >
              Create case
              <ArrowRight className="ml-1.5 h-5 w-5" />
            </Link>
          </div>
        </div>
      </Container>
    </header>
  );
}
