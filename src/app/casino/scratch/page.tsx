"use client";

import { motion } from "framer-motion";
import { Ticket } from "lucide-react";
import ScratchCard from "@/components/casino/scratch/scratch-card";
import { usePxPop } from "@/components/casino/fx/use-px-pop";

export default function ScratchPage() {
  // 🎇 FX hook
  const { popPlusAt, popMinusAt, overlay } = usePxPop();

  return (
    <>
      {/* 🎇 FX overlay global */}
      {overlay}

      <div className="mx-auto max-w-3xl py-12">
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="rounded-3xl border bg-gradient-to-b from-zinc-50 to-white p-6 dark:from-zinc-950 dark:to-zinc-900"
        >
          {/* Header */}
          <div className="flex items-start gap-3">
            <Ticket className="mt-0.5 h-5 w-5 text-yellow-500" />
            <div>
              <h1 className="text-2xl font-bold">Carte à gratter</h1>
              <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
                Choisis ta mise, aligne 3 symboles pour un gros gain, 2 pour un
                bonus. La carte se réinitialise automatiquement après chaque
                partie.
              </p>
            </div>
          </div>

          {/* 🎟 Jeu Scratch */}
          <div className="mt-5">
            <ScratchCard popPlusAt={popPlusAt} popMinusAt={popMinusAt} />
          </div>

          {/* 📌 Résultat toujours visible en bas */}
          <div className="mt-6 rounded-xl border bg-white/95 p-3 text-center text-sm text-zinc-800 dark:bg-zinc-900/60 dark:text-zinc-200 min-h-[40px] flex items-center justify-center">
            <span>
              Lance une carte pour jouer ! (résultat affiché ici en permanence)
            </span>
          </div>
        </motion.div>
      </div>
    </>
  );
}
