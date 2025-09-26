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
        // structure générale
        "inline-flex items-center gap-2 rounded-xl border px-3 py-2 text-sm font-medium shadow-sm",
        // couleurs via tokens
        "bg-[var(--primary)] text-[var(--primary-foreground)] border-[var(--border)]",
        // focus/interaction
        "focus:outline-none focus-visible:ring-4 focus-visible:ring-[var(--ring)]",
        className,
      ].join(" ")}
    >
      <span className="tabular-nums">{pixels.toLocaleString()}</span>
      <span className="opacity-80">pixels</span>
    </div>
  );
}
