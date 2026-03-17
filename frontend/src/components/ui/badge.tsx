import type { HTMLAttributes, ReactNode } from "react";

import { cn } from "@/lib/utils";

type BadgeVariant = "subtle" | "outline";

type BadgeProps = {
  children: ReactNode;
  className?: string;
  variant?: BadgeVariant;
} & HTMLAttributes<HTMLSpanElement>;

const baseClasses =
  "inline-flex items-center gap-1 px-3 py-1 text-[8px] sm:text-xs font-technical tracking-[0.2em] uppercase";

const variantClasses: Record<BadgeVariant, string> = {
  subtle:
    "rounded-sm bg-white/5 border border-(--border-default) text-text-secondary",
  outline:
    "rounded-sm border border-(--border-subtle) text-text-tertiary bg-transparent",
};

export function Badge({
  children,
  className,
  variant = "subtle",
  ...rest
}: BadgeProps) {
  return (
    <span
      className={cn(baseClasses, variantClasses[variant], className)}
      {...rest}
    >
      {children}
    </span>
  );
}
