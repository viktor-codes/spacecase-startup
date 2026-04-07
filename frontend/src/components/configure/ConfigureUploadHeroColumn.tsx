import { AnimatePresence, motion } from "framer-motion";

import Phone from "@/components/Phone";
import { cn } from "@/lib/utils";

export type ConfigureUploadHeroColumnProps = {
  syncHighlight: boolean;
  /** NASA APOD image URL for the phone mockup, or null before a successful sync */
  phoneImageUrl: string | null;
};

export default function ConfigureUploadHeroColumn({
  syncHighlight,
  phoneImageUrl,
}: ConfigureUploadHeroColumnProps) {
  return (
    <div className="flex flex-col gap-10 lg:sticky lg:top-24 lg:self-start">
      <div className="max-w-xl">
        <h1 className="text-2xl font-bold tracking-tight text-foreground md:text-3xl lg:text-4xl">
          Configure Your CosmicCase
        </h1>
      </div>

      <div
        className={cn(
          "relative flex max-w-[280px] items-center justify-center md:max-w-sm",
          syncHighlight && "animate-pulse",
        )}
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={phoneImageUrl ?? "placeholder"}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            className="flex w-full items-center justify-center"
          >
            <Phone
              imgSrc={phoneImageUrl}
              dark
              placeholderText="Your sky is waiting..."
              className="rounded-[3.5rem] shadow-[0_40px_80px_rgba(0,0,0,0.65)]"
            />
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
