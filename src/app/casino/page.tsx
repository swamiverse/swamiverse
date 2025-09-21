"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Coins, Play, Pause, Dice6, Ticket } from "lucide-react";
import { usePixels } from "@/components/pixels-provider"; // 👈 hook global

// ————————————————————————————————
// Types & constants (Slots)
// ————————————————————————————————
export type SymbolKey = "seven" | "diamond" | "bell" | "star" | "cherry";
type SlotSymbol = {
  key: SymbolKey;
  label: string;
  weight: number;
  payout3: number;
  payout2?: number;
};

const SYMBOLS: SlotSymbol[] = [
  { key: "seven", label: "7️⃣", weight: 1, payout3: 20, payout2: 5 },
  { key: "diamond", label: "💎", weight: 2, payout3: 10, payout2: 3 },
  { key: "bell", label: "🔔", weight: 3, payout3: 5, payout2: 2 },
  { key: "star", label: "⭐", weight: 4, payout3: 4, payout2: 1 },
  { key: "cherry", label: "🍒", weight: 5, payout3: 3, payout2: 1 },
];

const WHEEL = SYMBOLS.flatMap((s) => Array.from({ length: s.weight }, () => s));
const pickRandom = () => WHEEL[Math.floor(Math.random() * WHEEL.length)];
function evaluate(reels: SlotSymbol[]) {
  const [a, b, c] = reels;
  if (a.key === b.key && b.key === c.key) {
    const s = SYMBOLS.find((x) => x.key === a.key)!;
    return { kind: "three", multiplier: s.payout3, symbol: s } as const;
  }
  if (a.key === b.key) {
    const s = SYMBOLS.find((x) => x.key === a.key)!;
    return { kind: "two", multiplier: s.payout2 ?? 0, symbol: s } as const;
  }
  if (b.key === c.key) {
    const s = SYMBOLS.find((x) => x.key === b.key)!;
    return { kind: "two", multiplier: s.payout2 ?? 0, symbol: s } as const;
  }
  return { kind: "none", multiplier: 0 } as const;
}

// ————————————————————————————————
// Types & constants (Scratchcard)
// ————————————————————————————————
type ScratchKey = "gold" | "gem" | "star" | "clover" | "dust";
type ScratchSymbol = {
  key: ScratchKey;
  label: string;
  weight: number; // higher = more common
  payout3: number; // payout multiplier relative to ticket cost
  payout2?: number;
};

const SCRATCH_COST = 20; // px pour acheter une carte
const SCRATCH_SYMBOLS: ScratchSymbol[] = [
  { key: "gold", label: "🪙", weight: 2, payout3: 15, payout2: 2 },
  { key: "gem", label: "💎", weight: 3, payout3: 10, payout2: 2 },
  { key: "star", label: "⭐", weight: 5, payout3: 6, payout2: 1 },
  { key: "clover", label: "🍀", weight: 8, payout3: 4, payout2: 1 },
  { key: "dust", label: "🫧", weight: 10, payout3: 0, payout2: 0 },
];

const SCRATCH_WHEEL = SCRATCH_SYMBOLS.flatMap((s) =>
  Array.from({ length: s.weight }, () => s)
);
const pickScratch = () =>
  SCRATCH_WHEEL[Math.floor(Math.random() * SCRATCH_WHEEL.length)];

function evalScratch(symbols: ScratchSymbol[]) {
  const [a, b, c] = symbols;
  if (a.key === b.key && b.key === c.key) {
    const s = SCRATCH_SYMBOLS.find((x) => x.key === a.key)!;
    return { kind: "three" as const, multiplier: s.payout3, symbol: s };
  }
  if (a.key === b.key || a.key === c.key || b.key === c.key) {
    const match = a.key === b.key || a.key === c.key ? a.key : b.key;
    const s = SCRATCH_SYMBOLS.find((x) => x.key === match)!;
    return { kind: "two" as const, multiplier: s.payout2 ?? 0, symbol: s };
  }
  return { kind: "none" as const, multiplier: 0 };
}

