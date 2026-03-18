"use client";

import { ArrowRight, Menu, X } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

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

// Константы для анимации
const menuVariants = {
  closed: {
    opacity: 0,
    scale: 0.95,
    y: -10,
    transition: {
      when: "afterChildren",
      staggerChildren: 0.05,
      staggerDirection: -1,
    },
  },
  open: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: {
      when: "beforeChildren",
      staggerChildren: 0.08,
      duration: 0.3,
      // Типы Framer Motion немного капризные к типу easing.
      ease: [0.23, 1, 0.32, 1] as const,
    },
  },
};

const itemVariants = {
  closed: { opacity: 0, x: -10 },
  open: { opacity: 1, x: 0 },
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

  useEffect(() => {
    if (!isOpen) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [isOpen]);

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

  return (
    <div className="relative">
      <button
        ref={triggerRef}
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        aria-label={isOpen ? "Закрыть навигацию" : "Открыть навигацию"}
        aria-expanded={isOpen}
        aria-controls="main-nav-dropdown"
        className="relative z-(--z-dropdown) flex h-10 w-10 items-center justify-center rounded-xl bg-surface-raised/50 border border-white/10 text-text-secondary active:scale-90 transition-transform sm:hidden"
      >
        <AnimatePresence mode="wait">
          {isOpen ? (
            <motion.div
              key="x"
              initial={{ rotate: -90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: 90, opacity: 0 }}
            >
              <X className="h-5 w-5 text-brand-pink" />
            </motion.div>
          ) : (
            <motion.div
              key="menu"
              initial={{ rotate: 90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: -90, opacity: 0 }}
            >
              <Menu className="h-5 w-5" />
            </motion.div>
          )}
        </AnimatePresence>
      </button>

      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              ref={menuRef}
              variants={menuVariants}
              initial="closed"
              animate="open"
              exit="closed"
              className="absolute top-[calc(100%+12px)] right-0 w-[calc(100vw-32px)] origin-top-right overflow-hidden rounded-2xl border border-white/10 bg-slate-950 p-2 shadow-[0_20px_40px_rgba(0,0,0,0.7)] backdrop-blur-xl z-(--z-dropdown)"
            >
              <div className="flex flex-col gap-1 p-2">
                {navItems.map((item, index) => (
                  <motion.button
                    key={item.id}
                    variants={itemVariants}
                    onClick={() => {
                      onNavigate(item.id);
                      setIsOpen(false);
                    }}
                    className="group relative flex items-center justify-between rounded-xl px-4 py-4 text-left transition-colors hover:bg-white/5"
                  >
                    <div className="flex items-center gap-4">
                      {/* Номер пункта в стиле HUD */}
                      <span className="font-technical text-[10px] text-brand-pink/50">
                        0{index + 1}
                      </span>
                      <span className="font-technical text-xs uppercase tracking-widest text-text-secondary group-hover:text-text-primary">
                        {item.label}
                      </span>
                    </div>
                    <ArrowRight className="h-3 w-3 -translate-x-2 opacity-0 transition-all group-hover:translate-x-0 group-hover:opacity-100 text-brand-pink" />

                    {/* Тонкая линия-разделитель снизу */}
                    <div className="absolute bottom-0 left-4 right-4 h-[1px] bg-white/5" />
                  </motion.button>
                ))}
              </div>

              <motion.div variants={itemVariants} className="mt-2 p-2 pt-0">
                <button
                  onClick={() => {
                    window.location.href = ctaHref;
                    setIsOpen(false);
                  }}
                  className={buttonVariants({
                    variant: "space",
                    className:
                      "w-full h-14 justify-center gap-2 rounded-xl text-xs font-bold tracking-widest uppercase shadow-[0_0_30px_rgba(140,86,253,0.3)]",
                  })}
                >
                  {ctaLabel}
                  <ArrowRight className="h-4 w-4" />
                </button>

                {/* Техническая приписка внизу */}
                <div className="mt-4 text-center">
                  <span className="font-technical text-[8px] uppercase tracking-[0.2em] text-text-tertiary/40">
                    System Status: Connected // Node: Orbit-1
                  </span>
                </div>
              </motion.div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
