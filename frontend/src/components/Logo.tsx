import Image from "next/image"

import { cn } from "@/lib/utils"

type LogoProps = {
  className?: string
  textClassName?: string
  iconClassName?: string
  iconSize?: number
}

export default function Logo({
  className,
  textClassName,
  iconClassName,
  iconSize = 56,
}: LogoProps) {
  return (
    <span className={cn("select-none flex items-center justify-center", className)}>
      <span
        className={cn(
          "font-display text-base font-bold tracking-tight leading-none text-text-primary uppercase flex items-center",
          textClassName,
        )}
      >
        Space
        <span className="text-brand-pink flex items-center">
          <Image
            src="/spacecasenewlogo.png"
            alt="C"
            width={iconSize}
            height={iconSize}
            className={cn(
              "inline-block rotate-50 shrink-0 -ms-1 -me-3",
              iconSize === 56 ? "w-12 h-12" : null,
              iconClassName,
            )}
          />
          ase
        </span>
      </span>
    </span>
  )
}

