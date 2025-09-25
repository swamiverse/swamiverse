"use client";

import { motion } from "framer-motion";
import Link from "next/link";

export default function InventairePage() {
  return (
    <div className="mt-10 space-y-6">
      {/* Titre */}
      <motion.h1
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="text-3xl font-bold tracking-tight"
        style={{ fontFamily: "var(--font-display)" }}
      >
        🎒 Inventaire
      </motion.h1>

      {/* Placeholder */}
      <div className="rounded-2xl border border-zinc-800 bg-zinc-950 p-4 shadow-inner">
        <p className="text-sm text-zinc-400">
          Ton sac est encore vide... pars à l’aventure pour trouver des objets !
        </p>
      </div>

      {/* Bouton retour */}
      <Link
        href="/aventure"
        className="inline-flex items-center gap-2 rounded-xl border border-zinc-700 bg-zinc-900 px-4 py-2 text-zinc-200 transition hover:bg-zinc-800 focus:outline-none focus-visible:ring-4 focus-visible:ring-white/10"
      >
        ← Retour à Aventure
      </Link>
    </div>
  );
}
