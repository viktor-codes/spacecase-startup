import Link from "next/link";

import Container from "@/components/Container";

const Footer = () => {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-white/10 bg-[#050505]">
      <Container>
        <div className="flex flex-col gap-6 py-8 md:flex-row md:items-center md:justify-between">
          <div className="space-y-2 text-sm">
            <p className="font-bold tracking-tight text-white">
              Space<span className="text-brand">Case</span>
            </p>
            <p className="max-w-md text-xs md:text-sm text-slate-500">
              The sky from your most important date — AI-restored and printed on
              a premium dual-layer phone case.
            </p>
            <p className="text-xs text-slate-600">
              © {year} SpaceCase. All rights reserved.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-4 text-xs md:text-sm text-slate-500">
            <Link href="/configure/upload" className="hover:text-white transition-colors">
              Create Your SpaceCase
            </Link>
            <span className="hidden h-1 w-1 rounded-full bg-slate-700 md:inline-block" />
            <Link href="/legal/terms" className="hover:text-white transition-colors">
              Terms
            </Link>
            <span className="hidden h-1 w-1 rounded-full bg-slate-700 md:inline-block" />
            <Link href="/legal/privacy" className="hover:text-white transition-colors">
              Privacy
            </Link>
            <span className="hidden h-1 w-1 rounded-full bg-slate-700 md:inline-block" />
            <a
              href="mailto:hello@spacecase.app"
              className="hover:text-white transition-colors"
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

