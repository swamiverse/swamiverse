"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Coins, Play, DollarSign, DoorOpen, Skull } from "lucide-react";
import { usePixels } from "@/components/pixels-provider";
import { usePxPop, centerOf } from "@/components/casino/fx/use-px-pop";

type Door = {
  safe: boolean;
  revealed: boolean;
  chosen: boolean;
};

function makeStage(): Door[] {
  const doors: Door[] = [
    { safe: true, revealed: false, chosen: false },
    { safe: true, revealed: false, chosen: false },
    { safe: false, revealed: false, chosen: false },
  ];
  return doors.sort(() => Math.random() - 0.5);
}

export default function PixelTowerPage() {
  const { pixels: balance, setPixels, addPixels } = usePixels();
  const { overlay, popMinusAt, popPlusAt } = usePxPop();

  const [bet, setBet] = useState(20);
  const [doors, setDoors] = useState<Door[][]>([]);
  const [playing, setPlaying] = useState(false);
  const [cashed, setCashed] = useState(false);
  const [multiplier, setMultiplier] = useState(1);
  const [bestStage, setBestStage] = useState(0);

  const canPlay = !playing && bet > 0 && balance >= bet;

  function startGame() {
    if (!canPlay) return;
    setPlaying(true);
    setCashed(false);
    setMultiplier(1);
    setDoors([makeStage()]);
    setPixels(balance - bet);

    const c = { x: window.innerWidth / 2, y: 100 };
    popMinusAt(c.x, c.y, `-${bet} PX`);
  }

  function pickDoor(i: number) {
    if (!playing || cashed) return;

    setDoors((prev) =>
      prev.map((row, si) =>
        si === 0
          ? row.map((d, di) =>
              di === i
                ? { ...d, chosen: true, revealed: true }
                : { ...d, revealed: true }
            )
          : row
      )
    );

    const door = doors[0][i];
    if (door.safe) {
      setTimeout(() => {
        setDoors((prev) => {
          const newDoors = [makeStage(), ...prev];
          setBestStage((b) => Math.max(b, newDoors.length));
          return newDoors;
        });
        setMultiplier((m) => parseFloat((m + 0.5).toFixed(2)));
      }, 600);
    } else {
      endGame("lose", 0);
    }
  }

  function cashOut() {
    if (!playing || cashed) return;
    const gain = Math.floor(bet * multiplier);
    addPixels(gain);
    setCashed(true);
    endGame("win", gain);

    const c = { x: window.innerWidth / 2, y: 100 };
    popPlusAt(c.x, c.y, `+${gain} PX`);
  }

  function endGame(_result: "win" | "lose", _gain: number) {
    setPlaying(false);
  }

  return (
    <>
      {overlay}

      <div className="mx-auto max-w-3xl py-12">
        {/* Header */}
        <div className="mb-2">
          <h1 className="text-4xl font-bold tracking-tight">PixelTower 🏰</h1>
          <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
            Monte étage par étage, mais attention aux têtes de mort !
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

        {/* Mise + bouton */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="rounded-3xl border bg-gradient-to-b from-zinc-50 to-white p-6 mb-6 dark:from-zinc-950 dark:to-zinc-900"
        >
          <div className="flex flex-col sm:flex-row justify-between gap-4">
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

            <div className="flex items-center justify-end flex-1">
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
            </div>
          </div>
        </motion.div>

        {/* Tour */}
        <motion.div className="rounded-3xl border bg-gradient-to-b from-zinc-50 to-white p-6 dark:from-zinc-950 dark:to-zinc-900">
          {playing && (
            <div className="text-center mb-4">
              <span className="text-3xl font-extrabold text-yellow-500">
                ×{multiplier.toFixed(2)}
              </span>
            </div>
          )}

          <div className="flex flex-col items-center gap-6">
            {doors.slice(0, 4).map((row, si) => {
              const stageNumber = doors.length - si;
              return (
                <div key={si} className="flex flex-col items-center gap-2">
                  <span className="text-xs text-zinc-500">
                    Étage {stageNumber}
                  </span>
                  <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4 }}
                    className="flex gap-6"
                  >
                    {row.map((d, di) => (
                      <button
                        key={di}
                        disabled={d.revealed || !playing || cashed || si !== 0}
                        onClick={() => pickDoor(di)}
                        className={`w-24 h-32 rounded-xl border flex items-center justify-center text-2xl font-bold transition ${
                          d.revealed
                            ? d.safe
                              ? "bg-yellow-400 text-black"
                              : "bg-red-500 text-white"
                            : "bg-zinc-200 dark:bg-zinc-700 hover:bg-zinc-300"
                        }`}
                      >
                        {d.revealed ? (
                          d.safe ? (
                            <DoorOpen className="w-8 h-8" />
                          ) : (
                            <Skull className="w-8 h-8" />
                          )
                        ) : (
                          "❓"
                        )}
                      </button>
                    ))}
                  </motion.div>
                </div>
              );
            })}
          </div>

          {/* Score étage */}
          <div className="mt-6 rounded-xl border bg-white/95 dark:bg-zinc-900/60 p-2 text-center text-sm">
            <p>Étage actuel : {doors.length}</p>
            <p>🏆 Meilleur étage : {bestStage}</p>
          </div>
        </motion.div>
      </div>
    </>
  );
}
