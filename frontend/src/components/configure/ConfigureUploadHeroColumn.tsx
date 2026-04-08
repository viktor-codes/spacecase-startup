import { forwardRef } from "react";

import Phone from "@/components/Phone";
import { cn } from "@/lib/utils";

export type ConfigureUploadHeroColumnProps = {
  syncHighlight: boolean;
  /** NASA APOD image URL for the phone mockup, or null before a successful sync */
  phoneImageUrl: string | null;
};

const ConfigureUploadHeroColumn = forwardRef<
  HTMLDivElement,
  ConfigureUploadHeroColumnProps
>(function ConfigureUploadHeroColumn({ syncHighlight, phoneImageUrl }, ref) {
  return (
    <div ref={ref} className="flex flex-col lg:sticky lg:top-24 lg:self-start">
      <div
        className={cn(
          "relative flex w-full max-w-[280px] items-center justify-center self-center md:max-w-sm lg:self-start",
          syncHighlight && "animate-pulse",
        )}
      >
        <Phone
          imgSrc={phoneImageUrl}
          dark
          placeholderText="Pick a date to see your case…"
          className="rounded-[2.5rem] shadow-[0_40px_80px_rgba(0,0,0,0.65)]"
        />
      </div>
    </div>
  );
});

ConfigureUploadHeroColumn.displayName = "ConfigureUploadHeroColumn";

export default ConfigureUploadHeroColumn;
