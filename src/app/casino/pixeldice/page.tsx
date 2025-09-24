"use client";

import { useState, useRef } from "react";
import { motion } from "framer-motion";
import { Coins, Play, Dice5 } from "lucide-react";
import { usePixels } from "@/components/pixels-provider";
import { usePxPop, centerOf } from "@/components/casino/fx/use-px-pop";

type HistoryItem = {
  d1: number;
  d2: number;
  sum: number;
  result: "win" | "lose";
  condition: string;
};

export default function PixelDicePage() {
  const { pixels: balance, setPixels, addPixels } = usePixels();
  const [bet, setBet] = useState(20);
  const [rolling, setRolling] = useState(false);
  const [dice, setDice] = useState<[number, number] | null>(null);
  const [result, setResult] = useState<string | null>(null);
  const [condition, setCondition] = useState<
    "pair" | "impair" | "high" | "low" | "seven" | null
  >(null);

  const [history, setHistory] = useState<HistoryItem[]>([]);

  const { overlay, popMinusAt, popPlusAt } = usePxPop();
  const diceRef = useRef<HTMLDivElement | null>(null);

  const canPlay = !rolling && bet > 0 && balance >= bet && condition;

  function rollDie() {
    return Math.floor(Math.random() * 6) + 1;
  }

  async function handleRoll() {
    if (!canPlay || !condition) return;
    setRolling(true);
    setResult(null);

    setPixels(balance - bet);
    const c = centerOf(diceRef);
    popMinusAt(c.x, c.y, `-${bet} PX`);

    // petite animation avec plusieurs rolls rapides
    for (let i = 0; i < 8; i++) {
      setDice([rollDie(), rollDie()]);
      await new Promise((r) => setTimeout(r, 100));
    }

    const final = [rollDie(), rollDie()] as [number, number];
    setDice(final);
    const sum = final[0] + final[1];

    let win = false;
    if (condition === "pair" && sum % 2 === 0) win = true;
    if (condition === "impair" && sum % 2 === 1) win = true;
    if (condition === "high" && sum > 7) win = true;
    if (condition === "low" && sum < 7) win = true;
    if (condition === "seven" && sum === 7) win = true;

    if (win) {
      const multiplier = condition === "seven" ? 5 : 2;
      const gain = bet * multiplier;
      addPixels(gain);
      popPlusAt(c.x, c.y, `+${gain} PX`);
      setResult(`✅ Gagné ! Somme ${sum} → ${condition.toUpperCase()}`);
      addToHistory(final[0], final[1], sum, "win", condition);
    } else {
      setResult(`💀 Perdu ! Somme ${sum} → ${condition.toUpperCase()}`);
      addToHistory(final[0], final[1], sum, "lose", condition);
    }

    setRolling(false);
  }

  function addToHistory(
    d1: number,
    d2: number,
    sum: number,
    result: "win" | "lose",
    cond: string
  ) {
    setHistory((h) => [
      { d1, d2, sum, result, condition: cond },
      ...h.slice(0, 4),
    ]);
  }

  return (
    <>
      {overlay}

      <div className="mx-auto max-w-3xl py-12">
        {/* Header */}
        <div className="mb-2">
          <h1 className="text-4xl font-bold tracking-tight">PixelDice 🎲</h1>
          <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
            Lance les dés, parie sur Pair, Impair, Haut, Bas ou Jackpot 7.
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

        {/* Carte */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="rounded-3xl border bg-gradient-to-b from-zinc-50 to-white p-6 dark:from-zinc-950 dark:to-zinc-900"
        >
          {/* Mise + bouton */}
          <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="inline-flex items-center gap-2 rounded-2xl border bg-white px-3 py-1.5 text-sm text-zinc-800 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-200">
              Mise
              <div className="ms-2 flex overflow-hidden rounded-xl border dark:border-zinc-800">
                {[10, 20, 50, 100, 200, 500, 1000].map((v) => (
                  <button
                    key={v}
                    disabled={rolling}
                    onClick={() => setBet(v)}
                    className={`px-2 py-1.5 transition ${
                      bet === v
                        ? "bg-yellow-300 text-black"
                        : "hover:bg-zinc-100 dark:hover:bg-zinc-800"
                    }`}
                  >
                    {v}
                  </button>
                ))}
              </div>
              <span className="text-zinc-500">px</span>
            </div>

            <div className="flex sm:justify-end justify-center w-full sm:w-auto">
              <button
                onClick={handleRoll}
                disabled={!canPlay}
                className="flex h-[42px] items-center justify-center gap-2 rounded-2xl bg-yellow-300 px-5 text-sm font-semibold text-black shadow-md disabled:cursor-not-allowed disabled:opacity-60"
                style={{ minWidth: "160px" }}
              >
                <Play className="h-4 w-4" /> Lancer ({bet} px)
              </button>
            </div>
          </div>

          {/* Zone centrale dés */}
          <div ref={diceRef} className="flex justify-center gap-6 mb-6">
            {[0, 1].map((i) => (
              <motion.div
                key={i}
                animate={{ rotate: rolling ? 360 : 0 }}
                transition={{ duration: 0.3 }}
                className="w-20 h-20 flex items-center justify-center rounded-2xl border bg-white shadow-md text-3xl font-bold"
              >
                {dice ? dice[i] : "?"}
              </motion.div>
            ))}
          </div>

          {/* Boutons conditions */}
          <div className="mb-6 flex flex-wrap justify-center gap-3">
            {[
              { key: "pair", label: "Pair" },
              { key: "impair", label: "Impair" },
              { key: "high", label: "Somme > 7" },
              { key: "low", label: "Somme < 7" },
              { key: "seven", label: "Jackpot = 7" },
            ].map((opt) => (
              <button
                key={opt.key}
                onClick={() => setCondition(opt.key as any)}
                className={`px-5 py-2 rounded-xl border text-sm font-semibold ${
                  condition === opt.key
                    ? "bg-yellow-400 text-black border-yellow-600"
                    : "bg-neutral-800 text-white"
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>

          {/* Résultat */}
          <div className="mt-4 rounded-xl border bg-white/95 p-3 text-center text-sm text-zinc-800 dark:bg-zinc-900/60 dark:text-zinc-200 min-h-[40px] flex items-center justify-center">
            {result ? (
              result
            ) : (
              <span>Choisis une condition et lance les dés…</span>
            )}
          </div>

          {/* Historique */}
          <div className="mt-6 rounded-xl border bg-white/95 dark:bg-zinc-900/60 p-3 text-sm text-zinc-800 dark:text-zinc-200">
            <div className="font-semibold mb-2">Historique (5 derniers)</div>
            {history.length === 0 && (
              <div className="text-center text-zinc-500">
                Pas encore de lancers.
              </div>
            )}
            {history.map((h, i) => (
              <div key={i} className="flex justify-between border-t py-1">
                <span>
                  🎲 {h.d1}+{h.d2} = {h.sum}
                </span>
                <span>
                  {h.result === "win" ? "✅ Gagné" : "💀 Perdu"} ({h.condition})
                </span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </>
  );
}
