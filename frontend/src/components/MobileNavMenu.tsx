"use client";

import { ArrowRight, Menu, X } from "lucide-react";
import { useCallback, useLayoutEffect, useRef, useState } from "react";

import { buttonVariants } from "@/components/ui/button";

type NavItem = {
  id: string;
  label: string;
};

type MobileNavMenuProps = {
  navItems: readonly NavItem[];
  onNavigate: (id: string) => void;
  ctaHref: string;
  ctaLabel: string;
};

export default function MobileNavMenu({
  navItems,
  onNavigate,
  ctaHref,
  ctaLabel,
}: MobileNavMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement | null>(null);
  const triggerRef = useRef<HTMLButtonElement | null>(null);

  const closeMenu = useCallback(() => {
    setIsOpen(false);
    triggerRef.current?.focus();
  }, []);

  useLayoutEffect(() => {
    if (!isOpen) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [isOpen]);

  useLayoutEffect(() => {
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

  const handleItemClick = useCallback(
    (id: string) => {
      onNavigate(id);
      closeMenu();
    },
    [closeMenu, onNavigate],
  );

  return (
    <>
      <button
        ref={triggerRef}
        type="button"
        aria-label={isOpen ? "Закрыть навигацию" : "Открыть навигацию"}
        aria-expanded={isOpen}
        aria-controls="main-nav-dropdown"
        className="flex items-center justify-center rounded-full p-2 text-text-secondary hover:text-text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--color-ring) sm:hidden"
        onClick={() => setIsOpen((prev) => !prev)}
      >
        {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
      </button>

      {isOpen && (
        <div
          id="main-nav-dropdown"
          ref={menuRef}
          className="sm:hidden absolute top-full right-0 left-0 mt-2 rounded-2xl border border-(--border-subtle) bg-surface-overlay/95 shadow-lg px-3 py-2 z-(--z-top)"
        >
          <div className="flex flex-col gap-1">
            {navItems.map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => handleItemClick(item.id)}
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
                window.location.href = ctaHref;
                closeMenu();
              }}
              className={buttonVariants({
                variant: "space",
                size: "sm",
                className:
                  "w-full justify-center items-center gap-1.5 shadow-[0_0_24px_rgba(140,86,253,0.45)]",
              })}
            >
              {ctaLabel}
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}
    </>
  );
}

