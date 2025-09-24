"use client";

import { motion } from "framer-motion";
import BigScratchCard from "@/components/casino/big-scratch/big-scratch-card";
import { usePxPop } from "@/components/casino/fx/use-px-pop";

export default function BigScratchPage() {
  // 🎇 FX hook
  const { popMinusAt, overlay } = usePxPop();

  return (
    <>
      {/* 🎇 FX overlay global */}
      {overlay}

      <div className="mx-auto max-w-4xl py-12">
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="rounded-3xl border bg-gradient-to-b from-amber-50 to-white p-6 dark:from-zinc-950 dark:to-black"
        >
          {/* Header */}
          <h1 className="text-2xl font-bold">Méga carte à gratter</h1>
          <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
            Récompenses de <strong>50</strong> à <strong>1000 px</strong>, avec
            une chance ultra-rare de décrocher <strong>10000 px</strong>. Reset
            possible pour 200 px.
          </p>

          {/* 🃏 Jeu Big Scratch */}
          <div className="mt-5">
            <BigScratchCard popMinusAt={popMinusAt} />
          </div>

          {/* 📌 Résultat fixe en bas */}
          <div className="mt-6 rounded-xl border bg-white/95 p-3 text-center text-sm text-zinc-800 dark:bg-zinc-900/60 dark:text-zinc-200 min-h-[40px] flex items-center justify-center">
            <span>
              Gratte la carte pour découvrir ta récompense ! (résultat affiché
              ici)
            </span>
          </div>
        </motion.div>
      </div>
    </>
  );
}
