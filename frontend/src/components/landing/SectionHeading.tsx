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
  const isHeroH1 = TitleTag === "h1";

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
          "mt-4 tracking-tight text-balance leading-tight! font-bold text-text-primary font-display max-w-xl lg:max-w-none mx-auto",
          isHeroH1
            ? "text-[clamp(3.5rem,8vw,6rem)]"
            : "text-[clamp(2.5rem,5vw,4.5rem)]",
        )}
      >
        {title}
      </TitleTag>

      {subtitle ? (
        <p
          className={cn(
            "mt-4 text-[clamp(1rem,1.2vw,1.25rem)] text-text-secondary font-display max-w-md lg:max-w-lg mx-auto text-balance",
            subtitleClassName,
          )}
        >
          {subtitle}
        </p>
      ) : null}
    </div>
  );
}
