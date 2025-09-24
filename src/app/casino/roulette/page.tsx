"use client";

import { useRef, useState } from "react";
import { motion } from "framer-motion";
import { Coins, Play, Pause } from "lucide-react";
import { usePixels } from "@/components/pixels-provider";
import { usePxPop, centerOf } from "@/components/casino/fx/use-px-pop";

type Segment = {
  color: string;
  multiplier: number;
  label: string;
};

// 9 parts égales : 3 Noirs ×0, 3 Jaunes ×10, 2 Bleus ×50, 1 Rouge ×100
const SEGMENTS: Segment[] = [
  { color: "#111827", multiplier: 0, label: "Noir" }, // ⚫
  { color: "#facc15", multiplier: 10, label: "Jaune" }, // 🟡
  { color: "#3b82f6", multiplier: 50, label: "Bleu" }, // 🔵
  { color: "#111827", multiplier: 0, label: "Noir" },
  { color: "#ef4444", multiplier: 100, label: "Rouge" }, // 🔴
  { color: "#facc15", multiplier: 10, label: "Jaune" },
  { color: "#111827", multiplier: 0, label: "Noir" },
  { color: "#3b82f6", multiplier: 50, label: "Bleu" },
  { color: "#facc15", multiplier: 10, label: "Jaune" },
];

const DURATION_MS = 4800;
const POINTER_DEG = 0;
const mod = (n: number, m: number) => ((n % m) + m) % m;

