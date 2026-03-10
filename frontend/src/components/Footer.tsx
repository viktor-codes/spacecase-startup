import Link from "next/link";

import Container from "@/components/Container";

const Footer = () => {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-gray-200 bg-white/70 backdrop-blur-md">
      <Container>
        <div className="flex flex-col gap-6 py-8 md:flex-row md:items-center md:justify-between">
          <div className="space-y-2 text-sm text-slate-600">
            <p className="font-semibold text-slate-900">SpaceCase</p>
            <p className="max-w-md text-xs md:text-sm text-slate-500">
              Turn the date that changed your world into a SpaceCase with NASA
              imagery you can carry every day.
            </p>
            <p className="text-xs text-slate-400">
              © {year} SpaceCase. All rights reserved.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-4 text-xs md:text-sm text-slate-500">
            <Link href="/configure/upload" className="hover:text-slate-900">
              Create your case
            </Link>
            <span className="hidden h-1 w-1 rounded-full bg-slate-300 md:inline-block" />
            <Link href="/legal/terms" className="hover:text-slate-900">
              Terms
            </Link>
            <span className="hidden h-1 w-1 rounded-full bg-slate-300 md:inline-block" />
            <Link href="/legal/privacy" className="hover:text-slate-900">
              Privacy
            </Link>
            <span className="hidden h-1 w-1 rounded-full bg-slate-300 md:inline-block" />
            <a
              href="mailto:hello@spacecase.app"
              className="hover:text-slate-900"
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

