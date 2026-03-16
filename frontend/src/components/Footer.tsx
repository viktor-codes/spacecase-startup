import Link from "next/link";

import Container from "@/components/Container";

const Footer = () => {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-(--border-default) bg-surface-base">
      <Container>
        <div className="flex flex-col gap-6 py-8 md:flex-row md:items-center md:justify-between">
          <div className="space-y-2 text-sm">
            <p className="font-bold tracking-tight text-text-primary">
              Space<span className="text-brand-pink">Case</span>
            </p>
            <p className="max-w-md text-xs md:text-sm text-text-tertiary">
              The sky from your most important date — AI-restored and printed on
              a premium dual-layer phone case.
            </p>
            <p className="text-xs text-text-tertiary">
              © {year} SpaceCase. All rights reserved.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-4 text-xs md:text-sm text-text-tertiary">
            <Link href="/configure/upload" className="hover:text-text-primary transition-colors">
              Create Your SpaceCase
            </Link>
            <span className="hidden h-1 w-1 rounded-full bg-text-tertiary/40 md:inline-block" />
            <Link href="/legal/terms" className="hover:text-text-primary transition-colors">
              Terms
            </Link>
            <span className="hidden h-1 w-1 rounded-full bg-text-tertiary/40 md:inline-block" />
            <Link href="/legal/privacy" className="hover:text-text-primary transition-colors">
              Privacy
            </Link>
            <span className="hidden h-1 w-1 rounded-full bg-text-tertiary/40 md:inline-block" />
            <a
              href="mailto:hello@spacecase.app"
              className="hover:text-text-primary transition-colors"
            >
              Contact
            </a>
          </div>
        </div>
      </Container>
    </footer>
  );
};

export default Footer;

