"use client";

import { useRef } from "react";
import { motion } from "framer-motion";
import { SlotSymbol } from "@/components/casino/casino-utils";

export default function Reel({
  symbol,
  spinning,
  index,
}: {
  symbol: SlotSymbol;
  spinning: boolean;
  index: number;
}) {
  const ref = useRef<HTMLDivElement | null>(null);

  return (
    <div className="relative aspect-[1/1] select-none overflow-hidden rounded-2xl border border-zinc-300 bg-white text-6xl dark:border-zinc-800 dark:bg-gradient-to-b dark:from-zinc-950 dark:to-zinc-900">
      <motion.div
        ref={ref}
        aria-live="polite"
        role="img"
        className="flex h-full items-center justify-center"
        animate={spinning ? { rotateX: [0, 360] } : { rotateX: 0 }}
        transition={
          spinning
            ? { repeat: 3 + index, duration: 0.35, ease: "easeInOut" }
            : { duration: 0.2 }
        }
        style={{ transformStyle: "preserve-3d" }}
      >
        <span className="drop-shadow-[0_2px_6px_rgba(255,255,255,0.07)]">
          {symbol.label}
        </span>
      </motion.div>
    </div>
  );
}
