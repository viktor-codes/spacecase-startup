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
  iconSize = 60,
}: LogoProps) {
  return (
    <span className={cn("select-none flex items-center gap-2", className)}>
      <span className="leading-none flex items-center">
        <Image
          src="/spacecasenewlogo.svg"
          alt="SpaceCase"
          width={iconSize}
          height={iconSize}
          className={cn("inline-block shrink-0", iconClassName)}
        />
      </span>

      <span
        className={cn(
          "font-display text-base font-bold tracking-tight leading-none text-text-primary uppercase flex items-center -ms-4",
          textClassName,
        )}
      >
        Space
        <span className="text-brand-pink">Case</span>
      </span>
    </span>
  );
}
