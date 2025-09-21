"use client";
import React from "react";
import { usePixels } from "@/components/pixels-provider";

export default function PixelCounter({
  className = "",
}: {
  className?: string;
}) {
  const { pixels } = usePixels();

  return (
    <div
      aria-label={`Solde de pixels : ${pixels}`}
      className={[
        // mêmes radius et padding que tes autres boutons
        "inline-flex items-center gap-2 rounded-xl border px-3 py-2 text-sm font-medium shadow-sm",
        // contraste marqué pour être bien visible
        "bg-yellow-400 text-black border-yellow-300",
        "dark:bg-yellow-300 dark:text-black dark:border-yellow-200",
        "focus:outline-none focus-visible:ring-4 focus-visible:ring-yellow-200/50",
        className,
      ].join(" ")}
    >
      <span className="tabular-nums">{pixels.toLocaleString()}</span>
      <span className="opacity-80">pixels</span>
    </div>
  );
}
