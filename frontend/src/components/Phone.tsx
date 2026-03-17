import type { HTMLAttributes } from "react";

import { cn } from "@/lib/utils";

type PhoneProps = HTMLAttributes<HTMLDivElement> & {
  imgSrc?: string | null;
  dark?: boolean;
  placeholderText?: string;
};

export default function Phone(props: PhoneProps) {
  const {
    imgSrc,
    dark = false,
    placeholderText = "Waiting for your moment...",
    className,
    ...rest
  } = props;

  const frameSrc = dark
    ? "/phone-template-dark-edges-1.png"
    : "/phone-template-white-edges-1.png";

  const hasImage = Boolean(imgSrc);

  return (
    <div
      className={cn(
        "relative z-[var(--z-top)] overflow-hidden pointer-events-none rounded-4xl",
        className,
      )}
      {...rest}
    >
      <img
        src={frameSrc}
        className="pointer-events-none z-[var(--z-top)] select-none"
        alt="phone frame"
      />

      <div className="absolute inset-0 z-[var(--z-bottom)]">
        {hasImage ? (
          <img
            className="object-cover w-full h-full"
            src={imgSrc as string}
            alt="phone background"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-slate-950 via-slate-900 to-slate-800 grain-dark">
            <span className="px-6 text-center text-xs font-mono uppercase tracking-[0.25em] text-slate-300">
              {placeholderText}
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
