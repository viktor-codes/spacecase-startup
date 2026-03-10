import type { HTMLAttributes } from "react";

import { cn } from "@/lib/utils";

type PhoneProps = HTMLAttributes<HTMLDivElement> & {
  imgSrc: string;
  dark?: boolean;
};

export default function Phone(props: PhoneProps) {
  const { imgSrc, dark = false, className, ...rest } = props;

  const frameSrc = dark
    ? "/phone-template-dark-edges-1.png"
    : "/phone-template-white-edges-1.png";

  return (
    <div
      className={cn(
        "relative z-50 overflow-hidden pointer-events-none rounded-4xl",
        className,
      )}
      {...rest}
    >
      <img
        src={frameSrc}
        className="pointer-events-none z-50 select-none"
        alt="phone frame"
      />

      <div className="absolute inset-0 -z-10">
        <img
          className="object-cover w-full h-full"
          src={imgSrc}
          alt="phone background"
        />
      </div>
    </div>
  );
}
