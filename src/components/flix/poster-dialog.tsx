"use client";

import Image from "next/image";
import { useEffect } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { X, Star } from "lucide-react";
import type { Poster } from "@/types/flix";

export type PosterDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  poster?: Poster | null;
};

export default function PosterDialog({
  open,
  onOpenChange,
  poster,
}: PosterDialogProps) {
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (!open) return;
      if (e.key.toLowerCase() === "l") onOpenChange(false);
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onOpenChange]);

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-40 bg-black/70" />
        <Dialog.Content
          className="fixed left-1/2 top-1/2 z-50 w-[95vw] max-w-3xl -translate-x-1/2 -translate-y-1/2 rounded-2xl border border-zinc-800 bg-zinc-900/95 p-4 text-zinc-100 shadow-2xl backdrop-blur-md focus:outline-none"
          aria-describedby={undefined}
        >
          {/* Header */}
          <div className="mb-3 flex items-center justify-between gap-3">
            <Dialog.Title className="text-xl font-semibold">
              {poster?.title ?? "Affiche"}
            </Dialog.Title>
            <Dialog.Close asChild>
              <button
                className="inline-flex h-9 w-9 items-center justify-center rounded-xl text-zinc-400 hover:text-zinc-100 focus:outline-none"
                aria-label="Fermer"
              >
                <X className="h-5 w-5" />
              </button>
            </Dialog.Close>
          </div>

          {/* Body */}
          <div className="grid gap-4 md:grid-cols-2">
            {/* Image */}
            <div className="relative aspect-[2/3] w-full overflow-hidden rounded-2xl ring-1 ring-zinc-800">
              {poster?.image && (
                <Image
                  src={poster.image}
                  alt={`Affiche — ${poster.title}`}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 50vw"
                  priority
                />
              )}
            </div>

            {/* Infos */}
            <div className="flex min-h-0 flex-col gap-3">
              <div className="flex flex-wrap items-center gap-2">
                {poster?.category && (
                  <span className="rounded-full bg-zinc-800 px-2 py-1 text-xs text-zinc-200">
                    {poster.category}
                  </span>
                )}
                {typeof poster?.year === "number" && (
                  <span className="rounded-full border border-zinc-700 px-2 py-1 text-xs text-zinc-300">
                    {poster.year}
                  </span>
                )}
                {typeof poster?.rating === "number" && (
                  <span className="inline-flex items-center gap-1 rounded-full bg-zinc-800 px-2 py-1 text-xs text-zinc-200">
                    <Star className="h-3.5 w-3.5" />
                    {poster.rating.toFixed(1)}
                  </span>
                )}
              </div>

              {poster?.synopsis && (
                <p className="text-sm leading-relaxed text-zinc-300">
                  {poster.synopsis}
                </p>
              )}
            </div>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
