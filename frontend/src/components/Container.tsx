import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

type ContainerProps = {
  children?: ReactNode;
  className?: string;
};

export default function Container({ children, className }: ContainerProps) {
  return (
    <div
      className={cn(
        "mx-auto w-full max-w-7xl px-2.5 md:px-10 lg:px-20 h-full",
        className,
      )}
    >
      {children}
    </div>
  );
}
