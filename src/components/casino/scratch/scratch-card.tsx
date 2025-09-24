"use client";

import { useEffect, useRef, useState } from "react";
import { Coins } from "lucide-react";
import { usePixels } from "@/components/pixels-provider";
import { SCRATCH_SYMBOLS, pickScratch, evalScratch } from "../casino-utils";
import ScratchTile from "./scratch-tile";
import { centerOf } from "../fx/use-px-pop";

export default function ScratchCard({
  popPlusAt,
  popMinusAt,
}: {
  popPlusAt: (x: number, y: number, text: string) => void;
  popMinusAt: (x: number, y: number, text: string) => void;
}) {
  const { pixels: balance, setPixels, addPixels } = usePixels();
  const [bet, setBet] = useState(5);
  const wrapRef = useRef<HTMLDivElement | null>(null);

  const [state, setState] = useState<
    | { status: "idle" }
    | { status: "armed"; tiles: any[]; revealed: boolean[] }
    | { status: "done"; tiles: any[]; revealed: boolean[]; outcome: any }
  >({ status: "idle" });

  const canBuy = balance >= bet && state.status === "idle";

  useEffect(() => {
    if (state.status === "armed" && state.tiles.length === 0) {
      setState({
        status: "armed",
        tiles: [pickScratch(), pickScratch(), pickScratch()],
        revealed: [false, false, false],
      });
    }
  }, [state]);

  function buyCard() {
    if (!canBuy) return;
    setPixels(balance - bet);
    const c = centerOf(wrapRef);
    popMinusAt(c.x, c.y, `-${bet} PX`);
    const tiles = [pickScratch(), pickScratch(), pickScratch()];
    setState({ status: "armed", tiles, revealed: [false, false, false] });
  }

  function reveal(i: number) {
    if (state.status !== "armed") return;
    const revealed = [...state.revealed];
    if (revealed[i]) return;
    revealed[i] = true;

    if (revealed.every(Boolean)) {
      const outcome = evalScratch(state.tiles);
      if (outcome.multiplier > 0) {
        const win = bet * outcome.multiplier;
        addPixels(win);
        const c = centerOf(wrapRef);
        popPlusAt(c.x, c.y, `+${win} PX`);
      }
      setState({ status: "done", tiles: state.tiles, revealed, outcome });
      setTimeout(() => setState({ status: "idle" }), 1500);
    } else {
      setState({ ...state, revealed });
    }
  }

  return (
    <div
      ref={wrapRef}
      className="rounded-2xl border bg-white p-4 dark:bg-zinc-950"
    >
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="inline-flex items-center gap-2 rounded-xl bg-zinc-100 px-3 py-1.5 text-sm dark:bg-zinc-900 dark:text-zinc-200">
          <Coins className="h-4 w-4" /> Solde :
          <span className="font-semibold text-yellow-600 dark:text-yellow-300">
            {balance} px
          </span>
        </div>

        {/* Mise + Lancer */}
        <div className="flex items-center gap-2">
          <div className="inline-flex items-center gap-2 rounded-2xl border px-3 py-1.5 text-sm">
            Mise
            <div className="ms-2 flex overflow-hidden rounded-xl border">
              {[1, 5, 10, 20, 50, 100].map((v) => (
                <button
                  key={v}
                  disabled={state.status !== "idle"}
                  onClick={() => setBet(v)}
                  className={`px-3 py-1.5 text-sm ${
                    bet === v ? "bg-yellow-300 text-black" : ""
                  }`}
                >
                  {v}
                </button>
              ))}
            </div>
            px
          </div>
          <button
            onClick={buyCard}
            disabled={!canBuy}
            className="rounded-xl bg-yellow-300 px-4 py-2 text-sm font-semibold text-black disabled:opacity-60"
          >
            Lancer ({bet} px)
          </button>
        </div>
      </div>

      {/* Board */}
      <div className="mt-4 grid grid-cols-3 gap-3">
        {[0, 1, 2].map((i) => (
          <ScratchTile key={i} idx={i} state={state} onReveal={reveal} />
        ))}
      </div>

      {/* Legend */}
      <div className="mt-5 overflow-hidden rounded-xl border text-xs">
        <table className="w-full">
          <thead>
            <tr className="bg-zinc-100 dark:bg-zinc-900/60">
              <th className="px-3 py-2 text-left">Symbole</th>
              <th className="px-3 py-2 text-left">×3</th>
              <th className="px-3 py-2 text-left">×2</th>
            </tr>
          </thead>
          <tbody>
            {SCRATCH_SYMBOLS.map((s) => (
              <tr key={s.key}>
                <td className="px-3 py-2">{s.label}</td>
                <td className="px-3 py-2">{s.payout3}×</td>
                <td className="px-3 py-2">{s.payout2 ?? 0}×</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
