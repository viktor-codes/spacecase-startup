import type { ElementType, ReactNode } from "react"

import { cn } from "@/lib/utils"
import Container from "@/components/Container"

type SectionProps = {
  as?: ElementType
  children?: ReactNode
  className?: string
  containerClassName?: string
  grain?: boolean
}

export default function Section({
  as: Tag = "section",
  children,
  className,
  containerClassName,
  grain = false,
}: SectionProps) {
  return (
    <Tag className={cn("relative py-24", className)}>
      {grain && (
        <div
          className="pointer-events-none absolute inset-0 bg-[url('/grain.png')] bg-repeat opacity-[0.03] mix-blend-soft-light"
          aria-hidden="true"
        />
      )}
      <Container className={cn("relative z-10", containerClassName)}>
        {children}
      </Container>
    </Tag>
  )
}

