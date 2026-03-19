"use client";

import { useCallback } from "react";
import type { MouseEvent } from "react";
import Link from "next/link";

import Container from "@/components/Container";
import Logo from "@/components/Logo";
import MobileNavMenu from "@/components/MobileNavMenu";

const NAV_ITEMS = [
  { id: "restoration", label: "Restoration" },
  { id: "case-anatomy", label: "Case Anatomy" },
  { id: "gallery", label: "Gallery" },
  { id: "faq", label: "FAQ" },
] as const;

type NavItemId = (typeof NAV_ITEMS)[number]["id"];

function scrollToSection(id: NavItemId) {
  if (typeof window === "undefined") return;

  const element = document.getElementById(id);
  if (!element) return;

  const header = document.querySelector<HTMLElement>("header");
  const headerHeight = header?.offsetHeight ?? 0;

  const elementTop = element.getBoundingClientRect().top + window.scrollY;
  const offset = Math.max(elementTop - headerHeight - 8, 0);

  window.scrollTo({
    top: offset,
    behavior: "smooth",
  });
}

export default function Header() {
  const handleNavClick = useCallback((id: NavItemId) => {
    if (window.location.pathname === "/") {
      scrollToSection(id);
    } else {
      window.location.href = `/#${id}`;
    }
  }, []);

  const handleLogoClick = useCallback((e: MouseEvent<HTMLAnchorElement>) => {
    // Важно: якорь вида /#home иногда не триггерит скролл повторно,
    // если URL/хэш не меняются — принудительно делаем scrollIntoView.
    if (window.location.pathname !== "/") return;

    e.preventDefault();
    window.history.replaceState(null, "", "/#home");

    const element = document.getElementById("home");
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" });
      return;
    }

    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  return (
    <header className="sticky top-0 inset-x-0 z-(--z-header) bg-transparent backdrop-blur-lg">
      <Container className="relative">
        <div className="flex h-14 items-center justify-between">
          <Link
            href="/#home"
            className="flex items-center gap-2 z-(--z-top)"
            onClick={handleLogoClick}
          >
            <Logo />
          </Link>

          <nav className="flex h-full items-center gap-4">
            <div className="hidden md:flex items-center gap-6 text-sm text-text-secondary">
              {NAV_ITEMS.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => handleNavClick(item.id)}
                  className="transition-colors hover:text-text-primary focus-visible:outline-none focus-visible:text-text-primary"
                >
                  {item.label}
                </button>
              ))}
            </div>

            <MobileNavMenu
              navItems={NAV_ITEMS}
              onNavigate={(id) => handleNavClick(id as NavItemId)}
              ctaHref="/configure/upload"
              ctaLabel="Create Your SpaceCase"
            />
          </nav>
        </div>
      </Container>
    </header>
  );
}
