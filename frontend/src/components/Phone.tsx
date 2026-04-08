"use client";

import { useState, type HTMLAttributes } from "react";

import { cn } from "@/lib/utils";

type PhoneProps = HTMLAttributes<HTMLDivElement> & {
  imgSrc?: string | null;
  dark?: boolean;
  placeholderText?: string;
};

type PhoneScreenFillProps = {
  src: string;
  placeholderText: string;
};

/**
 * Isolated screen layer: remounts when `src` changes (parent key) so load
 * state resets without effects on the outer Phone shell.
 */
function PhoneScreenFill({ src, placeholderText }: PhoneScreenFillProps) {
  const [loaded, setLoaded] = useState(false);

  const bindScreenImageRef = (node: HTMLImageElement | null) => {
    // From cache, load may finish before `onLoad` is observable — same bug as missing onLoad after hard reload.
    if (node?.complete && node.naturalWidth > 0) {
      setLoaded(true);
    }
  };

  return (
    <>
      <div
        className={cn(
          "grain-dark absolute inset-0 flex h-full w-full items-center justify-center bg-linear-to-br from-slate-950 via-slate-900 to-slate-800 transition-opacity duration-300 ease-out",
          loaded ? "opacity-0" : "opacity-100",
        )}
        aria-hidden={loaded ? true : undefined}
      >
        <span className="px-6 text-center font-mono text-xs tracking-[0.25em] text-slate-300 uppercase">
          {placeholderText}
        </span>
      </div>
      <img
        ref={bindScreenImageRef}
        src={src}
        alt="phone background"
        className={cn(
          "absolute inset-0 h-full w-full object-cover transition-opacity duration-500 ease-out",
          loaded ? "opacity-100" : "opacity-0",
        )}
        onLoad={() => setLoaded(true)}
      />
    </>
  );
}

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
        "pointer-events-none relative z-(--z-top) overflow-hidden rounded-4xl",
        className,
      )}
      {...rest}
    >
      <img
        src={frameSrc}
        className="pointer-events-none z-(--z-top) select-none"
        alt="phone frame"
      />

      <div className="absolute inset-0 z-(--z-bottom)">
        {hasImage ? (
          <PhoneScreenFill
            key={imgSrc}
            src={imgSrc as string}
            placeholderText={placeholderText}
          />
        ) : (
          <div className="grain-dark flex h-full w-full items-center justify-center bg-linear-to-br from-slate-950 via-slate-900 to-slate-800">
            <span className="px-6 text-center font-mono text-xs tracking-[0.25em] text-slate-300 uppercase">
              {placeholderText}
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