export default function RoulettePage() {
  const { pixels: balance, setPixels, addPixels } = usePixels();
  const [bet, setBet] = useState(20);
  const [spinning, setSpinning] = useState(false);
  const [angle, setAngle] = useState(0);
  const [result, setResult] = useState<Segment | null>(null);

  const { popPlusAt, popMinusAt, overlay } = usePxPop();
  const wheelRef = useRef<HTMLDivElement | null>(null);
  const targetIndexRef = useRef<number | null>(null);

  const canSpin = !spinning && bet > 0 && balance >= bet;

  async function handleSpin() {
    if (!canSpin) return;
    setSpinning(true);
    setResult(null);

    // 💸 Débit + FX
    setPixels(balance - bet);
    const c = centerOf(wheelRef);
    popMinusAt(c.x, c.y, `-${bet} PX`);

    // Géométrie
    const n = SEGMENTS.length;
    const segDeg = 360 / n;

    // Index visé
    const targetIndex = Math.floor(Math.random() * n);
    targetIndexRef.current = targetIndex;

    // Angle courant normalisé
    const currentNorm = mod(angle, 360);

    // Centre du segment sélectionné
    const centerDeg = targetIndex * segDeg + segDeg / 2;

    // Δ pour aligner le segment au pointeur
    const deltaToTarget = mod(POINTER_DEG - centerDeg - currentNorm, 360);

    const fullSpins = 5 * 360;
    const final = +(angle + fullSpins + deltaToTarget).toFixed(3);
    setAngle(final);

    setTimeout(() => {
      const idx = targetIndexRef.current!;
      const seg = SEGMENTS[idx];
      setResult(seg);

      if (seg.multiplier > 0) {
        const win = bet * seg.multiplier;
        addPixels(win);
        popPlusAt(c.x, c.y, `+${win} PX`);
      }
      setSpinning(false);
    }, DURATION_MS);
  }

  // 👉 Construction du conic-gradient
  const gradient = (() => {
    const n = SEGMENTS.length;
    const segDeg = 360 / n;
    return `conic-gradient(${SEGMENTS.map(
      (seg, i) => `${seg.color} ${i * segDeg}deg ${(i + 1) * segDeg}deg`
    ).join(", ")})`;
  })();

  return (
    <>
      {overlay}

      <div className="mx-auto max-w-3xl py-12">
        <h1 className="text-4xl font-bold tracking-tight">Méga Roulette</h1>
        <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
          🎡 9 sections égales : <strong>Noir</strong> ×0,{" "}
          <strong>Jaune</strong> ×10, <strong>Bleu</strong> ×50,{" "}
          <strong>Rouge</strong> ×100.
        </p>

        <div className="mt-4 inline-flex items-center gap-2 rounded-xl bg-zinc-100 px-3 py-1.5 text-sm text-zinc-800 dark:bg-zinc-900 dark:text-zinc-200">
          <Coins className="h-4 w-4 text-yellow-400" />
          Solde :
          <span className="font-semibold text-yellow-600 dark:text-yellow-300">
            {balance} px
          </span>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mt-6 rounded-3xl border bg-gradient-to-b from-zinc-50 to-white p-6 dark:border-zinc-800 dark:from-zinc-950 dark:to-zinc-900"
        >
          {/* Barre mise + bouton */}
          <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="inline-flex items-center gap-2 rounded-2xl border bg-white px-3 py-1.5 text-sm text-zinc-800 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-200">
              Mise
              <div className="ms-2 flex overflow-hidden rounded-xl border dark:border-zinc-800">
                {[10, 20, 50, 100, 200, 500, 1000].map((v) => (
                  <button
                    key={v}
                    disabled={spinning}
                    onClick={() => setBet(v)}
                    className={`px-3 py-1.5 transition ${
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

            <div className="flex sm:justify-end justify-center w-full sm:w-auto">
              <button
                onClick={handleSpin}
                disabled={!canSpin}
                className="flex h-[42px] items-center justify-center gap-2 rounded-2xl bg-yellow-300 px-5 text-sm font-semibold text-black shadow-md disabled:cursor-not-allowed disabled:opacity-60"
                style={{ minWidth: 160 }}
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

          {/* Roulette */}
          <div className="relative flex justify-center">
            <div
              ref={wheelRef}
              className="relative h-96 w-96 rounded-full border-4 border-zinc-800"
              style={{
                background: gradient,
                transform: `rotate(${angle}deg)`,
                transition: spinning
                  ? `transform ${DURATION_MS}ms cubic-bezier(0.25,1,0.5,1)`
                  : "none",
                willChange: "transform",
              }}
            />

            {/* Pointeur vers le bas */}
            <div
              className="pointer-events-none absolute -top-[18px] left-1/2 -translate-x-1/2 h-0 w-0 
             border-l-[12px] border-r-[12px] border-t-[20px] border-transparent"
              style={{
                borderTopColor: "#facc15",
                filter: "drop-shadow(0 0 2px #000)",
              }}
            />
          </div>

          {/* Résultat permanent */}
          <div className="mt-6 rounded-xl border bg-white/95 p-3 text-center text-sm text-zinc-800 dark:border-zinc-800 dark:bg-zinc-900/60 dark:text-zinc-200 min-h-[40px] flex items-center justify-center">
            {result ? (
              result.multiplier > 0 ? (
                <span>
                  🎉 Gagné ! {result.label} ×{result.multiplier} →{" "}
                  <strong>{bet * result.multiplier} px</strong>
                </span>
              ) : (
                <span>❌ Perdu ! Noir (×0)</span>
              )
            ) : (
              <span>Lance la roulette pour jouer !</span>
            )}
          </div>

          {/* Tableau des lots */}
          <div className="mt-6 overflow-hidden rounded-xl border bg-white text-zinc-800 dark:border-zinc-800 dark:bg-transparent dark:text-inherit">
            <table className="w-full border-collapse text-sm">
              <thead>
                <tr className="bg-zinc-100 text-zinc-700 dark:bg-zinc-900/60 dark:text-zinc-300">
                  <th className="px-3 py-2 text-left">Couleur</th>
                  <th className="px-3 py-2 text-left">Gain</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="px-3 py-2">⚫ Noir</td>
                  <td className="px-3 py-2">×0</td>
                </tr>
                <tr>
                  <td className="px-3 py-2">🟡 Jaune</td>
                  <td className="px-3 py-2">×10</td>
                </tr>
                <tr>
                  <td className="px-3 py-2">🔵 Bleu</td>
                  <td className="px-3 py-2">×50</td>
                </tr>
                <tr>
                  <td className="px-3 py-2">🔴 Rouge</td>
                  <td className="px-3 py-2">×100</td>
                </tr>
              </tbody>
            </table>
          </div>
        </motion.div>
      </div>
    </>
  );
}
