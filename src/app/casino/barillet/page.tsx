"use client";

import { useState, useMemo, useRef } from "react";
import { motion } from "framer-motion";
import { Coins, Play, Pause, RotateCcw } from "lucide-react";
import { usePixels } from "@/components/pixels-provider";
import { usePxPop, centerOf } from "@/components/casino/fx/use-px-pop";

const numbers = Array.from({ length: 37 }, (_, i) => i);

function getColor(n: number) {
  if (n === 0) return "vert";
  return n % 2 === 0 ? "jaune" : "noir";
}

function getParity(n: number) {
  if (n === 0) return null;
  return n % 2 === 0 ? "pair" : "impair";
}

export default function BarilletPage() {
  const { pixels: balance, setPixels, addPixels } = usePixels();
  const [bet, setBet] = useState(20);
  const [rolling, setRolling] = useState(false);
  const [displayNumber, setDisplayNumber] = useState<number | null>(null);
  const [result, setResult] = useState<string | null>(null);

  const [selections, setSelections] = useState<string[]>([]);
  const [lastSelections, setLastSelections] = useState<string[]>([]);

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

  const totalBet = bet * selections.length;
  const canSpin =
    !rolling && bet > 0 && balance >= totalBet && selections.length > 0;

  function toggleSelection(option: string, group?: string) {
    if (group) {
      setSelections((prev) => {
        // Si déjà sélectionné → toggle off
        if (prev.includes(option)) return prev.filter((x) => x !== option);

        // Sinon → on désactive les autres de ce groupe et on ajoute
        const groupKeys =
          group === "color"
            ? ["noir", "jaune"]
            : group === "parity"
            ? ["pair", "impair"]
            : ["basses", "hautes"];

        return [...prev.filter((x) => !groupKeys.includes(x)), option];
      });
    } else {
      // toggle normal pour numéros
      setSelections((prev) =>
        prev.includes(option)
          ? prev.filter((x) => x !== option)
          : [...prev, option]
      );
    }
  }

  function resetSelections() {
    setSelections([]);
  }

  function remiserSelections() {
    setSelections(lastSelections);
  }

  async function handleSpin() {
    if (!canSpin) return;

    setRolling(true);
    setResult(null);

    setPixels(balance - totalBet);
    const c = centerOf(machineRef);
    popMinusAt(c.x, c.y, `-${totalBet} PX`);

    let interval: NodeJS.Timeout;
    interval = setInterval(() => {
      const rand = numbers[Math.floor(Math.random() * numbers.length)];
      setDisplayNumber(rand);
    }, 80);

    await new Promise((r) => setTimeout(r, 2000));
    clearInterval(interval);

    const resultNum = numbers[Math.floor(Math.random() * numbers.length)];
    setDisplayNumber(resultNum);
    setRolling(false);

    const color = getColor(resultNum);
    const parity = getParity(resultNum);

    let winAmount = 0;

    for (const sel of selections) {
      if (sel === color) winAmount += bet * 3;
      if (sel === parity) winAmount += bet * 3;
      if (sel === "basses" && resultNum >= 1 && resultNum <= 18)
        winAmount += bet * 3;
      if (sel === "hautes" && resultNum >= 19 && resultNum <= 36)
        winAmount += bet * 3;
      if (!isNaN(Number(sel)) && Number(sel) === resultNum) {
        winAmount += resultNum === 0 ? bet * 50 : bet * 36;
      }
    }

    if (winAmount > 0) {
      addPixels(winAmount);
      const c2 = centerOf(machineRef);
      popPlusAt(c2.x, c2.y, `+${winAmount} PX`);
      setResult(
        `🎉 Gagné ! ${resultNum} (${color}${parity ? `, ${parity}` : ""})`
      );
    } else {
      setResult(
        `💀 Perdu ! ${resultNum} (${color}${parity ? `, ${parity}` : ""})`
      );
    }

    setLastSelections(selections);
    setSelections([]); // reset après tirage
  }

  return (
    <>
      {overlay}

      <div className="mx-auto max-w-3xl py-12">
        {/* Header */}
        <div className="mb-2">
          <h1 className="text-4xl font-bold tracking-tight">Pixel Barillet</h1>
          <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
            Mise sur couleurs, parités ou numéros. Chaque sélection applique ta
            mise de base.
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
          {/* Ligne mise + boutons Tirer/Remiser */}
          <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            {/* Sélecteur mise */}
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

            {/* Boutons Tirer + Remiser */}
            <div className="flex gap-3 sm:justify-end justify-center w-full sm:w-auto">
              <button
                onClick={remiserSelections}
                disabled={lastSelections.length === 0 || rolling}
                className="flex h-[42px] items-center justify-center gap-2 rounded-2xl border bg-white dark:bg-zinc-900 px-4 text-sm font-semibold text-black dark:text-white shadow-md hover:bg-zinc-100 dark:hover:bg-zinc-800 disabled:opacity-40"
                style={{ minWidth: "120px" }}
              >
                <RotateCcw className="h-4 w-4" /> Remiser
              </button>
              <button
                onClick={handleSpin}
                disabled={!canSpin}
                className="flex h-[42px] items-center justify-center gap-2 rounded-2xl bg-yellow-300 px-5 text-sm font-semibold text-black shadow-md disabled:cursor-not-allowed disabled:opacity-60"
                style={{ minWidth: "160px" }}
              >
                {rolling ? (
                  <>
                    <Pause className="h-4 w-4" /> En cours…
                  </>
                ) : (
                  <>
                    <Play className="h-4 w-4" /> Tirer ({totalBet} px)
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Zone centrale : le nombre */}
          <div ref={machineRef} className="flex justify-center mb-6">
            <motion.div
              key={displayNumber}
              initial={{ scale: 0.6, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.15 }}
              className="w-64 h-64 sm:w-72 sm:h-72 flex items-center justify-center rounded-3xl shadow-xl text-7xl font-bold"
              style={{
                backgroundColor:
                  displayNumber === null
                    ? "#222"
                    : getColor(displayNumber) === "jaune"
                    ? "#facc15"
                    : getColor(displayNumber) === "noir"
                    ? "#000"
                    : "#16a34a",
                color: getColor(displayNumber) === "jaune" ? "#000" : "#fff",
              }}
            >
              {displayNumber ?? "?"}
            </motion.div>
          </div>

          {/* Boutons de pari globaux */}
          <div className="mb-6 flex flex-wrap justify-center gap-3">
            {[
              { key: "noir", label: "Noir 🖤", group: "color" },
              { key: "jaune", label: "Jaune 💛", group: "color" },
              { key: "pair", label: "Pair", group: "parity" },
              { key: "impair", label: "Impair", group: "parity" },
              { key: "basses", label: "Basses (1–18)", group: "range" },
              { key: "hautes", label: "Hautes (19–36)", group: "range" },
            ].map((opt) => (
              <button
                key={opt.key}
                onClick={() => toggleSelection(opt.key, opt.group)}
                className={`px-4 py-2 rounded-xl border text-sm font-semibold ${
                  selections.includes(opt.key)
                    ? "bg-yellow-400 text-black border-2 border-black"
                    : "bg-neutral-800 text-white"
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>

          {/* Grille numéros */}
          <div className="grid grid-cols-9 gap-2 mb-6">
            {numbers.map((n) => {
              const col = getColor(n);
              const selected = selections.includes(String(n));
              return (
                <button
                  key={n}
                  onClick={() => toggleSelection(String(n))}
                  className={`px-2 py-2 rounded-lg text-sm font-semibold border ${
                    selected
                      ? "bg-red-600 text-white border-2 border-black scale-105"
                      : col === "vert"
                      ? "bg-green-600 text-white"
                      : col === "jaune"
                      ? "bg-yellow-400 text-black"
                      : "bg-black text-white"
                  }`}
                >
                  {n}
                </button>
              );
            })}
          </div>

          {/* Mise totale actuelle */}
          <div className="mb-6 text-center text-lg font-semibold text-yellow-500">
            Mise totale actuelle : {totalBet} px
          </div>

          {/* Résultat */}
          <div className="mt-4 rounded-xl border bg-white/95 p-3 text-center text-lg font-bold text-zinc-800 dark:bg-zinc-900/60 dark:text-zinc-200 min-h-[50px] flex items-center justify-center">
            {result ? (
              result
            ) : (
              <span>Sélectionne tes paris et lance le barillet…</span>
            )}
          </div>
        </motion.div>
      </div>
    </>
  );
}
