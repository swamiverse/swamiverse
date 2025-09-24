"use client";

import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { Coins, Play } from "lucide-react";
import { usePixels } from "@/components/pixels-provider";
import { usePxPop, centerOf } from "@/components/casino/fx/use-px-pop";

type Racer = "rouge" | "bleu" | "vert";

type HistoryItem = {
  bet: Racer;
  winner: Racer;
  result: "win" | "lose";
};

export default function PixelRacePage() {
  const { pixels: balance, setPixels, addPixels } = usePixels();
  const [bet, setBet] = useState(20);
  const [chosen, setChosen] = useState<Racer | null>(null);
  const [running, setRunning] = useState(false);
  const [positions, setPositions] = useState<Record<Racer, number>>({
    rouge: 0,
    bleu: 0,
    vert: 0,
  });
  const [winner, setWinner] = useState<Racer | null>(null);

  const [history, setHistory] = useState<HistoryItem[]>([]);
  const raceRef = useRef<HTMLDivElement | null>(null);
  const { overlay, popMinusAt, popPlusAt } = usePxPop();

  const canPlay = !running && chosen && bet > 0 && balance >= bet;

  function startRace() {
    if (!canPlay || !chosen) return;
    setPixels(balance - bet);
    const c = centerOf(raceRef);
    popMinusAt(c.x, c.y, `-${bet} PX`);

    setRunning(true);
    setWinner(null);
    setPositions({ rouge: 0, bleu: 0, vert: 0 });

    const trackWidth = raceRef.current?.offsetWidth ?? 400;
    const finish = trackWidth - 40; // marge avant la ligne

    const interval = setInterval(() => {
      setPositions((prev) => {
        const next = { ...prev };
        let finished: Racer | null = null;

        (Object.keys(next) as Racer[]).forEach((r) => {
          if (next[r] < finish) {
            // pas d’avancement réaliste : 20 → 60 px
            next[r] += 20 + Math.random() * 40;
            if (next[r] >= finish && !finished) {
              finished = r;
            }
          }
        });

        if (finished) {
          clearInterval(interval);
          setRunning(false);
          setWinner(finished);

          if (finished === chosen) {
            const gain = bet * 2;
            addPixels(gain);
            popPlusAt(c.x, c.y, `+${gain} PX`);
            setHistory((h) => [
              { bet: chosen, winner: finished, result: "win" },
              ...h.slice(0, 4),
            ]);
          } else {
            setHistory((h) => [
              { bet: chosen, winner: finished, result: "lose" },
              ...h.slice(0, 4),
            ]);
          }
        }

        return next;
      });
    }, 200);
  }

  return (
    <>
      {overlay}

      <div className="mx-auto max-w-3xl py-12">
        {/* Header */}
        <div className="mb-2">
          <h1 className="text-4xl font-bold tracking-tight flex items-center gap-2">
            PixelRace 🏁
          </h1>
          <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
            Choisis ton coureur, mise et regarde qui franchit la ligne en
            premier.
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
          ref={raceRef}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="rounded-3xl border bg-gradient-to-b from-zinc-50 to-white p-6 dark:from-zinc-950 dark:to-zinc-900"
        >
          {/* Mise + bouton lancer */}
          <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            {/* Choix mise */}
            <div className="inline-flex items-center gap-2 rounded-2xl border bg-white px-3 py-1.5 text-sm text-zinc-800 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-200">
              Mise
              <div className="ms-2 flex overflow-hidden rounded-xl border dark:border-zinc-800">
                {[10, 20, 50, 100, 200, 500, 1000].map((v) => (
                  <button
                    key={v}
                    disabled={running}
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

            {/* Bouton lancer */}
            <div className="flex sm:justify-end justify-center w-full sm:w-auto">
              <button
                onClick={startRace}
                disabled={!canPlay}
                className="flex h-[42px] items-center justify-center gap-2 rounded-2xl bg-yellow-300 px-5 text-sm font-semibold text-black shadow-md disabled:cursor-not-allowed disabled:opacity-60"
                style={{ minWidth: "160px" }}
              >
                <Play className="h-4 w-4" /> Lancer ({bet} px)
              </button>
            </div>
          </div>

          {/* Choix coureur */}
          <div className="flex justify-center gap-4 mb-6">
            {(["rouge", "bleu", "vert"] as Racer[]).map((r) => (
              <button
                key={r}
                disabled={running}
                onClick={() => setChosen(r)}
                className={`px-6 py-3 rounded-xl border text-lg font-semibold flex items-center gap-2 ${
                  chosen === r
                    ? "bg-yellow-400 text-black border-yellow-600"
                    : "bg-neutral-800 text-white"
                }`}
              >
                <span className="text-2xl">
                  {r === "rouge" ? "🚗" : r === "bleu" ? "🚙" : "🚕"}
                </span>
                {r.charAt(0).toUpperCase() + r.slice(1)}
              </button>
            ))}
          </div>

          {/* Piste */}
          <div className="space-y-4 mb-6">
            {(["rouge", "bleu", "vert"] as Racer[]).map((r) => (
              <div
                key={r}
                className="relative h-10 rounded-xl bg-zinc-800 overflow-hidden"
              >
                <motion.div
                  className="absolute left-0 top-1/2 -translate-y-1/2 text-2xl"
                  animate={{ x: positions[r] }}
                  transition={{ duration: 0.2 }}
                >
                  {r === "rouge" ? "🚗" : r === "bleu" ? "🚙" : "🚕"}
                </motion.div>
              </div>
            ))}
          </div>

          {/* Résultat */}
          <div className="mt-4 rounded-xl border bg-white/95 p-3 text-center text-sm text-zinc-800 dark:bg-zinc-900/60 dark:text-zinc-200 min-h-[40px] flex items-center justify-center">
            {winner
              ? winner === chosen
                ? "✅ Tu as gagné !"
                : `💀 Perdu… Vainqueur : ${winner}`
              : "Choisis un coureur et lance la course…"}
          </div>

          {/* Historique */}
          <div className="mt-6 rounded-xl border bg-white/95 dark:bg-zinc-900/60 p-3 text-sm text-zinc-800 dark:text-zinc-200">
            <div className="font-semibold mb-2">Historique (5 dernières)</div>
            {history.length === 0 && (
              <div className="text-center text-zinc-500">
                Pas encore de courses.
              </div>
            )}
            {history.map((h, i) => (
              <div
                key={i}
                className="flex justify-between border-t py-1 text-sm"
              >
                <span>Pari: {h.bet}</span>
                <span>Vainqueur: {h.winner}</span>
                <span>{h.result === "win" ? "✅ Gagné" : "💀 Perdu"}</span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </>
  );
}
