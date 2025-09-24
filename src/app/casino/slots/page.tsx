"use client";

import { useMemo, useRef, useState } from "react";
import { motion } from "framer-motion";
import { Coins, Play, Pause } from "lucide-react";
import { usePixels } from "@/components/pixels-provider";
import {
  SYMBOLS,
  pickRandom,
  evaluate,
  SlotSymbol,
} from "@/components/casino/casino-utils";
import Reel from "@/components/casino/slots/reel";
import { usePxPop, centerOf } from "@/components/casino/fx/use-px-pop";

export default function SlotsPage() {
  const { pixels: balance, setPixels, addPixels } = usePixels();
  const [bet, setBet] = useState(20);
  const [spinning, setSpinning] = useState(false);
  const [reels, setReels] = useState<SlotSymbol[]>(() => [
    pickRandom(),
    pickRandom(),
    pickRandom(),
  ]);
  const [result, setResult] = useState<ReturnType<typeof evaluate> | null>(
    null
  );

  const { popPlusAt, popMinusAt, overlay } = usePxPop();
  const machineRef = useRef<HTMLDivElement | null>(null);

  const lastUpdated = useMemo(
    () =>
      new Date().toLocaleString("fr-FR", {
        dateStyle: "medium",
        timeStyle: "short",
      }),
    []
  );

  const canSpin = !spinning && bet > 0 && balance >= bet;

  async function handleSpin() {
    if (!canSpin) return;
    setSpinning(true);
    setResult(null);

    setPixels(balance - bet);
    const c = centerOf(machineRef);
    popMinusAt(c.x, c.y, `-${bet} PX`);

    const cycles = 16;
    for (let i = 0; i < cycles; i++) {
      setReels([pickRandom(), pickRandom(), pickRandom()]);
      const t = i / cycles;
      const delay = 35 + 130 * Math.sin(Math.PI * t);
      await new Promise((r) => setTimeout(r, delay));
    }

    const finalReels = [pickRandom(), pickRandom(), pickRandom()];
    setReels(finalReels);
    const ev = evaluate(finalReels);
    setResult(ev);

    if (ev.multiplier > 0) {
      const win = bet * ev.multiplier;
      addPixels(win);
      const c2 = centerOf(machineRef);
      popPlusAt(c2.x, c2.y, `+${win} PX`);
    }

    setSpinning(false);
  }

  return (
    <>
      {overlay}

      <div className="mx-auto max-w-3xl py-12">
        {/* Titre style Garage */}
        <div className="mb-2">
          <h1 className="text-4xl font-bold tracking-tight">Pixel Slot</h1>
          <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
            Aligne les symboles et tente ta chance au jackpot. Mise au choix,
            gains en Pixels.
          </p>
        </div>

        {/* Solde */}
        <div className="mb-6">
          <div className="inline-flex items-center gap-2 rounded-xl bg-zinc-100 px-3 py-1.5 text-sm text-zinc-800 dark:bg-zinc-900 dark:text-zinc-200">
            <Coins className="h-4 w-4 text-yellow-400" />
            Solde :
            <span className="font-semibold text-yellow-600 dark:text-yellow-300">
              {balance} px
            </span>
          </div>
        </div>

        {/* Carte principale */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="rounded-3xl border bg-gradient-to-b from-zinc-50 to-white p-6 dark:from-zinc-950 dark:to-zinc-900"
        >
          {/* Ligne mise + bouton */}
          <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            {/* Bloc des mises (à gauche) */}
            <div className="inline-flex items-center gap-2 rounded-2xl border bg-white px-3 py-1.5 text-sm text-zinc-800 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-200">
              Mise
              <div className="ms-2 flex overflow-hidden rounded-xl border dark:border-zinc-800">
                {[10, 20, 50, 100, 200, 500, 1000, 5000].map((v) => (
                  <button
                    key={v}
                    disabled={spinning}
                    onClick={() => setBet(v)}
                    className={`px-2 py-1.5 transition ${
                      bet === v
                        ? "bg-yellow-300 text-black"
                        : "hover:bg-zinc-100 dark:hover:bg-zinc-800"
                    }`}
                    aria-pressed={bet === v}
                  >
                    {v}
                  </button>
                ))}
              </div>
              <span className="text-zinc-500">px</span>
            </div>

            {/* Bouton Spin (collé à droite en desktop, dessous en mobile) */}
            <div className="flex sm:justify-end justify-center w-full sm:w-auto">
              <button
                onClick={handleSpin}
                disabled={!canSpin}
                className="flex h-[42px] items-center justify-center gap-2 rounded-2xl bg-yellow-300 px-5 text-sm font-semibold text-black shadow-md disabled:cursor-not-allowed disabled:opacity-60"
                style={{ minWidth: "160px" }}
              >
                {spinning ? (
                  <>
                    <Pause className="h-4 w-4" /> En cours…
                  </>
                ) : (
                  <>
                    <Play className="h-4 w-4" /> Lancer ({bet} px)
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Machine à sous */}
          <div ref={machineRef} className="mx-auto w-full">
            <div className="grid grid-cols-3 gap-4">
              {reels.map((s, i) => (
                <div key={i} className="w-full h-40 sm:h-48 md:h-56">
                  <Reel symbol={s} spinning={spinning} index={i} />
                </div>
              ))}
            </div>
          </div>

          {/* Résultat - toujours visible (placé juste sous les rouleaux) */}
          <div className="mt-4 rounded-xl border bg-white/95 p-3 text-center text-sm text-zinc-800 dark:bg-zinc-900/60 dark:text-zinc-200 min-h-[40px] flex items-center justify-center">
            {result ? (
              <>
                {result.kind === "three" && (
                  <span>
                    🎰 JACKPOT {result.symbol?.label} ×3 ! Gain{" "}
                    <strong>{bet * result.multiplier} px</strong>
                  </span>
                )}
                {result.kind === "two" && result.multiplier > 0 && (
                  <span>
                    Alignement ×2 ! Gain{" "}
                    <strong>{bet * result.multiplier} px</strong>
                  </span>
                )}
                {result.kind === "none" && <span>Pas cette fois…</span>}
              </>
            ) : (
              <span>Lance la machine pour jouer !</span>
            )}
          </div>

          {/* Paytable */}
          <div className="mt-6 overflow-hidden rounded-xl border bg-white text-zinc-800 dark:border-zinc-800 dark:bg-transparent dark:text-inherit">
            <table className="w-full border-collapse text-sm">
              <thead>
                <tr className="bg-zinc-100 text-zinc-700 dark:bg-zinc-900/60 dark:text-zinc-300">
                  <th className="px-3 py-2 text-left">Symbole</th>
                  <th className="px-3 py-2 text-left">Rareté</th>
                  <th className="px-3 py-2 text-left">×3</th>
                  <th className="px-3 py-2 text-left">×2</th>
                </tr>
              </thead>
              <tbody>
                {SYMBOLS.map((s) => (
                  <tr
                    key={s.key}
                    className="border-t border-zinc-200 dark:border-zinc-800"
                  >
                    <td className="px-3 py-2">{s.label}</td>
                    <td className="px-3 py-2 text-zinc-500">
                      {s.weight === 1
                        ? "Rare"
                        : s.weight <= 2
                        ? "Peu"
                        : s.weight <= 3
                        ? "Moyen"
                        : "Commun"}
                    </td>
                    <td className="px-3 py-2">{s.payout3}×</td>
                    <td className="px-3 py-2">{s.payout2 ?? 0}×</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>
      </div>
    </>
  );
}
