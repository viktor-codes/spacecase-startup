"use client";

import { motion } from "framer-motion";
import type { ReactNode } from "react";

type ConfigureRevealPanelProps = {
  children: ReactNode;
};

/**
 * Entrance for sections that unlock after the first tier (smooth reveal from below).
 */
export default function ConfigureRevealPanel({
  children,
}: ConfigureRevealPanelProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.38, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}
