// ————————————————————————————————
// Slots (machine à sous)
// ————————————————————————————————
export type SymbolKey = "seven" | "diamond" | "bell" | "star" | "cherry";
export type SlotSymbol = {
  key: SymbolKey;
  label: string;
  weight: number;
  payout3: number;
  payout2?: number;
};

export const SYMBOLS: SlotSymbol[] = [
  { key: "seven", label: "7️⃣", weight: 1, payout3: 500, payout2: 50 },
  { key: "diamond", label: "💎", weight: 2, payout3: 200, payout2: 25 },
  { key: "bell", label: "🔔", weight: 3, payout3: 100, payout2: 15 },
  { key: "star", label: "⭐", weight: 4, payout3: 50, payout2: 10 },
  { key: "cherry", label: "🍒", weight: 5, payout3: 20, payout2: 5 },
];

const WHEEL = SYMBOLS.flatMap((s) => Array.from({ length: s.weight }, () => s));

export const pickRandom = () => WHEEL[Math.floor(Math.random() * WHEEL.length)];

export function evaluate(reels: SlotSymbol[]) {
  const [a, b, c] = reels;
  if (a.key === b.key && b.key === c.key) {
    const s = SYMBOLS.find((x) => x.key === a.key)!;
    return { kind: "three" as const, multiplier: s.payout3, symbol: s };
  }
  if (a.key === b.key || b.key === c.key) {
    const key = a.key === b.key ? a.key : b.key;
    const s = SYMBOLS.find((x) => x.key === key)!;
    return { kind: "two" as const, multiplier: s.payout2 ?? 0, symbol: s };
  }
  return { kind: "none" as const, multiplier: 0 };
}

// ————————————————————————————————
// Scratchcards (petites cartes)
// ————————————————————————————————
export type ScratchKey = "gold" | "gem" | "star" | "clover" | "dust";
export type ScratchSymbol = {
  key: ScratchKey;
  label: string;
  weight: number;
  payout3: number;
  payout2?: number;
};

export const SCRATCH_SYMBOLS: ScratchSymbol[] = [
  { key: "gold", label: "🪙", weight: 2, payout3: 15, payout2: 2 },
  { key: "gem", label: "💎", weight: 3, payout3: 10, payout2: 2 },
  { key: "star", label: "⭐", weight: 5, payout3: 6, payout2: 1 },
  { key: "clover", label: "🍀", weight: 8, payout3: 4, payout2: 1 },
  { key: "dust", label: "🫧", weight: 10, payout3: 0, payout2: 0 },
];

const SCRATCH_WHEEL = SCRATCH_SYMBOLS.flatMap((s) =>
  Array.from({ length: s.weight }, () => s)
);

export const pickScratch = () =>
  SCRATCH_WHEEL[Math.floor(Math.random() * SCRATCH_WHEEL.length)];

export function evalScratch(symbols: ScratchSymbol[]) {
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
// Big Scratch (méga carte)
// ————————————————————————————————
export type RewardItem = { px: number; weight: number; label: string };

export const RESET_COST = 200;

export const DEFAULT_REWARDS: RewardItem[] = [
  { px: 50, weight: 240, label: "Petit bonus" },
  { px: 100, weight: 200, label: "Bonus sympa" },
  { px: 200, weight: 150, label: "Beau butin" },
  { px: 400, weight: 100, label: "Gros lot" },
  { px: 600, weight: 60, label: "Super lot" },
  { px: 800, weight: 35, label: "Méga lot" },
  { px: 1000, weight: 15, label: "Jackpot rare" },
  { px: 10000, weight: 1, label: "ULTRA JACKPOT" },
];

export function pickWeighted(items: RewardItem[]) {
  const total = items.reduce((s, it) => s + Math.max(0, it.weight), 0);
  let r = Math.random() * total;
  for (const it of items) {
    r -= Math.max(0, it.weight);
    if (r <= 0) return it;
  }
  return items[items.length - 1];
}
