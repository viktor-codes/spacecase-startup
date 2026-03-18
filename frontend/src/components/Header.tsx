"use client";

import { Menu, X, ArrowRight } from "lucide-react";
import { useCallback, useEffect, useState, useRef } from "react";
import Link from "next/link";

import Container from "@/components/Container";
import Logo from "@/components/Logo";
import { buttonVariants } from "@/components/ui/button";

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
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement | null>(null);
  const triggerRef = useRef<HTMLButtonElement | null>(null);

  const closeMenu = useCallback(() => {
    setIsOpen(false);
    if (triggerRef.current) {
      triggerRef.current.focus();
    }
  }, []);

  useEffect(() => {
    if (!isOpen) return;

    function handleClickOutside(event: MouseEvent | TouchEvent) {
      if (!menuRef.current) return;
      if (
        event.target instanceof Node &&
        (menuRef.current.contains(event.target) ||
          triggerRef.current?.contains(event.target))
      ) {
        return;
      }
      closeMenu();
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        event.preventDefault();
        closeMenu();
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("touchstart", handleClickOutside);
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("touchstart", handleClickOutside);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [closeMenu, isOpen]);

  useEffect(() => {
    if (typeof document === "undefined") return;
    if (isOpen) {
      const previousOverflow = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = previousOverflow;
      };
    }
  }, [isOpen]);

  const handleNavClick = useCallback(
    (id: NavItemId) => {
      if (window.location.pathname === "/") {
        scrollToSection(id);
      } else {
        window.location.href = `/#${id}`;
      }
      closeMenu();
    },
    [closeMenu],
  );

  return (
    <header className="sticky top-0 inset-x-0 z-(--z-header) bg-transparent backdrop-blur-lg transition-all">
      <Container>
        <div className="flex h-14 items-center justify-between">
          <Link href="/" className="flex items-center gap-2 z-(--z-top)">
            <Logo />
          </Link>

          <nav className="flex h-full items-center gap-4">
            <div className="hidden sm:flex items-center gap-6 text-sm text-text-secondary">
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

            <button
              ref={triggerRef}
              type="button"
              aria-label={isOpen ? "Закрыть навигацию" : "Открыть навигацию"}
              aria-expanded={isOpen}
              aria-controls="main-nav-dropdown"
              className="flex items-center justify-center rounded-full p-2 text-text-secondary hover:text-text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--color-ring) sm:hidden"
              onClick={() => setIsOpen((prev) => !prev)}
            >
              {isOpen ? (
                <X className="h-5 w-5" />
              ) : (
                <Menu className="h-5 w-5" />
              )}
            </button>
          </nav>
        </div>

        {isOpen && (
          <div
            id="main-nav-dropdown"
            ref={menuRef}
            className="sm:hidden mt-2 rounded-2xl border border-(--border-subtle) bg-surface-overlay/80 backdrop-blur-xl shadow-lg px-3 py-2 z-(--z-top)"
          >
            <div className="flex flex-col gap-1">
              {NAV_ITEMS.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => handleNavClick(item.id)}
                  className="flex w-full items-center justify-between rounded-xl px-3 py-2.5 text-sm text-text-secondary hover:text-text-primary hover:bg-surface-raised transition-colors"
                >
                  <span>{item.label}</span>
                </button>
              ))}
            </div>

            <div className="mt-3 border-t border-(--border-subtle) pt-3">
              <button
                type="button"
                onClick={() => {
                  window.location.href = "/configure/upload";
                  closeMenu();
                }}
                className={buttonVariants({
                  variant: "space",
                  size: "sm",
                  className:
                    "w-full justify-center items-center gap-1.5 shadow-[0_0_24px_rgba(140,86,253,0.45)]",
                })}
              >
                Create Your SpaceCase
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        )}
      </Container>
    </header>
  );
}
