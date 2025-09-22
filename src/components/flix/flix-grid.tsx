"use client";

import { useMemo, useRef, useState, useEffect } from "react";
import Image from "next/image";
import type { Poster } from "@/types/flix";
import PosterDialog from "@/components/flix/poster-dialog";

export type FlixGridProps = { posters?: Poster[] };

export default function FlixGrid({ posters = [] }: FlixGridProps) {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<string>("Toutes");
  const [sort, setSort] = useState<string>("Popularité");
  const inputRef = useRef<HTMLInputElement | null>(null);

  // État du modal "Lire l'affiche"
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState<Poster | null>(null);

  const categories = useMemo(() => {
    const cats = Array.from(new Set(posters.map((p) => p.category)));
    return ["Toutes", ...cats];
  }, [posters]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    let list = posters.filter((p) =>
      q
        ? p.title.toLowerCase().includes(q) ||
          (p.synopsis ?? "").toLowerCase().includes(q)
        : true
    );
    if (category !== "Toutes")
      list = list.filter((p) => p.category === category);
    if (sort === "Année ↓")
      list = [...list].sort((a, b) => (b.year ?? 0) - (a.year ?? 0));
    if (sort === "Année ↑")
      list = [...list].sort((a, b) => (a.year ?? 0) - (b.year ?? 0));
    if (sort === "Note ↓")
      list = [...list].sort((a, b) => (b.rating ?? 0) - (a.rating ?? 0));
    return list;
  }, [posters, query, category, sort]);

  // Raccourci "/" pour focus search
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "/" && !e.metaKey && !e.ctrlKey && !e.altKey) {
        e.preventDefault();
        inputRef.current?.focus();
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  function openPoster(p: Poster) {
    setSelected(p);
    setOpen(true);
  }

  return (
    <section>
      {/* Filtres */}
      <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-2">
          <div className="relative">
            <input
              ref={inputRef}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Rechercher un titre (/)"
              className="w-64 rounded-xl border border-white/10 bg-zinc-900 px-9 py-2 text-sm text-zinc-100 placeholder-zinc-500 outline-none ring-0 transition focus:border-yellow-300/40 focus:bg-zinc-900/90"
            />
            <svg
              className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400"
              viewBox="0 0 24 24"
              aria-hidden
            >
              <path
                d="M11 4a7 7 0 105.292 12.292l3.707 3.707 1.414-1.414-3.707-3.707A7 7 0 0011 4z"
                fill="currentColor"
                fillRule="evenodd"
              />
            </svg>
          </div>

          <div className="hidden gap-2 sm:flex">
            {categories.map((c) => (
              <button
                key={c}
                onClick={() => setCategory(c)}
                className={[
                  "rounded-xl border px-3 py-2 text-sm transition",
                  category === c
                    ? "border-yellow-400/60 bg-yellow-300 text-black"
                    : "border-white/10 bg-zinc-900 text-zinc-300 hover:bg-zinc-800",
                ].join(" ")}
                aria-pressed={category === c}
              >
                {c}
              </button>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-2">
          <label className="text-xs text-zinc-400" htmlFor="sorter">
            Trier
          </label>
          <select
            id="sorter"
            value={sort}
            onChange={(e) => setSort(e.target.value)}
            className="rounded-xl border border-white/10 bg-zinc-900 px-3 py-2 text-sm text-zinc-100"
          >
            <option>Popularité</option>
            <option>Année ↓</option>
            <option>Année ↑</option>
            <option>Note ↓</option>
          </select>
        </div>
      </div>

      {/* Catégories mobile */}
      <div className="mb-4 flex gap-2 overflow-x-auto sm:hidden">
        {categories.map((c) => (
          <button
            key={c}
            onClick={() => setCategory(c)}
            className={[
              "whitespace-nowrap rounded-xl border px-3 py-2 text-sm",
              category === c
                ? "border-yellow-400/60 bg-yellow-300 text-black"
                : "border-white/10 bg-zinc-900 text-zinc-300",
            ].join(" ")}
            aria-pressed={category === c}
          >
            {c}
          </button>
        ))}
      </div>

      {/* Grid */}
      <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
        {filtered.map((p) => (
          <li key={p.id} className="group relative">
            <article
              className="overflow-hidden rounded-2xl border border-white/10 bg-zinc-950 focus:outline-none"
              role="button"
              tabIndex={0}
              onClick={() => openPoster(p)}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  openPoster(p);
                }
              }}
              aria-label={`Ouvrir la fiche de ${p.title}`}
            >
              <div className="relative aspect-[2/3]">
                <Image
                  src={p.image}
                  alt={p.title}
                  fill
                  className="object-cover transition duration-300 group-hover:scale-[1.03]"
                  sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
                />
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent opacity-90" />
              </div>
              <div className="absolute inset-x-0 bottom-0 z-10 p-3">
                <div className="flex items-center gap-2">
                  <span className="rounded-md bg-zinc-900/70 px-2 py-0.5 text-[11px] font-medium text-zinc-200 ring-1 ring-white/10">
                    {p.category}
                  </span>
                  {p.year && (
                    <span className="text-[11px] text-zinc-400">{p.year}</span>
                  )}
                  {typeof p.rating === "number" && (
                    <span className="ms-auto rounded-md bg-yellow-300 px-1.5 py-0.5 text-[11px] font-semibold text-black">
                      {p.rating.toFixed(1)}
                    </span>
                  )}
                </div>
                <h3 className="mt-2 line-clamp-1 text-sm font-semibold text-zinc-100">
                  {p.title}
                </h3>
                {p.synopsis && (
                  <p className="mt-1 line-clamp-2 text-xs text-zinc-300 opacity-0 transition group-hover:opacity-100">
                    {p.synopsis}
                  </p>
                )}
                <button
                  className="mt-3 hidden w-full items-center justify-center gap-2 rounded-xl bg-yellow-300 py-2 text-sm font-semibold text-black shadow-sm transition group-hover:flex"
                  aria-label={`Lire la fiche de ${p.title}`}
                  onClick={(e) => {
                    e.stopPropagation();
                    openPoster(p);
                  }}
                >
                  ▶︎ Lire la fiche
                </button>
              </div>
            </article>
          </li>
        ))}
      </ul>

      {/* Pubs fun */}
      <div className="mt-8 grid gap-3 sm:grid-cols-2">
        <AdCard
          headline="⚠️ Promo : 1 bug acheté = 2 offerts"
          sub="Seulement jusqu'à la prochaine regression."
        />
        <AdCard
          headline="Pixel premium : brille mieux la nuit"
          sub="Certifié par le Syndicat des Lucioles."
        />
      </div>

      {/* Modal */}
      <PosterDialog open={open} onOpenChange={setOpen} poster={selected} />
    </section>
  );
}

function AdCard({ headline, sub }: { headline: string; sub: string }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-gradient-to-br from-zinc-900 to-zinc-950 p-4">
      <div className="flex items-center gap-3">
        <div
          className="h-9 w-9 shrink-0 rounded-xl bg-yellow-300"
          aria-hidden
        />
        <div>
          <p className="text-sm font-semibold text-zinc-100">{headline}</p>
          <p className="text-xs text-zinc-400">{sub}</p>
        </div>
      </div>
    </div>
  );
}
