import type { ElementType, ReactNode } from "react"

import { cn } from "@/lib/utils"
import Container from "@/components/Container"

type SectionProps = {
  as?: ElementType
  children?: ReactNode
  className?: string
  containerClassName?: string
}

export default function Section({
  as: Tag = "section",
  children,
  className,
  containerClassName,
}: SectionProps) {
  return (
    <Tag className={cn("py-24", className)}>
      <Container className={containerClassName}>{children}</Container>
    </Tag>
  )
}

