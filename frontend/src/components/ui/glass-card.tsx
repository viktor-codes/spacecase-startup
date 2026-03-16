import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const glassCardVariants = cva(
  [
    "relative rounded-2xl backdrop-blur-md overflow-hidden glass-shine",
    "border border-(--border-default)",
    "shadow-[inset_0_1px_0_0_rgba(255,255,255,0.07),inset_0_-1px_0_0_rgba(0,0,0,0.3)]",
  ].join(" "),
  {
    variants: {
      variant: {
        default: "bg-surface-card/80",
        elevated: [
          "bg-surface-card/90",
          "shadow-[inset_0_1px_0_0_rgba(255,255,255,0.07),inset_0_-1px_0_0_rgba(0,0,0,0.3),0_0_30px_-5px_var(--glow-pink)]",
        ].join(" "),
        interactive: [
          "bg-surface-card/80",
          "transition-all duration-300",
          "hover:bg-surface-card",
          "hover:shadow-[inset_0_1px_0_0_rgba(255,255,255,0.12),inset_0_-1px_0_0_rgba(0,0,0,0.3),0_0_40px_-5px_var(--glow-pink)]",
          "hover:border-(--border-vivid)",
        ].join(" "),
      },
    },
    defaultVariants: { variant: "default" },
  },
);

type GlassCardProps = React.HTMLAttributes<HTMLDivElement> &
  VariantProps<typeof glassCardVariants>;

const GlassCard = React.forwardRef<HTMLDivElement, GlassCardProps>(
  ({ className, variant, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(glassCardVariants({ variant }), className)}
      {...props}
    />
  ),
);
GlassCard.displayName = "GlassCard";

export { GlassCard, glassCardVariants };
