"use client";

import Link from "next/link";
import React, { useEffect, useMemo, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Coins, Play, Pause, Dice6, Ticket } from "lucide-react";
import { usePixels } from "@/components/pixels-provider";

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

// 💎 Jackpot boosté
const SYMBOLS: SlotSymbol[] = [
  { key: "seven", label: "7️⃣", weight: 1, payout3: 500, payout2: 50 },
  { key: "diamond", label: "💎", weight: 2, payout3: 200, payout2: 25 },
  { key: "bell", label: "🔔", weight: 3, payout3: 100, payout2: 15 },
  { key: "star", label: "⭐", weight: 4, payout3: 50, payout2: 10 },
  { key: "cherry", label: "🍒", weight: 5, payout3: 20, payout2: 5 },
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
// Types & constants (Scratchcards)
// ————————————————————————————————
type ScratchKey = "gold" | "gem" | "star" | "clover" | "dust";
type ScratchSymbol = {
  key: ScratchKey;
  label: string;
  weight: number;
  payout3: number;
  payout2?: number;
};

// Les petites cartes gardent une logique de lots “symboles”
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
// FX: bulles PX (jaune + et rouge –) façon PXBubbles
// ————————————————————————————————
type FxItem = {
  id: string;
  x: number;
  y: number;
  text: string;
  kind: "plus" | "minus";
  dx?: number; // petit décalage horizontal
};
function usePxPop() {
  const [fx, setFx] = useState<FxItem[]>([]);

  function spawn(item: Omit<FxItem, "id">) {
    const id = crypto.randomUUID();
    const it: FxItem = { id, ...item };
    setFx((arr) => [...arr, it]);
    setTimeout(() => setFx((arr) => arr.filter((f) => f.id !== id)), 750);
  }

  // +PX (monte)
  function popPlusAt(x: number, y: number, text: string) {
    spawn({ x, y, text, kind: "plus", dx: 0 });
  }
  // –PX (descend) — décentré légèrement à droite (+16 px)
  function popMinusAt(x: number, y: number, text: string) {
    spawn({ x, y, text, kind: "minus", dx: 16 });
  }

  const overlay = (
    <AnimatePresence>
      {fx.map((f) => {
        const isPlus = f.kind === "plus";
        return (
          <motion.div
            key={f.id}
            initial={{ opacity: 0, y: 0, scale: 0.9 }}
            animate={{ opacity: 1, y: isPlus ? -24 : 24, scale: 1 }}
            exit={{ opacity: 0, y: isPlus ? -40 : 40, scale: 1.05 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="pointer-events-none fixed z-[70] select-none text-xs font-bold"
            style={{
              left: f.x + (f.dx ?? 0),
              top: f.y,
              transform: "translate(-50%, -50%)",
            }}
          >
            <div
              className="rounded-full px-2 py-1 shadow-lg"
              style={{
                background: isPlus ? "#FFD21E" : "#FF3B30",
                color: isPlus ? "#000" : "#fff",
                border: "2px solid #000",
              }}
            >
              {f.text}
            </div>
          </motion.div>
        );
      })}
    </AnimatePresence>
  );

  // compat rétro: popAt reste le “+”
  return { popAt: popPlusAt, popPlusAt, popMinusAt, overlay };
}

function centerOf(ref: React.RefObject<HTMLElement | null>) {
  if (!ref.current)
    return { x: window.innerWidth / 2, y: window.innerHeight / 2 };
  const r = ref.current.getBoundingClientRect();
  return { x: r.left + r.width / 2, y: r.top + r.height / 2 };
}

// ————————————————————————————————
// Page
// ————————————————————————————————
export default function CasinoPage() {
  const { pixels: balance, setPixels, addPixels } = usePixels();
  const [bet, setBet] = useState(5);
  const [spinning, setSpinning] = useState(false);
  const [reels, setReels] = useState<SlotSymbol[]>([]);

  useEffect(() => {
    if (reels.length === 0) {
      setReels([pickRandom(), pickRandom(), pickRandom()]);
    }
  }, [reels]);

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

  // FX overlay global (réutilisé partout)
  const { popAt: popPlusAt, popMinusAt, overlay } = usePxPop();
  const machineRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.code === "Space") {
        e.preventDefault();
        handleSpin();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  });

  const canSpin = !spinning && bet > 0 && balance >= bet;

  async function handleSpin() {
    if (!canSpin) return;
    setSpinning(true);
    setResult(null);

    // Débit + bulle rouge –BET
    setPixels(balance - bet);
    const c = centerOf(machineRef);
    popMinusAt(c.x, c.y, `-${bet} PX`);

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
      const win = bet * ev.multiplier;
      addPixels(win);
      // Bulle jaune +WIN
      const c2 = centerOf(machineRef);
      popPlusAt(c2.x, c2.y, `+${win} PX`);
    }

    setSpinning(false);
  }

  return (
    <>
      {overlay /* FX global */}

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
            Mini-jeux côté client, juste pour le fun. Monnaie fictive (« Pixels
            »).
          </p>
        </div>

        {/* Side note */}
        <motion.aside
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.05 }}
          className="lg:col-span-5"
        >
          <div className="relative overflow-hidden rounded-3xl border border-zinc-200 bg-black p-5 text-white shadow-xl ring-1 ring-white/5 dark:border-zinc-800 dark:bg-gradient-to-b dark:from-zinc-900 dark:to-black dark:text-zinc-200">
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

      {/* Machine (Slots) */}
      <section className="mt-10">
        <div
          ref={machineRef}
          className="mx-auto max-w-3xl rounded-3xl border border-zinc-200 bg-black p-6 text-white ring-1 ring-white/5 dark:border-zinc-800 dark:bg-gradient-to-b dark:from-zinc-900 dark:to-black dark:text-zinc-50"
        >
          {/* Solde */}
          <div className="mb-4 inline-flex items-center gap-2 rounded-2xl border border-zinc-300 bg-white px-4 py-2 text-zinc-800 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-200">
            <Coins className="h-4 w-4 text-yellow-400" />
            <span className="text-sm">Solde</span>
            <span className="font-semibold text-yellow-500 dark:text-yellow-300">
              {balance} px
            </span>
          </div>

          {/* Rouleaux */}
          <div className="grid grid-cols-3 gap-4">
            {reels.map((s, i) => (
              <Reel key={i} symbol={s} spinning={spinning} index={i} />
            ))}
          </div>

          {/* Contrôles */}
          <div className="mt-6 flex flex-wrap items-center gap-3 justify-center">
            <div className="inline-flex items-center gap-2 rounded-2xl border border-zinc-300 bg-white px-4 py-2 text-zinc-800 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-200">
              Mise
              <div className="ms-2 flex overflow-hidden rounded-xl border border-zinc-200 dark:border-zinc-800">
                {[1, 5, 10, 20, 50, 100, 200, 500].map((v) => (
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

          {/* Résultat (sous Paytable) */}
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
                    🎰 JACKPOT {result.symbol?.label} ×3 ! Gain{" "}
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
        </div>
      </section>

      {/* Scratchcard (petites cartes, avec mises & auto reset) */}
      <section className="mt-12">
        <ScratchSection popPlusAt={popPlusAt} popMinusAt={popMinusAt} />
      </section>

      {/* Méga carte à gratter (récompenses 50–1000, 10k ultra rare, reset 200) */}
      <section className="mt-12">
        <BigScratchSection popMinusAt={popMinusAt} />
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
// Scratchcard Section (petites cartes) — avec mises + auto reset + FX PX
// ————————————————————————————————
function ScratchSection({
  popPlusAt,
  popMinusAt,
}: {
  popPlusAt: (x: number, y: number, text: string) => void;
  popMinusAt: (x: number, y: number, text: string) => void;
}) {
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
              Choisis ta mise, lance une carte, aligne 3 symboles pour un gros
              gain, 2 pour un bonus. Le résultat apparaît sous les lots et la
              carte se réinitialise automatiquement.
            </p>
          </div>
        </div>

        <div className="mt-5">
          <ScratchCard popPlusAt={popPlusAt} popMinusAt={popMinusAt} />
        </div>
      </motion.div>
    </div>
  );
}

function ScratchCard({
  popPlusAt,
  popMinusAt,
}: {
  popPlusAt: (x: number, y: number, text: string) => void;
  popMinusAt: (x: number, y: number, text: string) => void;
}) {
  const { pixels: balance, setPixels, addPixels } = usePixels();

  // Mise
  const [bet, setBet] = useState(5);

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

  const wrapRef = useRef<HTMLDivElement | null>(null);

  const canBuy = balance >= bet && state.status === "idle";

  // Sécurise l'init des tiles côté client (évite mismatch SSR)
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

    // FX dépense
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
    const next = { ...state, revealed } as typeof state;

    // Si tout révélé => outcome
    if (revealed.every(Boolean)) {
      const outcome = evalScratch(state.tiles);

      if (outcome.multiplier > 0) {
        const win = bet * outcome.multiplier;
        addPixels(win);

        // Pop FX au centre
        const c = centerOf(wrapRef);
        popPlusAt(c.x, c.y, `+${win} PX`);
      }

      setState({ status: "done", tiles: state.tiles, revealed, outcome });

      // 🔥 Auto-reset après un délai
      setTimeout(() => {
        setState({ status: "idle" });
      }, 1500);
    } else {
      setState(next);
    }
  }

  return (
    <div
      ref={wrapRef}
      className="rounded-2xl border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-950"
    >
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="inline-flex items-center gap-2 rounded-xl bg-zinc-100 px-3 py-1.5 text-sm text-zinc-800 dark:bg-zinc-900 dark:text-zinc-200">
          <Coins className="h-4 w-4" /> Solde :
          <span className="font-semibold text-yellow-600 dark:text-yellow-300">
            {balance} px
          </span>
        </div>

        {/* Contrôles de mise + Lancer */}
        <div className="flex items-center gap-2">
          <div className="inline-flex items-center gap-2 rounded-2xl border border-zinc-300 bg-white px-3 py-1.5 text-zinc-800 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-200">
            Mise
            <div className="ms-2 flex overflow-hidden rounded-xl border border-zinc-200 dark:border-zinc-800">
              {[1, 5, 10, 20, 50, 100, 200, 500].map((v) => (
                <button
                  key={v}
                  disabled={state.status !== "idle"}
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
            onClick={buyCard}
            disabled={!canBuy}
            className="rounded-xl bg-yellow-300 px-4 py-2 text-sm font-semibold text-black ring-2 ring-yellow-200 transition hover:shadow-md disabled:cursor-not-allowed disabled:opacity-60"
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

      {/* Legend (lots) */}
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
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [cleared, setCleared] = useState(0);

  const isRevealed = state.status !== "idle" && state.revealed[idx];
  const symbol = state.status === "idle" ? null : state.tiles[idx];

  useEffect(() => {
    // On ne met le revêtement que si la carte est "armed" et pas encore révélée
    if (state.status !== "armed" || isRevealed) return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const dpr = window.devicePixelRatio || 1;

    function drawCover() {
      canvas.width = canvas.offsetWidth * dpr;
      canvas.height = canvas.offsetHeight * dpr;
      ctx.fillStyle = "#999"; // couleur du "revêtement"
      ctx.fillRect(0, 0, canvas.width, canvas.height);
    }
    drawCover();

    let isDown = false;
    const brush = 30 * dpr; // pinceau plus gros et homogène

    function scratch(x: number, y: number) {
      ctx.save();
      ctx.globalCompositeOperation = "destination-out";
      ctx.beginPath();
      ctx.arc(x, y, brush, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }

    function pointerDown(e: PointerEvent) {
      if (isRevealed) return;
      isDown = true;
      const rect = canvas.getBoundingClientRect();
      scratch((e.clientX - rect.left) * dpr, (e.clientY - rect.top) * dpr);
    }

    function pointerMove(e: PointerEvent) {
      if (!isDown || isRevealed) return;
      const rect = canvas.getBoundingClientRect();
      scratch((e.clientX - rect.left) * dpr, (e.clientY - rect.top) * dpr);

      // Vérifie si on a gratté assez
      const data = ctx.getImageData(0, 0, canvas.width, canvas.height).data;
      let clearedPixels = 0;
      for (let i = 3; i < data.length; i += 4 * 16) {
        if (data[i] === 0) clearedPixels++;
      }
      const ratio = clearedPixels / (data.length / 4 / 16);
      const pct = Math.round(ratio * 100);

      if (pct > 70) {
        onReveal(idx); // ✅ Dévoile la carte
      }
    }

    function pointerUp() {
      isDown = false;
    }

    canvas.addEventListener("pointerdown", pointerDown);
    window.addEventListener("pointermove", pointerMove);
    window.addEventListener("pointerup", pointerUp);

    return () => {
      canvas.removeEventListener("pointerdown", pointerDown);
      window.removeEventListener("pointermove", pointerMove);
      window.removeEventListener("pointerup", pointerUp);
    };
  }, [state.status, isRevealed, idx, onReveal]);

  return (
    <div
      className={`relative aspect-[4/3] w-full select-none rounded-2xl border px-3 py-2 text-4xl ${
        isRevealed
          ? "border-yellow-300 bg-white text-black dark:border-yellow-700 dark:bg-zinc-900"
          : "border-zinc-300 bg-gradient-to-b from-zinc-200 to-zinc-100 text-zinc-600 dark:border-zinc-700 dark:from-zinc-800 dark:to-zinc-900"
      }`}
    >
      {/* Symbole */}
      <div className="flex h-full w-full items-center justify-center">
        {isRevealed ? symbol?.label : "?"}
      </div>

      {/* Overlay scratchable */}
      {state.status === "armed" && !isRevealed && (
        <canvas
          ref={canvasRef}
          className="absolute inset-0 w-full h-full rounded-2xl"
        />
      )}
    </div>
  );
}

// ————————————————————————————————
// Big Scratch Section — méga carte à gratter (récompenses 50–1000, 10000 ultra-rare, reset=200)
// ————————————————————————————————
function BigScratchSection({
  popMinusAt,
}: {
  popMinusAt: (x: number, y: number, text: string) => void;
}) {
  return (
    <div className="mx-auto max-w-4xl">
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.5 }}
        className="overflow-hidden rounded-3xl border border-zinc-200 bg-gradient-to-b from-amber-50 to-white p-6 dark:border-zinc-800 dark:from-zinc-950 dark:to-black"
      >
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold">Méga carte à gratter</h2>
            <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
              Révèle un bonus. Les récompenses vont de <strong>50</strong> à{" "}
              <strong>1000 px</strong>, avec une{" "}
              <strong>chance ultra-rare</strong> de décrocher{" "}
              <strong>10000 px</strong>. <br />
              Tu peux <em>reset</em> la carte pour <strong>200 px</strong>.
            </p>
          </div>
        </div>

        <div className="mt-5">
          <BigScratchCard
            thresholdPct={70}
            brushRadius={60}
            titles={[
              "Mystery Pass",
              "Carte Secret",
              "Pixel Surprise",
              "Énigme du Casino",
            ]}
            popMinusAt={popMinusAt}
          />
        </div>
      </motion.div>
    </div>
  );
}

type RewardItem = { px: number; weight: number; label: string };

const RESET_COST = 200;

// Distribution par défaut (poids relatifs)
// - 10000 ultra-rare
// - 50–1000 gradués
const DEFAULT_REWARDS: RewardItem[] = [
  { px: 50, weight: 240, label: "Petit bonus" },
  { px: 100, weight: 200, label: "Bonus sympa" },
  { px: 200, weight: 150, label: "Beau butin" },
  { px: 400, weight: 100, label: "Gros lot" },
  { px: 600, weight: 60, label: "Super lot" },
  { px: 800, weight: 35, label: "Méga lot" },
  { px: 1000, weight: 15, label: "Jackpot rare" },
  { px: 10000, weight: 1, label: "ULTRA JACKPOT" },
];

function BigScratchCard({
  thresholdPct = 70,
  brushRadius = 40, // pinceau très gros
  titles = ["Pixel Surprise"],
  rewards = DEFAULT_REWARDS,
  popMinusAt,
}: {
  thresholdPct?: number;
  brushRadius?: number;
  titles?: string[];
  rewards?: RewardItem[];
  popMinusAt: (x: number, y: number, text: string) => void;
}) {
  const { pixels: balance, setPixels, addPixels } = usePixels();
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const wrapRef = useRef<HTMLDivElement | null>(null);

  const [cleared, setCleared] = useState(0);
  const [revealed, setRevealed] = useState(false);
  const [claimed, setClaimed] = useState(false);
  const [title] = useState(
    () => titles[Math.floor(Math.random() * titles.length)]
  );
  const [prize, setPrize] = useState<RewardItem | null>(null);
  const [coverSeed, setCoverSeed] = useState(0);
  const [gainFx, setGainFx] = useState<{ id: string; text: string } | null>(
    null
  );

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

  // Dessin / redimensionnement
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const wrap = wrapRef.current!;
    const dpr = Math.max(1, Math.min(2, window.devicePixelRatio || 1));

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

    function resize() {
      const rect = wrap.getBoundingClientRect();
      canvas.width = Math.floor(rect.width * dpr);
      canvas.height = Math.floor(((rect.width * 9) / 16) * dpr);
      canvas.style.width = `${Math.floor(rect.width)}px`;
      canvas.style.height = `${Math.floor((rect.width * 9) / 16)}px`;
      drawCover();
      setCleared(0);
      lastPoint.current = null;
    }

    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(wrap);
    return () => ro.disconnect();
  }, [coverSeed]);

  // Interaction grattage
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || revealed) return;

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
      if (revealed) return;
      isDown = true;
      const rect = canvas.getBoundingClientRect();
      scratchAt((e.clientX - rect.left) * dpr, (e.clientY - rect.top) * dpr);
    }

    function handlePointerMove(e: PointerEvent) {
      if (!isDown || revealed) return;
      const rect = canvas.getBoundingClientRect();
      scratchAt((e.clientX - rect.left) * dpr, (e.clientY - rect.top) * dpr);

      if (++sampleEvery % 10 === 0) {
        const { width, height } = canvas;
        const data = ctx.getImageData(0, 0, width, height).data;
        let clearedPix = 0;
        for (let i = 3; i < data.length; i += 32) {
          if (data[i] === 0) clearedPix++;
        }
        const pct = Math.round((clearedPix / (data.length / 32)) * 100);
        setCleared(pct);

        if (pct >= thresholdPct) {
          setRevealed(true);
          setPrize((p) => p ?? pickWeighted(rewards));
        }
      }
    }

    function handlePointerUp() {
      isDown = false;
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

  // Réclamer récompense
  function claim() {
    if (claimed || !revealed || !prize) return;
    if (prize.px > 0) {
      addPixels(prize.px);
      const id = crypto.randomUUID();
      setGainFx({ id, text: `+${prize.px} PX` });
      setTimeout(() => setGainFx(null), 800);
    }
    setClaimed(true);
  }

  function resetCard() {
    if (balance < RESET_COST) return;
    setPixels(balance - RESET_COST);
    const c = centerOf(wrapRef);
    popMinusAt(c.x, c.y, `-${RESET_COST} PX`);
    setRevealed(false);
    setClaimed(false);
    setPrize(null);
    setGainFx(null);
    setCoverSeed((s) => s + 1);
  }

  return (
    <div className="relative">
      <div
        ref={wrapRef}
        className="relative aspect-video w-full overflow-hidden rounded-2xl border border-zinc-200 bg-gradient-to-br from-yellow-100 via-amber-50 to-white dark:border-zinc-800 dark:from-zinc-900 dark:via-zinc-950 dark:to-black"
      >
        {/* Contenu sous le revêtement */}
        <div className="absolute inset-0 grid place-items-center p-4">
          <div className="text-center">
            <div className="text-4xl font-extrabold">{title}</div>
            <div className="mt-2 text-sm">
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
                className="mt-4 flex items-center justify-center gap-3"
              >
                {!claimed && (
                  <button
                    onClick={claim}
                    className="rounded-xl bg-yellow-300 px-4 py-2 text-sm font-semibold text-black ring-2 ring-yellow-200 hover:shadow-md"
                  >
                    {prize ? `Réclamer ${prize.px} px` : "Réclamer"}
                  </button>
                )}
                <button
                  onClick={resetCard}
                  className="rounded-xl border border-zinc-300 bg-white px-4 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-950"
                >
                  Reset ({RESET_COST} px)
                </button>
              </motion.div>
            )}
          </div>
        </div>

        {/* Revêtement scratchable */}
        {!revealed && (
          <canvas
            ref={canvasRef}
            className="absolute inset-0 h-full w-full cursor-crosshair"
          />
        )}

        {/* Pop FX */}
        <AnimatePresence>
          {gainFx && (
            <motion.div
              key={gainFx.id}
              initial={{ opacity: 0, y: 0, scale: 0.9 }}
              animate={{ opacity: 1, y: -26, scale: 1 }}
              exit={{ opacity: 0, y: -44, scale: 1.05 }}
              transition={{ duration: 0.65, ease: "easeOut" }}
              className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
            >
              <div className="rounded-full border-2 border-black bg-yellow-300 px-2 py-1 text-xs font-bold shadow-lg">
                {gainFx.text}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Légende en bas */}
      <div className="mt-3 flex justify-between text-xs">
        <span>Surface révélée ≈ {cleared}%</span>
        <span>
          {revealed
            ? claimed
              ? "Récompense récupérée — reset dispo"
              : "Surprise débloquée — réclame ton gain"
            : "Gratte pour découvrir"}
        </span>
      </div>
    </div>
  );
}
