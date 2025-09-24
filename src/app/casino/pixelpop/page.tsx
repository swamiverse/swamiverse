"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { motion } from "framer-motion";
import { Coins, Play, DollarSign } from "lucide-react";
import { usePixels } from "@/components/pixels-provider";
import { usePxPop, centerOf } from "@/components/casino/fx/use-px-pop";

type HistoryItem = {
  multi: number;
  result: "win" | "lose";
  time: number; // en secondes
};

export default function PixelPopPage() {
  const { pixels: balanceRaw, setPixels, addPixels } = usePixels();

  // Helpers safe number
  const safeNum = (v: any, def = 0) => {
    const n = Number(v);
    return Number.isFinite(n) ? n : def;
  };
  const balance = safeNum(balanceRaw, 0);

  // État partie
  const [bet, setBet] = useState<number>(20);
  const [playing, setPlaying] = useState(false);
  const [crashed, setCrashed] = useState(false);

  const [multiplier, setMultiplier] = useState(1.0);

  // RAF / Temps
  const rafRef = useRef<number | null>(null);
  const startMsRef = useRef<number>(0);
  const crashAtMsRef = useRef<number>(0);

  // Historique
  const [history, setHistory] = useState<HistoryItem[]>([]);

  // UI Refs
  const cardRef = useRef<HTMLDivElement | null>(null);
  const arenaRef = useRef<HTMLDivElement | null>(null);
  const circleRef = useRef<HTMLDivElement | null>(null);
  const { overlay, popMinusAt, popPlusAt } = usePxPop();

  // Cercle borné
  const [maxDiameter, setMaxDiameter] = useState(260);
  useEffect(() => {
    const compute = () => {
      const host = arenaRef.current;
      if (!host) return;
      const r = host.getBoundingClientRect();
      const max = Math.max(120, Math.min(r.width, r.height) - 48);
      setMaxDiameter(Math.min(460, max));
    };
    compute();
    window.addEventListener("resize", compute);
    return () => window.removeEventListener("resize", compute);
  }, []);

  const diameter = useMemo(() => {
    const min = 12;
    const K = 70;
    const d = min + (multiplier - 1) * K;
    return Math.max(min, Math.min(maxDiameter, d));
  }, [multiplier, maxDiameter]);

  const cashNow = Math.max(0, Math.floor(safeNum(bet) * safeNum(multiplier)));
  const canPlay =
    !playing && !crashed && safeNum(bet) > 0 && balance >= safeNum(bet);

  // ----- RAF loop -----
  const stopRAF = () => {
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    rafRef.current = null;
  };

  useEffect(() => {
    return () => stopRAF();
  }, []);

  const loop = (now: number) => {
    const t = (now - startMsRef.current) / 1000;
    const k = 0.095;
    const m = Math.exp(k * t);
    setMultiplier(parseFloat(m.toFixed(2)));

    if (now >= crashAtMsRef.current) {
      handleCrash();
      return;
    }
    rafRef.current = requestAnimationFrame(loop);
  };

  // ----- Actions -----
  const handleStart = () => {
    if (!canPlay) return;
    resetRound(true);
    setPixels(balance - safeNum(bet));
    const c = centerOf(cardRef);
    popMinusAt(c.x, c.y, `-${safeNum(bet)} PX`);

    setPlaying(true);
    startMsRef.current = performance.now();

    // Crash aléatoire biaisé (max 15s)
    const crashMs = 3000 + Math.pow(Math.random(), 2) * 12000;
    crashAtMsRef.current = startMsRef.current + crashMs;

    rafRef.current = requestAnimationFrame(loop);
  };

  const handleCashOut = () => {
    if (!playing || crashed) return;
    stopRAF();
    setPlaying(false);

    addPixels(safeNum(cashNow));
    const c = centerOf(cardRef);
    popPlusAt(c.x, c.y, `+${safeNum(cashNow)} PX`);

    addToHistory(multiplier, "win");
    resetRound(true);
  };

  const handleCrash = () => {
    stopRAF();
    setPlaying(false);
    setCrashed(true);

    addToHistory(multiplier, "lose");

    // petit délai pour voir l’explosion rouge
    setTimeout(() => resetRound(true), 800);
  };

  const resetRound = (keepBet = true) => {
    stopRAF();
    setPlaying(false);
    setCrashed(false);
    setMultiplier(1.0);
    if (!keepBet) setBet(20);
  };

  // Historique
  const addToHistory = (multi: number, result: "win" | "lose") => {
    const time = ((performance.now() - startMsRef.current) / 1000).toFixed(1);
    setHistory((h) => [
      { multi, result, time: parseFloat(time) },
      ...h.slice(0, 4),
    ]);
  };

  const best = history.length ? Math.max(...history.map((h) => h.multi)) : null;

  return (
    <>
      {overlay}
      <div className="mx-auto max-w-3xl py-12">
        {/* Header */}
        <div className="mb-2">
          <h1 className="text-4xl font-bold tracking-tight">PixelPop 💥</h1>
          <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
            Le cercle grossit doucement, le multiplicateur monte. Encaisse avant
            l’explosion.
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
          ref={cardRef}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="rounded-3xl border bg-gradient-to-b from-zinc-50 to-white p-6 dark:from-zinc-950 dark:to-zinc-900"
        >
          {/* Ligne mise + actions */}
          <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            {/* Sélecteur mise */}
            <div className="inline-flex items-center gap-2 rounded-2xl border bg-white px-3 py-1.5 text-sm text-zinc-800 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-200">
              Mise
              <div className="ms-2 flex overflow-hidden rounded-xl border dark:border-zinc-800">
                {[10, 20, 50, 100, 200, 500, 1000].map((v) => (
                  <button
                    key={v}
                    disabled={playing}
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

            {/* Actions */}
            <div className="flex gap-3 sm:justify-end justify-center w-full sm:w-auto">
              {!playing && !crashed && (
                <button
                  onClick={handleStart}
                  disabled={!canPlay}
                  className="flex h-[42px] items-center justify-center gap-2 rounded-2xl bg-yellow-300 px-5 text-sm font-semibold text-black shadow-md disabled:cursor-not-allowed disabled:opacity-60"
                  style={{ minWidth: 160 }}
                >
                  <Play className="h-4 w-4" /> Lancer ({safeNum(bet)} px)
                </button>
              )}

              {playing && (
                <button
                  onClick={handleCashOut}
                  className="flex h-[42px] items-center justify-center gap-2 rounded-2xl bg-green-500 px-5 text-sm font-semibold text-white shadow-md"
                  style={{ minWidth: 190 }}
                >
                  <DollarSign className="h-4 w-4" /> Encaisser ({cashNow} px)
                </button>
              )}
            </div>
          </div>

          {/* Multiplicateur (au-dessus du cercle) */}
          <div className="text-center mb-4">
            <span className="text-5xl font-extrabold text-yellow-500">
              ×{safeNum(multiplier).toFixed(2)}
            </span>
          </div>

          {/* Arène cercle */}
          <div
            ref={arenaRef}
            className="relative mx-auto flex items-center justify-center overflow-hidden rounded-2xl border bg-white/80 dark:bg-zinc-900/50"
            style={{ height: 340, maxHeight: 420 }}
          >
            <motion.div
              ref={circleRef}
              className="absolute rounded-full bg-yellow-400 shadow-lg"
              style={{
                width: diameter,
                height: diameter,
                transition: "width 180ms ease-out, height 180ms ease-out",
              }}
              animate={
                crashed
                  ? {
                      backgroundColor: "#ef4444",
                      opacity: [1, 0.6, 1],
                      transition: { duration: 0.55, ease: "easeOut" },
                    }
                  : {}
              }
            />
          </div>

          {/* Historique */}
          <div className="mt-6 rounded-xl border bg-white/95 dark:bg-zinc-900/60 p-3 text-sm text-zinc-800 dark:text-zinc-200">
            <div className="flex justify-between mb-2">
              <span className="font-semibold">Historique (5 derniers)</span>
              {best && (
                <span className="text-yellow-500 font-bold">
                  Meilleur : ×{best.toFixed(2)}
                </span>
              )}
            </div>
            {history.length === 0 && (
              <div className="text-center text-zinc-500">
                Pas encore de parties.
              </div>
            )}
            {history.map((h, i) => (
              <div
                key={i}
                className="flex justify-between border-t py-1 text-sm"
              >
                <span>
                  {h.result === "win" ? "✅ Gagné" : "💥 Perdu"} à ×
                  {h.multi.toFixed(2)}
                </span>
                <span className="text-zinc-500">{h.time}s</span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </>
  );
}
