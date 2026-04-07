import Link from "next/link";

import Container from "@/components/Container";
import Logo from "@/components/Logo";

const Footer = () => {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-(--border-default) bg-surface-base">
      <Container>
        <div className="flex flex-col gap-6 py-8 md:flex-row md:items-center md:justify-between">
          <div className="space-y-2 text-sm">
            <Link href="/" className="inline-flex">
              <Logo iconSize={48} />
            </Link>
            <p className="max-w-md text-xs text-text-tertiary md:text-sm">
              The sky from your most important date — AI-restored and printed on
              a premium dual-layer phone case.
            </p>
            <p className="text-xs text-text-tertiary">
              © {year} CosmicCase. All rights reserved.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-4 text-xs text-text-tertiary md:text-sm">
            <Link
              href="/configure/upload"
              className="transition-colors hover:text-text-primary"
            >
              Create Your CosmicCase
            </Link>
            <span className="hidden h-1 w-1 rounded-full bg-text-tertiary/40 md:inline-block" />
            <Link
              href="/legal/terms"
              className="transition-colors hover:text-text-primary"
            >
              Terms
            </Link>
            <span className="hidden h-1 w-1 rounded-full bg-text-tertiary/40 md:inline-block" />
            <Link
              href="/legal/privacy"
              className="transition-colors hover:text-text-primary"
            >
              Privacy
            </Link>
            <span className="hidden h-1 w-1 rounded-full bg-text-tertiary/40 md:inline-block" />
            <a
              href="mailto:hello@CosmicCase.app"
              className="transition-colors hover:text-text-primary"
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
