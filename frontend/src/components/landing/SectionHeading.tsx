import { type ElementType, type ReactNode } from "react";

import { cn } from "@/lib/utils";

type SectionHeadingAlign = "center" | "left";

type SectionHeadingProps = {
  kicker?: ReactNode;
  title: ReactNode;
  subtitle?: ReactNode;
  titleAs?: ElementType;
  align?: SectionHeadingAlign;
  className?: string;
  titleClassName?: string;
  subtitleClassName?: string;
  kickerClassName?: string;
  containerClassName?: string;
};

const alignClassName: Record<SectionHeadingAlign, string> = {
  center: "text-center mx-auto",
  left: "text-left",
};

export default function SectionHeading({
  kicker,
  title,
  subtitle,
  titleAs,
  align = "center",
  className,
  titleClassName,
  subtitleClassName,
  kickerClassName,
  containerClassName,
}: SectionHeadingProps) {
  const alignClasses = alignClassName[align];
  const TitleTag = titleAs ?? "h2";

  return (
    <div
      className={cn(
        "px-6 lg:px-8",
        align === "center" ? "mx-auto" : null,
        containerClassName ?? "max-w-4xl",
        alignClasses,
        className,
      )}
    >
      {kicker ? (
        <p
          className={cn(
            "text-sm font-semibold uppercase tracking-[0.2em] text-text-secondary",
            kickerClassName ?? "font-technical",
          )}
        >
          {kicker}
        </p>
      ) : null}

      <TitleTag
        className={cn(
          "mt-4 tracking-tight text-balance leading-tight! font-bold text-5xl md:text-6xl text-text-primary font-display",
          titleClassName,
        )}
      >
        {title}
      </TitleTag>

      {subtitle ? (
        <p
          className={cn(
            "mt-4 text-base md:text-lg text-text-secondary font-display",
            subtitleClassName,
          )}
        >
          {subtitle}
        </p>
      ) : null}
    </div>
  );
}
