import Image from "next/image";

import { cn } from "@/lib/utils";

type LogoProps = {
  className?: string;
  textClassName?: string;
  iconClassName?: string;
  iconSize?: number;
};

export default function Logo({
  className,
  textClassName,
  iconClassName,
  iconSize = 36,
}: LogoProps) {
  return (
    <span className={cn("flex items-center gap-2 select-none", className)}>
      <span className="flex items-center leading-none">
        {/* <Image
          src="/cosmiccase-logo.svg"
          alt="CosmicCase"
          width={iconSize}
          height={iconSize}
          className={cn("inline-block shrink-0", iconClassName)}
        /> */}
      </span>

      <span
        className={cn(
          "font-technical flex items-center text-base leading-none font-bold tracking-tight text-text-primary uppercase",
          textClassName,
        )}
      >
        Cosmic
        <span className="ms-0.5 text-brand-pink">Case</span>
      </span>
    </span>
  );
}
