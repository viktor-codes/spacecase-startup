"use client";

import React, { useState } from "react";

import Phone from "@/components/Phone";
import Image from "next/image";
type FloatingCaseProps = {
  imgSrc: string;
  className?: string;
};

export default function FloatingCase({ imgSrc, className }: FloatingCaseProps) {
  const [tilt, setTilt] = useState({ x: 0, y: 0 });

  const handleMouseMove = (event: React.MouseEvent<HTMLDivElement>) => {
    const rect = event.currentTarget.getBoundingClientRect();
    const x = (event.clientX - rect.left) / rect.width - 0.5;
    const y = (event.clientY - rect.top) / rect.height - 0.5;

    const rotateX = y * -10;
    const rotateY = x * 12;

    setTilt({ x: rotateX, y: rotateY });
  };

  const handleMouseLeave = () => {
    setTilt({ x: 0, y: 0 });
  };

  return (
    <div
      className={className}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      <div className="relative perspective-distant">
        <div className="pointer-events-none absolute inset-0 -z-10 blur-3xl">
          <div
            className="h-full w-full rounded-full bg-[radial-gradient(circle_at_30%_20%,#A855F7,transparent_60%),radial-gradient(circle_at_80%_80%,#38BDF8,transparent_55%)] opacity-60"
            style={{
              transform: `translate3d(${tilt.y * -1.5}px, ${
                tilt.x * -1.5
              }px, 0)`,
            }}
          />
        </div>

        <div
          className="transform transform-3d transition-transform duration-150 ease-out"
          style={{
            transform: `rotateX(${tilt.x}deg) rotateY(${tilt.y}deg) translateZ(16px)`,
          }}
        >
          {/* <Phone
            className="w-64 sm:w-72 drop-shadow-2xl"
            imgSrc={imgSrc}
            dark={true}
          /> */}
          <Image
            src="/try.svg"
            alt="phone template"
            width={300}
            height={300}
            className="animate-float"
          />
        </div>
      </div>
    </div>
  );
}