// ————————————————————————————————
// Page
// ————————————————————————————————
export default function CasinoPage() {
  const { pixels: balance, setPixels, addPixels } = usePixels(); // 👈 plus de reset
  const [bet, setBet] = useState(5);
  const [spinning, setSpinning] = useState(false);
  const [reels, setReels] = useState<SlotSymbol[]>([
    pickRandom(),
    pickRandom(),
    pickRandom(),
  ]);
  const [result, setResult] = useState<{
    kind: "none" | "two" | "three";
    multiplier: number;
    symbol?: SlotSymbol;
  } | null>(null);

  const lastUpdated = useMemo(
    () =>
      new Date().toLocaleString("fr-FR", {
        dateStyle: "medium",
        timeStyle: "short",
      }),
    []
  );

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.code === "Space") {
        e.preventDefault();
        handleSpin();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }); // pas de deps: ok ici

  const canSpin = !spinning && bet > 0 && balance >= bet;

  async function handleSpin() {
    if (!canSpin) return;
    setSpinning(true);
    setResult(null);
    setPixels(balance - bet); // 👈 retirer la mise

    const cycles = 16;
    for (let i = 0; i < cycles; i++) {
      setReels([pickRandom(), pickRandom(), pickRandom()]);
      const t = i / cycles;
      const delay = 35 + 130 * Math.sin(Math.PI * t);
      // eslint-disable-next-line no-await-in-loop
      await new Promise((r) => setTimeout(r, delay));
    }

    const finalReels = [pickRandom(), pickRandom(), pickRandom()];
    setReels(finalReels);
    const ev = evaluate(finalReels);
    setResult(ev);

    if (ev.multiplier > 0) {
      addPixels(bet * ev.multiplier); // 👈 ajouter le gain
    }

    setSpinning(false);
  }

  return (
    <>
      {/* Badge DB */}
      <div className="mt-6 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, y: -6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="inline-flex items-center gap-2 rounded-full border border-zinc-200 bg-black px-3 py-1 text-xs text-zinc-100 shadow-inner ring-1 ring-white/5 dark:border-zinc-800 dark:bg-zinc-900/50 dark:text-zinc-300"
          aria-live="polite"
        >
          <span role="img" aria-label="disquette">
            💾
          </span>
          <span>
            Page générée depuis <strong>SwamiVerse DB</strong> — MAJ :{" "}
            {lastUpdated}
          </span>
        </motion.div>
      </div>
      {/* Hero */}
      <section className="relative mt-10 grid gap-6 lg:mt-14 lg:grid-cols-12">
        <div className="lg:col-span-7">
          <motion.h1
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-4xl font-bold leading-tight tracking-tight sm:text-5xl"
          >
            SwamiCasino
          </motion.h1>
          <p className="mt-4 max-w-2xl text-lg text-zinc-700 dark:text-zinc-300">
            Mini-jeu slots côté client, juste pour le fun. Monnaie fictive («
            Pixels »), pas d’argent réel.
          </p>

          {/* Controls */}
          <div className="mt-6 flex flex-wrap items-center gap-3">
            <div className="inline-flex items-center gap-2 rounded-2xl border border-zinc-300 bg-white px-4 py-2 text-zinc-800 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-200">
              <Coins className="h-4 w-4 text-yellow-400" />
              <span className="text-sm">Solde</span>
              <span className="font-semibold text-yellow-500 dark:text-yellow-300">
                {balance} px
              </span>
            </div>

            <div className="inline-flex items-center gap-2 rounded-2xl border border-zinc-300 bg-white px-4 py-2 text-zinc-800 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-200">
              Mise
              <div className="ms-2 flex overflow-hidden rounded-xl border border-zinc-200 dark:border-zinc-800">
                {[1, 5, 10, 20].map((v) => (
                  <button
                    key={v}
                    disabled={spinning}
                    onClick={() => setBet(v)}
                    className={`px-3 py-1.5 text-sm transition ${
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
              <span className="text-zinc-500 dark:text-zinc-400">px</span>
            </div>

            <button
              onClick={handleSpin}
              disabled={!canSpin}
              className="inline-flex items-center gap-2 rounded-2xl bg-yellow-300 px-4 py-2 font-semibold text-black shadow-md ring-2 ring-yellow-200 transition hover:shadow-yellow-300/30 disabled:cursor-not-allowed disabled:opacity-60"
              aria-keyshortcuts="Space"
            >
              {spinning ? (
                <Pause className="h-4 w-4" />
              ) : (
                <Play className="h-4 w-4" />
              )}
              {spinning ? "En cours…" : "Lancer (Espace)"}
            </button>
          </div>

          <p className="mt-3 text-xs text-zinc-600 dark:text-zinc-500">
            Note: RNG local non contractuel. Si tu perds tout, tu gagnes quand
            même du karma (et un café).
          </p>
        </div>

        {/* Side note */}
        <motion.aside
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.05 }}
          className="lg:col-span-5"
        >
          <div
            className="relative overflow-hidden rounded-3xl
                          border border-zinc-200 bg-black p-5 text-white shadow-xl ring-1 ring-white/5
                          dark:border-zinc-800 dark:bg-gradient-to-b dark:from-zinc-900 dark:to-black dark:text-zinc-200"
          >
            <div className="pointer-events-none absolute -right-10 -top-10 h-40 w-40 rounded-full bg-yellow-300/10 blur-3xl" />
            <div className="flex items-start gap-3">
              <Dice6 className="mt-0.5 h-5 w-5 text-yellow-300" />
              <div>
                <div className="text-sm font-semibold text-yellow-300">
                  ⚠️ Jeu fictif
                </div>
                <p className="mt-1 text-sm">
                  Pixels non échangeables. Valeur nutritionnelle proche de 0.
                </p>
              </div>
            </div>
            <Link
              href="/garage"
              className="mt-4 inline-block rounded-xl bg-zinc-800/80 px-3 py-1.5 text-sm text-zinc-200 ring-1 ring-white/10 transition hover:bg-zinc-800"
            >
              Retour au Garage
            </Link>
          </div>
        </motion.aside>
      </section>
      {/* Machine */}
      <section className="mt-10">
        <div
          className="mx-auto max-w-3xl rounded-3xl
                        border border-zinc-200 bg-black p-6 text-white ring-1 ring-white/5
                        dark:border-zinc-800 dark:bg-gradient-to-b dark:from-zinc-900 dark:to-black dark:text-zinc-50"
        >
          <div className="grid grid-cols-3 gap-4">
            {reels.map((s, i) => (
              <Reel key={i} symbol={s} spinning={spinning} index={i} />
            ))}
          </div>

          <AnimatePresence initial={false}>
            {result && (
              <motion.div
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                className="mt-4 rounded-xl border border-zinc-300 bg-white/95 p-3 text-center text-sm text-zinc-800 dark:border-zinc-800 dark:bg-zinc-900/60 dark:text-zinc-200"
              >
                {result.kind === "three" && (
                  <span>
                    Jackpot {result.symbol?.label} ×3 ! Gain{" "}
                    <span className="font-semibold text-yellow-500 dark:text-yellow-300">
                      {bet * result.multiplier} px
                    </span>
                  </span>
                )}
                {result.kind === "two" && result.multiplier > 0 && (
                  <span>
                    Alignement ×2 ! Gain{" "}
                    <span className="font-semibold text-yellow-500 dark:text-yellow-300">
                      {bet * result.multiplier} px
                    </span>
                  </span>
                )}
                {result.kind !== "three" && result.kind !== "two" && (
                  <span>Pas cette fois… (essaie encore)</span>
                )}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Paytable */}
          <div className="mt-5 overflow-hidden rounded-xl border border-zinc-300 bg-white text-zinc-800 dark:border-zinc-800 dark:bg-transparent dark:text-inherit">
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
                    <td className="px-3 py-2 text-zinc-500 dark:text-zinc-400">
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
        </div>
      </section>

      {/* Scratchcard (3 cases) */}
      <section className="mt-12">
        <ScratchSection />
      </section>

      {/* MegaGratte (grattage réaliste sur grande carte) */}
      <section className="mt-12">
        <BigScratchSection />
      </section>
    </>
  );
}

function Reel({
  symbol,
  spinning,
  index,
}: {
  symbol: SlotSymbol;
  spinning: boolean;
  index: number;
}) {
  const ref = useRef<HTMLDivElement | null>(null);
  return (
    <div className="relative aspect-[1/1] select-none overflow-hidden rounded-2xl border border-zinc-300 bg-white text-6xl dark:border-zinc-800 dark:bg-gradient-to-b dark:from-zinc-950 dark:to-zinc-900">
      <motion.div
        ref={ref}
        aria-live="polite"
        role="img"
        className="flex h-full items-center justify-center"
        animate={spinning ? { rotateX: [0, 360] } : { rotateX: 0 }}
        transition={
          spinning
            ? { repeat: 3 + index, duration: 0.35, ease: "easeInOut" }
            : { duration: 0.2 }
        }
        style={{ transformStyle: "preserve-3d" }}
      >
        <span className="drop-shadow-[0_2px_6px_rgba(255,255,255,0.07)]">
          {symbol.label}
        </span>
      </motion.div>
    </div>
  );
}

// ————————————————————————————————
// Scratchcard Section (3 cases)
// ————————————————————————————————
function ScratchSection() {
  return (
    <div className="mx-auto max-w-3xl">
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.5 }}
        className="rounded-3xl border border-zinc-200 bg-gradient-to-b from-zinc-50 to-white p-6 dark:border-zinc-800 dark:from-zinc-950 dark:to-zinc-900"
      >
        <div className="flex items-start gap-3">
          <Ticket className="mt-0.5 h-5 w-5 text-yellow-500" />
          <div>
            <h2 className="text-xl font-bold">Carte à gratter</h2>
            <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
              Paie <strong>{SCRATCH_COST} pixels</strong> pour une carte. Aligne
              3 symboles pour un gros gain, 2 pour un bonus.
            </p>
          </div>
        </div>

        <div className="mt-5">
          <ScratchCard />
        </div>
      </motion.div>
    </div>
  );
}

function ScratchCard() {
  const { pixels: balance, setPixels, addPixels } = usePixels();
  const [state, setState] = useState<
    | { status: "idle" }
    | { status: "armed"; tiles: ScratchSymbol[]; revealed: boolean[] }
    | {
        status: "done";
        tiles: ScratchSymbol[];
        revealed: boolean[];
        outcome: ReturnType<typeof evalScratch>;
      }
  >({ status: "idle" });

  const canBuy = balance >= SCRATCH_COST && state.status === "idle";

  function buyCard() {
    if (!canBuy) return;
    setPixels(balance - SCRATCH_COST);
    const tiles = [pickScratch(), pickScratch(), pickScratch()];
    setState({ status: "armed", tiles, revealed: [false, false, false] });
  }

  function reveal(i: number) {
    if (state.status !== "armed") return;
    const revealed = [...state.revealed];
    if (revealed[i]) return;
    revealed[i] = true;
    const next = { ...state, revealed } as typeof state;
    // If all revealed, compute outcome
    if (revealed.every(Boolean)) {
      const outcome = evalScratch(state.tiles);
      if (outcome.multiplier > 0) {
        addPixels(SCRATCH_COST * outcome.multiplier);
      }
      setState({ status: "done", tiles: state.tiles, revealed, outcome });
    } else {
      setState(next);
    }
  }

  function tryAgain() {
    setState({ status: "idle" });
  }

  return (
    <div className="rounded-2xl border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-950">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="inline-flex items-center gap-2 rounded-xl bg-zinc-100 px-3 py-1.5 text-sm text-zinc-800 dark:bg-zinc-900 dark:text-zinc-200">
          <Coins className="h-4 w-4" /> Solde :
          <span className="font-semibold text-yellow-600 dark:text-yellow-300">
            {balance} px
          </span>
        </div>

        <button
          onClick={buyCard}
          disabled={!canBuy}
          className="rounded-xl bg-yellow-300 px-4 py-2 text-sm font-semibold text-black ring-2 ring-yellow-200 transition hover:shadow-md disabled:cursor-not-allowed disabled:opacity-60"
        >
          Acheter une carte ({SCRATCH_COST} px)
        </button>
      </div>

      {/* Board */}
      <div className="mt-4 grid grid-cols-3 gap-3">
        {[0, 1, 2].map((i) => (
          <ScratchTile key={i} idx={i} state={state} onReveal={reveal} />
        ))}
      </div>

      {/* Outcome */}
      {state.status === "done" && (
        <motion.div
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-4 rounded-xl border border-zinc-200 bg-zinc-50 p-3 text-center text-sm text-zinc-800 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-200"
        >
          {state.outcome.kind === "three" && (
            <span>
              JACKPOT ! {state.tiles[0].label}×3 — Gain
              <span className="mx-1 font-semibold text-yellow-600 dark:text-yellow-300">
                {SCRATCH_COST * state.outcome.multiplier} px
              </span>
              🎉
            </span>
          )}
          {state.outcome.kind === "two" && state.outcome.multiplier > 0 && (
            <span>
              Deux symboles identiques — Gain
              <span className="mx-1 font-semibold text-yellow-600 dark:text-yellow-300">
                {SCRATCH_COST * state.outcome.multiplier} px
              </span>
              ✅
            </span>
          )}
          {state.outcome.kind === "none" && <span>Rien cette fois… 😶‍🌫️</span>}

          <div className="mt-3">
            <button
              onClick={tryAgain}
              className="rounded-xl border border-zinc-300 bg-white px-3 py-1.5 text-sm dark:border-zinc-700 dark:bg-zinc-950"
            >
              Rejouer
            </button>
          </div>
        </motion.div>
      )}

      {/* Legend */}
      <div className="mt-5 overflow-hidden rounded-xl border border-zinc-200 bg-white text-zinc-800 dark:border-zinc-800 dark:bg-transparent dark:text-inherit">
        <table className="w-full border-collapse text-xs">
          <thead>
            <tr className="bg-zinc-100 text-zinc-700 dark:bg-zinc-900/60 dark:text-zinc-300">
              <th className="px-3 py-2 text-left">Symbole</th>
              <th className="px-3 py-2 text-left">Rareté</th>
              <th className="px-3 py-2 text-left">×3</th>
              <th className="px-3 py-2 text-left">×2</th>
            </tr>
          </thead>
          <tbody>
            {SCRATCH_SYMBOLS.map((s) => (
              <tr
                key={s.key}
                className="border-t border-zinc-200 dark:border-zinc-800"
              >
                <td className="px-3 py-2">{s.label}</td>
                <td className="px-3 py-2 text-zinc-500 dark:text-zinc-400">
                  {s.weight <= 2
                    ? "Rare"
                    : s.weight <= 3
                    ? "Peu"
                    : s.weight <= 5
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
    </div>
  );
}

function ScratchTile({
  idx,
  state,
  onReveal,
}: {
  idx: number;
  state:
    | { status: "idle" }
    | { status: "armed"; tiles: ScratchSymbol[]; revealed: boolean[] }
    | {
        status: "done";
        tiles: ScratchSymbol[];
        revealed: boolean[];
        outcome: ReturnType<typeof evalScratch>;
      };
  onReveal: (i: number) => void;
}) {
  const isRevealed = state.status !== "idle" && state.revealed[idx];
  const symbol = state.status === "idle" ? null : state.tiles[idx];

  return (
    <button
      onClick={() => onReveal(idx)}
      disabled={
        state.status === "idle" || isRevealed || state.status === "done"
      }
      className={`aspect-[4/3] w-full select-none rounded-2xl border px-3 py-2 text-4xl transition ${
        isRevealed
          ? "border-yellow-300 bg-white text-black dark:border-yellow-700 dark:bg-zinc-900"
          : "border-zinc-300 bg-gradient-to-b from-zinc-200 to-zinc-100 text-zinc-600 dark:border-zinc-700 dark:from-zinc-800 dark:to-zinc-900"
      }`}
      aria-label={isRevealed ? "Symbole révélé" : "Gratter / révéler"}
    >
      <motion.span
        initial={false}
        animate={{ scale: isRevealed ? 1 : 1, rotate: isRevealed ? 0 : 0 }}
        className="drop-shadow-[0_2px_6px_rgba(0,0,0,0.15)]"
      >
        {isRevealed ? symbol?.label : "?"}
      </motion.span>
    </button>
  );
}

// ————————————————————————————————
// Big Scratch Section (canvas grattage)
// ————————————————————————————————
function BigScratchSection() {
  return (
    <div className="mx-auto max-w-4xl">
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.5 }}
        className="overflow-hidden rounded-3xl border border-zinc-200 bg-gradient-to-b from-amber-50 to-white p-6 dark:border-zinc-800 dark:from-zinc-950 dark:to-black"
      >
        <h2 className="text-xl font-bold">Méga carte à gratter</h2>
        <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
          Gratte pour révéler la surprise. Seuil plus doux (≈35%) pour que ça
          aille vite.
        </p>
        <div className="mt-5">
          <BigScratchCard
            thresholdPct={35}
            brushRadius={28}
            rewards={[
              { px: 5, weight: 40, label: "Petit bonus" },
              { px: 12, weight: 30, label: "Beau butin" },
              { px: 25, weight: 20, label: "Gros lot" },
              { px: 0, weight: 10, label: "Poudre de pixel" },
            ]}
            titles={[
              "Mystery Pass",
              "Carte Secret",
              "Pixel Surprise",
              "Énigme du Casino",
            ]}
          />
        </div>
      </motion.div>
    </div>
  );
}

type RewardItem = { px: number; weight: number; label: string };

function BigScratchCard({
  thresholdPct = 35,
  brushRadius = 24, // rayon logique (sera multiplié par le DPR)
  rewards = [{ px: 10, weight: 1, label: "Récompense" }] as RewardItem[],
  titles = ["Pixel Surprise"],
}: {
  thresholdPct?: number;
  brushRadius?: number;
  rewards?: RewardItem[];
  titles?: string[];
}) {
  const { addPixels } = usePixels();
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const wrapRef = useRef<HTMLDivElement | null>(null);
  const [cleared, setCleared] = useState(0); // % approx
  const [revealed, setRevealed] = useState(false);
  const [claimed, setClaimed] = useState(false);
  const [title] = useState(
    () => titles[Math.floor(Math.random() * titles.length)]
  );
  const [prize, setPrize] = useState<RewardItem | null>(null);
  const lastPoint = useRef<{ x: number; y: number } | null>(null);

  function pickWeighted(items: RewardItem[]) {
    const total = items.reduce((s, it) => s + Math.max(0, it.weight), 0);
    let r = Math.random() * total;
    for (const it of items) {
      r -= Math.max(0, it.weight);
      if (r <= 0) return it;
    }
    return items[items.length - 1];
  }

  useEffect(() => {
    const canvas = canvasRef.current!;
    const wrap = wrapRef.current!;
    const dpr = Math.max(1, Math.min(2, window.devicePixelRatio || 1));

    function resize() {
      const rect = wrap.getBoundingClientRect();
      canvas.width = Math.floor(rect.width * dpr);
      canvas.height = Math.floor(((rect.width * 9) / 16) * dpr); // 16:9 card
      canvas.style.width = `${Math.floor(rect.width)}px`;
      canvas.style.height = `${Math.floor((rect.width * 9) / 16)}px`;
      drawCover();
    }

    function drawCover() {
      const ctx = canvas.getContext("2d")!;
      ctx.save();
      ctx.globalCompositeOperation = "source-over";
      const g = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
      g.addColorStop(0, "#cfcfcf");
      g.addColorStop(0.5, "#b5b5b5");
      g.addColorStop(1, "#d9d9d9");
      ctx.fillStyle = g;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.globalAlpha = 0.18;
      for (let i = -canvas.height; i < canvas.width; i += 40 * dpr) {
        ctx.beginPath();
        ctx.moveTo(i, 0);
        ctx.lineTo(i + canvas.height, canvas.height);
        ctx.lineWidth = 6 * dpr;
        ctx.strokeStyle = "white";
        ctx.stroke();
      }
      ctx.globalAlpha = 1;
      ctx.restore();
    }

    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(wrap);
    return () => ro.disconnect();
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current!;
    const ctx = canvas.getContext("2d")!;

    let isDown = false;
    let sampleEvery = 0;

    const dpr = Math.max(1, Math.min(2, window.devicePixelRatio || 1));
    const radius = brushRadius * dpr;

    function scratchAt(x: number, y: number) {
      ctx.save();
      ctx.globalCompositeOperation = "destination-out";
      ctx.beginPath();
      ctx.arc(x, y, radius, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }

    function handlePointerDown(e: PointerEvent) {
      if (revealed) return; // une fois révélé, on ne re-gratte plus
      isDown = true;
      const rect = canvas.getBoundingClientRect();
      const x = (e.clientX - rect.left) * dpr;
      const y = (e.clientY - rect.top) * dpr;
      lastPoint.current = { x, y };
      scratchAt(x, y);
    }

    function handlePointerMove(e: PointerEvent) {
      if (!isDown || revealed) return;
      const rect = canvas.getBoundingClientRect();
      const x = (e.clientX - rect.left) * dpr;
      const y = (e.clientY - rect.top) * dpr;
      const prev = lastPoint.current;
      if (prev) {
        const dx = x - prev.x;
        const dy = y - prev.y;
        const dist = Math.hypot(dx, dy);
        const steps = Math.max(1, Math.floor(dist / (radius * 0.6)));
        for (let i = 1; i <= steps; i++) {
          const t = i / steps;
          scratchAt(prev.x + dx * t, prev.y + dy * t);
        }
      } else {
        scratchAt(x, y);
      }
      lastPoint.current = { x, y };

      if (++sampleEvery % 10 === 0) {
        const { width, height } = canvas;
        try {
          const data = ctx.getImageData(0, 0, width, height).data;
          let clearedPix = 0;
          for (let i = 3; i < data.length; i += 32) {
            if (data[i] === 0) clearedPix++;
          }
          const total = Math.floor(data.length / 32);
          const ratio = clearedPix / total;
          const pct = Math.round(ratio * 100);
          setCleared(pct);
          if (pct >= thresholdPct && !revealed) {
            setRevealed(true);
            setPrize((p) => p ?? pickWeighted(rewards));
          }
        } catch {}
      }
    }

    function handlePointerUp() {
      isDown = false;
      lastPoint.current = null;
    }

    canvas.addEventListener("pointerdown", handlePointerDown);
    window.addEventListener("pointermove", handlePointerMove);
    window.addEventListener("pointerup", handlePointerUp);
    return () => {
      canvas.removeEventListener("pointerdown", handlePointerDown);
      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("pointerup", handlePointerUp);
    };
  }, [revealed, brushRadius, thresholdPct, rewards]);

  function claim() {
    if (claimed || !revealed || !prize) return;
    if (prize.px > 0) addPixels(prize.px);
    setClaimed(true);
  }

  return (
    <div className="relative">
      <div
        ref={wrapRef}
        className="relative aspect-video w-full overflow-hidden rounded-2xl border border-zinc-200 bg-gradient-to-br from-yellow-100 via-amber-50 to-white p-0 dark:border-zinc-800 dark:from-zinc-900 dark:via-zinc-950 dark:to-black"
      >
        {/* Contenu en dessous du revêtement */}
        <div className="absolute inset-0 grid place-items-center">
          <div className="text-center">
            <div className="text-4xl font-extrabold tracking-tight">
              {title}
            </div>
            <div className="mt-2 text-sm text-zinc-700 dark:text-zinc-300">
              {revealed ? (
                prize ? (
                  <>
                    Tu as trouvé : <strong>{prize.label}</strong>
                  </>
                ) : (
                  "Surprise débloquée"
                )
              ) : (
                "Gratte pour révéler la surprise"
              )}
            </div>
            {revealed && (
              <motion.div
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-4 text-xl"
              >
                {claimed ? (
                  <span className="inline-flex items-center gap-2 rounded-xl border border-emerald-300 bg-emerald-50 px-3 py-1.5 text-emerald-700 dark:border-emerald-700/60 dark:bg-emerald-900/20 dark:text-emerald-300">
                    ✅ Récompense récupérée
                  </span>
                ) : (
                  <button
                    onClick={claim}
                    className="rounded-xl bg-yellow-300 px-4 py-2 text-sm font-semibold text-black ring-2 ring-yellow-200 transition hover:shadow-md"
                  >
                    {prize ? `Réclamer ${prize.px} px` : "Réclamer"}
                  </button>
                )}
              </motion.div>
            )}
          </div>
        </div>

        {/* Revêtement à gratter */}
        <canvas
          ref={canvasRef}
          className="absolute inset-0 h-full w-full touch-none cursor-crosshair"
          style={{ pointerEvents: revealed ? "none" : "auto" }}
          aria-label="Surface à gratter"
        />
      </div>
      <div className="mt-3 flex items-center justify-between text-xs text-zinc-600 dark:text-zinc-400">
        <span>Surface révélée ≈ {cleared}%</span>
        <span>{revealed ? "Surprise débloquée" : "Gratte pour découvrir"}</span>
      </div>
    </div>
  );
}
