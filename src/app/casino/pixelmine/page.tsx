"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Coins, Play, DollarSign, Bomb } from "lucide-react";
import { usePixels } from "@/components/pixels-provider";
import { usePxPop } from "@/components/casino/fx/use-px-pop";

type Cell = {
  index: number;
  revealed: boolean;
  isMine: boolean;
};

type HistoryItem = {
  mines: number;
  clicks: number;
  result: "win" | "lose";
  gain: number;
};

export default function PixelMinePage() {
  const { pixels: balance, setPixels, addPixels } = usePixels();
  const [bet, setBet] = useState(20);
  const [grid, setGrid] = useState<Cell[]>([]);
  const [playing, setPlaying] = useState(false);
  const [cashed, setCashed] = useState(false);
  const [multiplier, setMultiplier] = useState(1);
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [mineCount, setMineCount] = useState(3);

  const { overlay, popMinusAt, popPlusAt } = usePxPop();

  const size = 25; // 5x5
  const canPlay = !playing && bet > 0 && balance >= bet;

  function baseMultiplier(mines: number) {
    if (mines === 1) return 1.1;
    if (mines === 2) return 1.3;
    if (mines === 3) return 1.5;
    if (mines === 5) return 2;
    if (mines === 10) return 4;
    return 1;
  }

  function startGame() {
    if (!canPlay) return;
    const mineIndexes = new Set<number>();
    while (mineIndexes.size < mineCount) {
      mineIndexes.add(Math.floor(Math.random() * size));
    }
    const newGrid: Cell[] = Array.from({ length: size }, (_, i) => ({
      index: i,
      revealed: false,
      isMine: mineIndexes.has(i),
    }));
    setGrid(newGrid);
    setPlaying(true);
    setCashed(false);
    setMultiplier(baseMultiplier(mineCount));
    setPixels(balance - bet);

    const c = { x: window.innerWidth / 2, y: 100 };
    popMinusAt(c.x, c.y, `-${bet} PX`);
  }

  function clickCell(i: number) {
    if (!playing || cashed) return;
    const cell = grid[i];
    if (cell.revealed) return;

    if (cell.isMine) {
      // 💥 Perdu → révéler toutes les cases
      setGrid((prev) => prev.map((c) => ({ ...c, revealed: true })));
      endGame("lose", 0);
    } else {
      // Gain progressif
      setGrid((prev) =>
        prev.map((c) => (c.index === i ? { ...c, revealed: true } : c))
      );
      const newMulti = multiplier + 0.3 * (mineCount / 2);
      setMultiplier(parseFloat(newMulti.toFixed(2)));
    }
  }

  function cashOut() {
    if (!playing || cashed) return;
    const gain = Math.floor(bet * multiplier);
    addPixels(gain);
    setCashed(true);

    // 🔓 Révéler toutes les cases au moment de l'encaissement
    setGrid((prev) => prev.map((c) => ({ ...c, revealed: true })));

    endGame("win", gain);
    const c = { x: window.innerWidth / 2, y: 100 };
    popPlusAt(c.x, c.y, `+${gain} PX`);
  }

  function endGame(result: "win" | "lose", gain: number) {
    setPlaying(false);
    setHistory((h) => [
      {
        mines: mineCount,
        clicks: grid.filter((c) => c.revealed && !c.isMine).length,
        result,
        gain,
      },
      ...h.slice(0, 4),
    ]);
  }

  return (
    <>
      {overlay}

      <div className="mx-auto max-w-3xl py-12">
        {/* Header */}
        <div className="mb-2">
          <h1 className="text-4xl font-bold tracking-tight">PixelMine 💣</h1>
          <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
            Clique sur les cases… Encaisse avant de tomber sur une mine !
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

        {/* Carte mise + mines + bouton */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="rounded-3xl border bg-gradient-to-b from-zinc-50 to-white p-6 mb-6 dark:from-zinc-950 dark:to-zinc-900"
        >
          <div className="flex flex-col sm:flex-row justify-between gap-4">
            {/* Colonne gauche : mise + mines */}
            <div className="flex flex-col gap-3">
              {/* Sélecteur mise */}
              <div className="inline-flex items-center gap-2 rounded-2xl border bg-white px-3 py-1.5 text-sm dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-200">
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

              {/* Sélecteur bombes */}
              <div className="inline-flex items-center gap-2 rounded-2xl border bg-white px-3 py-1.5 text-sm dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-200">
                Mines
                <div className="ms-2 flex overflow-hidden rounded-xl border dark:border-zinc-800">
                  {[1, 2, 3, 5, 10].map((v) => (
                    <button
                      key={v}
                      disabled={playing}
                      onClick={() => setMineCount(v)}
                      className={`px-3 py-1.5 transition ${
                        mineCount === v
                          ? "bg-red-500 text-white"
                          : "hover:bg-zinc-100 dark:hover:bg-zinc-800"
                      }`}
                    >
                      {v}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Colonne droite : bouton + multiplicateur */}
            <div className="flex flex-col items-center gap-2">
              {!playing && (
                <button
                  onClick={startGame}
                  disabled={!canPlay}
                  className="flex h-[42px] items-center justify-center gap-2 rounded-2xl bg-yellow-300 px-5 text-sm font-semibold text-black shadow-md disabled:cursor-not-allowed disabled:opacity-60"
                  style={{ minWidth: 160 }}
                >
                  <Play className="h-4 w-4" /> Lancer ({bet} px)
                </button>
              )}
              {playing && !cashed && (
                <button
                  onClick={cashOut}
                  className="flex h-[42px] items-center justify-center gap-2 rounded-2xl bg-green-500 px-5 text-sm font-semibold text-white shadow-md"
                  style={{ minWidth: 160 }}
                >
                  <DollarSign className="h-4 w-4" /> Encaisser
                </button>
              )}

              {/* Multiplicateur en direct */}
              {playing && (
                <span className="text-lg font-bold text-yellow-500">
                  ×{multiplier.toFixed(2)}
                </span>
              )}
            </div>
          </div>
        </motion.div>

        {/* Carte grille */}
        <motion.div className="rounded-3xl border bg-gradient-to-b from-zinc-50 to-white p-6 dark:from-zinc-950 dark:to-zinc-900">
          <div className="w-full max-w-lg mx-auto">
            <div className="grid grid-cols-5 gap-2">
              {grid.map((cell) => (
                <button
                  key={cell.index}
                  disabled={cell.revealed || cashed || !playing}
                  onClick={() => clickCell(cell.index)}
                  className={`aspect-square rounded-lg border flex items-center justify-center text-2xl font-bold transition ${
                    cell.revealed
                      ? cell.isMine
                        ? "bg-red-500 text-white"
                        : "bg-yellow-400 text-black"
                      : "bg-zinc-200 dark:bg-zinc-700 hover:bg-zinc-300"
                  }`}
                >
                  {cell.revealed && cell.isMine && <Bomb className="w-8 h-8" />}
                  {cell.revealed && !cell.isMine && "💎"}
                </button>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Historique */}
        <div className="mt-6 rounded-3xl border bg-white/95 dark:bg-zinc-900/60 p-3 text-sm text-zinc-800 dark:text-zinc-200">
          <div className="font-semibold mb-2">Historique (5 derniers)</div>
          {history.length === 0 && (
            <div className="text-center text-zinc-500">
              Pas encore de parties.
            </div>
          )}
          {history.map((h, i) => (
            <div key={i} className="flex justify-between border-t py-1">
              <span>
                {h.result === "win" ? "✅ Gagné" : "💥 Perdu"} ({h.clicks}{" "}
                cases, {h.mines} mines)
              </span>
              <span>{h.gain} px</span>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
