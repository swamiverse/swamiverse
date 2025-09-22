"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight, Film } from "lucide-react";
import PosterDialog from "@/components/flix/poster-dialog";
import type { Poster } from "@/types/flix";

type Props = { posters: Poster[] };

export default function FlixClient({ posters }: Props) {
  const updated = new Date().toISOString().slice(0, 10);
  const [indexMap, setIndexMap] = useState<Record<string, number>>({});
  const [selected, setSelected] = useState<Poster | null>(null);

  // Grouper par catégorie
  const grouped = posters.reduce<Record<string, Poster[]>>((acc, p) => {
    acc[p.category] = acc[p.category] || [];
    acc[p.category].push(p);
    return acc;
  }, {});

  // Scroll logique
  const scroll = (category: string, dir: "left" | "right") => {
    const max = (grouped[category]?.length || 0) - 4;
    setIndexMap((prev) => {
      const current = prev[category] || 0;
      let next = dir === "left" ? current - 1 : current + 1;
      if (next < 0) next = 0;
      if (next > max) next = max;
      return { ...prev, [category]: next };
    });
  };

  return (
    <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
      {/* Header */}
      <header className="mb-8 flex items-end justify-between gap-3">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-zinc-100 flex items-center gap-2">
            <Film className="h-7 w-7 text-red-500" />
            SwamiFlix
          </h1>
          <p className="text-sm text-zinc-400">
            Affiches IA & faux films — classés par catégorie.
          </p>
        </div>
        <span className="hidden text-xs text-zinc-500 sm:inline">
          💾 Page générée depuis SwamiVerse DB — MAJ : {updated}
        </span>
      </header>

      {/* Catégories */}
      {Object.entries(grouped).map(([category, items]) => {
        const index = indexMap[category] || 0;
        const visible = items.slice(index, index + 4);

        return (
          <section key={category} className="mt-6">
            <h2 className="text-2xl font-semibold mb-4 text-zinc-200">
              {category}
            </h2>

            <div className="relative flex items-center">
              {/* Flèche gauche */}
              <button
                onClick={() => scroll(category, "left")}
                className="absolute -left-10 z-10 rounded-full bg-black/60 p-2 text-white hover:bg-black/80"
              >
                <ChevronLeft className="h-6 w-6" />
              </button>

              {/* 4 affiches fixes */}
              <div className="grid grid-cols-4 gap-6 w-full">
                {visible.map((poster) => (
                  <motion.article
                    key={poster.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.35 }}
                    className="group relative overflow-hidden rounded-xl border shadow-lg cursor-pointer"
                    style={{
                      borderColor: "var(--border)",
                      background: "var(--card)",
                    }}
                    onClick={() => setSelected(poster)}
                  >
                    <div className="relative aspect-[2/3]">
                      <img
                        src={poster.image}
                        alt={poster.title}
                        className="w-full h-full object-cover transition group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent opacity-90" />
                      <div className="absolute bottom-0 p-3">
                        <div className="flex items-center gap-2">
                          <span className="rounded-md bg-zinc-900/70 px-2 py-0.5 text-[11px] font-medium text-zinc-200 ring-1 ring-white/10">
                            {poster.category}
                          </span>
                          {poster.year && (
                            <span className="text-[11px] text-zinc-400">
                              {poster.year}
                            </span>
                          )}
                          {typeof poster.rating === "number" && (
                            <span className="ms-auto rounded-md bg-yellow-300 px-1.5 py-0.5 text-[11px] font-semibold text-black">
                              {poster.rating.toFixed(1)}
                            </span>
                          )}
                        </div>
                        <h3 className="mt-2 line-clamp-1 text-sm font-semibold text-zinc-100">
                          {poster.title}
                        </h3>
                        {poster.synopsis && (
                          <p className="mt-1 line-clamp-2 text-xs text-zinc-300 opacity-0 transition group-hover:opacity-100">
                            {poster.synopsis}
                          </p>
                        )}
                        <button
                          className="mt-3 hidden w-full items-center justify-center gap-2 rounded-xl bg-yellow-300 py-2 text-sm font-semibold text-black shadow-sm transition group-hover:flex"
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelected(poster);
                          }}
                        >
                          ▶︎ Lire la fiche
                        </button>
                      </div>
                    </div>
                  </motion.article>
                ))}
              </div>

              {/* Flèche droite */}
              <button
                onClick={() => scroll(category, "right")}
                className="absolute -right-10 z-10 rounded-full bg-black/60 p-2 text-white hover:bg-black/80"
              >
                <ChevronRight className="h-6 w-6" />
              </button>
            </div>
          </section>
        );
      })}

      {/* Footer mobile */}
      <footer className="mt-8 text-xs text-zinc-500 sm:hidden">
        💾 Page générée depuis SwamiVerse DB — MAJ : {updated}
      </footer>

      {/* Modal */}
      <PosterDialog
        open={!!selected}
        onOpenChange={(o) => !o && setSelected(null)}
        poster={selected}
      />
    </main>
  );
}
