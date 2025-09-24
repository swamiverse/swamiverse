"use client";

import { useState } from "react";
import { MessageCircle, X } from "lucide-react";

// ⚠️ export nommé (pas de default)
export function SwamiBotFloating() {
  const [open, setOpen] = useState(false);

  return (
    <div className="pointer-events-none fixed bottom-5 right-5 z-50">
      {open && (
        <div
          className="pointer-events-auto mb-3 w-[320px] overflow-hidden rounded-2xl border
                        border-zinc-200 bg-white text-zinc-900 shadow-2xl
                        dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-50"
        >
          <div
            className="flex items-center justify-between border-b border-zinc-200 p-3 text-sm
                          dark:border-zinc-800"
          >
            <span className="font-semibold">SwamiBot</span>
            <button
              onClick={() => setOpen(false)}
              className="rounded-md p-1 text-zinc-500 hover:bg-zinc-100 hover:text-zinc-900
                         dark:hover:bg-zinc-900 dark:hover:text-zinc-100"
              aria-label="Fermer SwamiBot"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
          <div className="max-h-64 overflow-auto p-3 text-sm">
            <p className="text-zinc-600 dark:text-zinc-300">
              Yo ! Ici le bot. Placeholder — UI à brancher plus tard.
            </p>
          </div>
        </div>
      )}

      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="pointer-events-auto inline-flex items-center gap-2 rounded-2xl
                   bg-gradient-to-br from-yellow-300 to-amber-400 px-4 py-3 font-semibold text-black
                   shadow-lg ring-2 ring-yellow-200/60 transition hover:shadow-yellow-300/40
                   focus:outline-none focus-visible:ring-4 focus-visible:ring-yellow-400/70"
        aria-label="Ouvrir SwamiBot"
      >
        <MessageCircle className="h-5 w-5" />
        SwamiBot
      </button>
    </div>
  );
}
