"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Package, PlayCircle } from "lucide-react";

export default function AventurePage() {
  return (
    <div className="mt-10 space-y-8">
      {/* Titre */}
      <motion.h1
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="text-4xl font-bold tracking-tight"
        style={{ fontFamily: "var(--font-display)" }}
      >
        🌍 Aventure
      </motion.h1>

      {/* Description */}
      <p className="max-w-xl text-lg text-zinc-400">
        Bienvenue dans le monde interactif <strong>Aventure</strong>. Choisis
        ton chemin, conserve ton inventaire et découvre des histoires multiples.
      </p>

      {/* Actions principales */}
      <div className="flex flex-wrap gap-4">
        <Link
          href="/aventure/histoire"
          className="inline-flex items-center gap-2 rounded-xl bg-yellow-300 px-4 py-2 font-semibold text-black shadow hover:bg-yellow-400 transition focus:outline-none focus-visible:ring-4 focus-visible:ring-yellow-400/60"
        >
          <PlayCircle className="h-5 w-5" />
          Commencer l’histoire
        </Link>

        <Link
          href="/aventure/inventaire"
          className="inline-flex items-center gap-2 rounded-xl border border-zinc-700 bg-zinc-900 px-4 py-2 text-zinc-200 transition hover:bg-zinc-800 focus:outline-none focus-visible:ring-4 focus-visible:ring-white/10"
        >
          <Package className="h-5 w-5" />
          Inventaire
        </Link>
      </div>

      {/* Placeholder Inventaire (teaser) */}
      <div className="rounded-2xl border border-zinc-800 bg-zinc-950 p-4 shadow-inner">
        <h2 className="text-lg font-semibold text-white mb-2">Inventaire</h2>
        <p className="text-sm text-zinc-400">
          Ton sac est vide pour l’instant... pars en exploration pour trouver
          des objets !
        </p>
      </div>
    </div>
  );
}
