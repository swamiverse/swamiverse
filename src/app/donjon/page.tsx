"use client";

import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useReducer,
  useRef,
  useState,
} from "react";

/******************************
 * PIXELS — store + PixelBar  *
 ******************************/
const LS = {
  gid: "sv_guestId",
  px: "sv_pixels",
  ver: "sv_version",
  hist: "sv_px_hist",
} as const;
const SV_VERSION = "1";
const clamp = (n: number, a: number, b: number) => Math.max(a, Math.min(b, n));
const uuid = () =>
  crypto?.randomUUID
    ? crypto.randomUUID()
    : Math.random().toString(36).slice(2);
const sget = (k: string) => {
  try {
    return localStorage.getItem(k);
  } catch {
    return null;
  }
};
const sset = (k: string, v: string) => {
  try {
    localStorage.setItem(k, v);
  } catch {}
};

type PxEvt =
  | {
      type: "PIXELS_ADD";
      amount: number;
      source: string;
      note?: string;
      ts?: string;
    }
  | {
      type: "PIXELS_SPEND";
      amount: number;
      source: string;
      note?: string;
      ts?: string;
    }
  | { type: "PIXELS_SET"; value: number; note?: string; ts?: string }
  | { type: "PIXELS_SYNC_LOCAL" };

type PxHist = { ts: string; source: string; amount: number };

type PxState = { gid: string; balance: number; hist: PxHist[] };

const PxCtx = createContext<{
  balance: number;
  dispatch: (e: PxEvt) => void;
  history: PxHist[];
} | null>(null);

function pxReducer(state: PxState, e: PxEvt): PxState {
  const now = new Date().toISOString();
  if (e.type === "PIXELS_SYNC_LOCAL") {
    const bal = clamp(Number(sget(LS.px) || "0"), 0, 999_999);
    const hist = JSON.parse(sget(LS.hist) || "[]") as PxHist[];
    return { ...state, balance: bal, hist: hist.slice(-5) };
  }
  if (e.type === "PIXELS_SET") {
    const v = clamp(Math.round(e.value), 0, 999_999);
    sset(LS.px, String(v));
    return { ...state, balance: v };
  }
  if (e.type === "PIXELS_ADD") {
    const a = Math.max(0, Math.round(e.amount));
    const next = clamp(state.balance + a, 0, 999_999);
    sset(LS.px, String(next));
    const item = { ts: e.ts || now, source: e.source, amount: +a };
    const hist = [...state.hist, item].slice(-5);
    sset(LS.hist, JSON.stringify(hist));
    return { ...state, balance: next, hist };
  }
  if (e.type === "PIXELS_SPEND") {
    const a = Math.max(0, Math.round(e.amount));
    if (a > state.balance) return state;
    const next = clamp(state.balance - a, 0, 999_999);
    sset(LS.px, String(next));
    const item = { ts: e.ts || now, source: e.source, amount: -a };
    const hist = [...state.hist, item].slice(-5);
    sset(LS.hist, JSON.stringify(hist));
    return { ...state, balance: next, hist };
  }
  return state;
}

function PixelProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(pxReducer, undefined as any, () => {
    const gid = sget(LS.gid) || uuid();
    sset(LS.gid, gid);
    if (sget(LS.ver) !== SV_VERSION) sset(LS.ver, SV_VERSION);
    const balance = clamp(Number(sget(LS.px) || "0"), 0, 999_999);
    const hist = JSON.parse(sget(LS.hist) || "[]").slice(-5);
    return { gid, balance, hist };
  });

  useEffect(() => {
    const onEvt = (ev: Event) => {
      const detail = (ev as CustomEvent).detail as PxEvt | undefined;
      if (!detail) return;
      dispatch(detail);
    };
    window.addEventListener("sv:pixels", onEvt as any);
    return () => window.removeEventListener("sv:pixels", onEvt as any);
  }, []);

  return (
    <PxCtx.Provider
      value={{ balance: state.balance, dispatch, history: state.hist }}
    >
      {children}
    </PxCtx.Provider>
  );
}

function usePixels() {
  const ctx = useContext(PxCtx);
  if (!ctx) throw new Error("usePixels must be inside PixelProvider");
  return ctx;
}

function emitPx(e: PxEvt) {
  window.dispatchEvent(new CustomEvent("sv:pixels", { detail: e }));
}

function PixelBar() {
  const { balance, history } = usePixels();
  const [open, setOpen] = useState(false);
  const [flash, setFlash] = useState<"+" | "-" | null>(null);
  const prev = useRef(balance);
  useEffect(() => {
    if (balance > prev.current) setFlash("+");
    else if (balance < prev.current) setFlash("-");
    prev.current = balance;
    const t = setTimeout(() => setFlash(null), 180);
    return () => clearTimeout(t);
  }, [balance]);
  return (
    <div className="fixed top-0 left-0 right-0 z-40">
      <div className="mx-auto max-w-5xl p-3">
        <div
          className={`flex items-center justify-between rounded-2xl border border-neutral-800 bg-black/70 backdrop-blur px-4 py-2 text-neutral-100 shadow-lg ${
            flash === "+" ? "animate-pulse" : ""
          } ${flash === "-" ? "animate-[shake_0.18s_linear]" : ""}`}
        >
          <div className="flex items-center gap-2">
            <span className="inline-block h-3 w-3 rounded-sm bg-fuchsia-400 shadow-[0_0_12px_2px_rgba(244,114,182,0.7)]" />
            <span className="font-semibold tracking-wide">Pixels</span>
          </div>
          <button
            onClick={() => setOpen((v) => !v)}
            className="font-mono text-lg hover:opacity-90"
          >
            {balance.toLocaleString("fr-FR")}
          </button>
        </div>
      </div>
      {open && (
        <div className="mx-auto mt-2 max-w-5xl px-3">
          <div className="rounded-2xl border border-neutral-800 bg-neutral-950/80 p-4 backdrop-blur">
            <div className="mb-2 text-sm text-neutral-400">
              5 derniers événements
            </div>
            <ul className="space-y-1 text-sm">
              {history
                .slice()
                .reverse()
                .map((h, i) => (
                  <li key={i} className="flex justify-between font-mono">
                    <span className="text-neutral-400">
                      {new Date(h.ts).toLocaleTimeString("fr-FR", {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </span>
                    <span className="text-neutral-500">{h.source}</span>
                    <span
                      className={
                        h.amount >= 0 ? "text-emerald-400" : "text-rose-400"
                      }
                    >
                      {h.amount >= 0 ? "+" : ""}
                      {h.amount}
                    </span>
                  </li>
                ))}
            </ul>
            <div className="mt-3 text-right text-xs text-neutral-500">
              Tes pixels te suivent partout — style garanti, pas de tracking.
            </div>
          </div>
        </div>
      )}
      <style>{`@keyframes shake{10%,90%{transform:translateX(-1px)}20%,80%{transform:translateX(2px)}30%,50%,70%{transform:translateX(-4px)}40%,60%{transform:translateX(4px)}}`}</style>
    </div>
  );
}

/******************************
 * DONJON — MVP card system    *
 ******************************/

type Effects = {
  hp?: number; // ±HP instant
  pixels?: number; // ±pixels (ADD/SPEND); negative spend only if enough
  distance?: number; // negative = closer to exit
  dot?: { hp: number; turns: number }; // damage over turns (hp negative)
  reveal?: boolean; // UI helper
  shuffle?: boolean; // reshuffle discard into deck
  keyDelta?: number; // keys change
};

type Card = {
  id: string;
  title: string;
  color: "green" | "yellow" | "red" | "purple" | "neutral";
  rarity: "C" | "U" | "R";
  effects: Effects;
  notes?: string;
};

const DECK: Card[] = [
  {
    id: "sanctuaire",
    title: "Sanctuaire",
    color: "green",
    rarity: "C",
    effects: { hp: +1, distance: -1 },
  },
  {
    id: "coffre-simple",
    title: "Coffre simple",
    color: "green",
    rarity: "C",
    effects: { pixels: +3, distance: -1 },
  },
  {
    id: "coffre-garni",
    title: "Coffre garni",
    color: "green",
    rarity: "U",
    effects: { pixels: +5, distance: -1 },
  },
  {
    id: "couloir-degage",
    title: "Couloir dégagé",
    color: "green",
    rarity: "C",
    effects: { distance: -2 },
  },
  {
    id: "guide-spectral",
    title: "Guide spectral",
    color: "green",
    rarity: "U",
    effects: { reveal: true, distance: -1 },
  },
  {
    id: "marchand-presse",
    title: "Marchand pressé",
    color: "yellow",
    rarity: "U",
    effects: { pixels: 0, keyDelta: +1, distance: -1 },
    notes: "Si pixels ≥ 8, dépense 8 pour +1 clé.",
  },
  {
    id: "echange-alchimique",
    title: "Échange alchimique",
    color: "yellow",
    rarity: "C",
    effects: { pixels: -3, hp: +1, distance: -1 },
  },
  {
    id: "detour-inspirant",
    title: "Détour inspirant",
    color: "yellow",
    rarity: "C",
    effects: { pixels: +2, distance: +1 },
  },
  {
    id: "cle-ancienne",
    title: "Clé ancienne",
    color: "yellow",
    rarity: "U",
    effects: { keyDelta: +1, distance: -1 },
  },
  {
    id: "piege-pointes",
    title: "Piège à pointes",
    color: "red",
    rarity: "C",
    effects: { hp: -2, distance: -1 },
  },
  {
    id: "embuche",
    title: "Embûche",
    color: "red",
    rarity: "C",
    effects: { hp: -1, distance: +1 },
  },
  {
    id: "mimique",
    title: "Mimique",
    color: "red",
    rarity: "U",
    effects: { hp: -1, pixels: +6, distance: -1 },
  },
  {
    id: "saignee",
    title: "Saignée",
    color: "red",
    rarity: "U",
    effects: { dot: { hp: -1, turns: 2 }, distance: -1 },
  },
  {
    id: "portail-stable",
    title: "Portail stable",
    color: "purple",
    rarity: "U",
    effects: { shuffle: true, distance: -1 },
  },
  {
    id: "portail-chaotique",
    title: "Portail chaotique",
    color: "purple",
    rarity: "R",
    effects: { shuffle: true, pixels: +2, distance: -2 },
  },
  {
    id: "benediction-neon",
    title: "Bénédiction néon",
    color: "purple",
    rarity: "U",
    effects: { hp: +2, distance: -1 },
  },
  {
    id: "carte-lisible",
    title: "Carte lisible",
    color: "neutral",
    rarity: "C",
    effects: { reveal: true, distance: -1 },
  },
  {
    id: "souffle-court",
    title: "Souffle court",
    color: "neutral",
    rarity: "C",
    effects: { distance: -2 },
  },
];

function mulberry32(seed: number) {
  return () => {
    let t = (seed += 0x6d2b79f5);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
function shuffle<T>(rng: () => number, a: T[]): T[] {
  const arr = [...a];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

function colorClass(c: Card["color"]) {
  switch (c) {
    case "green":
      return "border-emerald-700/40 hover:shadow-[0_0_24px_rgba(16,185,129,0.25)]";
    case "yellow":
      return "border-amber-700/40 hover:shadow-[0_0_24px_rgba(245,158,11,0.25)]";
    case "red":
      return "border-rose-700/40 hover:shadow-[0_0_24px_rgba(244,63,94,0.25)]";
    case "purple":
      return "border-fuchsia-700/40 hover:shadow-[0_0_24px_rgba(244,114,182,0.25)]";
    default:
      return "border-neutral-700/40 hover:shadow-[0_0_24px_rgba(115,115,115,0.25)]";
  }
}

function DonjonMVP() {
  const { balance } = usePixels();
  const [seed, setSeed] = useState<number>(() =>
    Math.floor(Math.random() * 1e9)
  );
  const rng = useMemo(() => mulberry32(seed), [seed]);
  const [hp, setHp] = useState(5);
  const [keys, setKeys] = useState(0);
  const [turn, setTurn] = useState(0);
  const [dot, setDot] = useState<{ hp: number; left: number } | null>(null);
  const [distance, setDistance] = useState<number>(
    () => 9 + Math.floor(Math.random() * 4)
  ); // 9–12
  const [deck, setDeck] = useState<Card[]>(() => shuffle(rng, DECK));
  const [discard, setDiscard] = useState<Card[]>([]);
  const [choices, setChoices] = useState<Card[]>([]);
  const [revealMode, setRevealMode] = useState(0); // show preview turns
  const [rerollLock, setRerollLock] = useState(false);
  const [log, setLog] = useState<string>("");
  const [win, setWin] = useState(false);
  const [lose, setLose] = useState(false);

  // initial 3
  useEffect(() => {
    offer3(); // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [seed]);

  function reshuffleIfNeeded(pool: Card[], needed = 3): [Card[], Card[]] {
    let d = [...pool];
    let disc = [...discard];
    if (d.length < needed) {
      d = [...d, ...shuffle(rng, disc)];
      disc = [];
    }
    return [d, disc];
  }

  function offer3() {
    let d = [...deck];
    let disc = [...discard];
    [d, disc] = reshuffleIfNeeded(d, 3);
    const pick = d.slice(0, 3);
    d = d.slice(3);
    setDeck(d);
    setDiscard(disc);
    setChoices(pick);
  }

  function applyCard(c: Card) {
    if (win || lose) return;

    // apply immediate effects
    const msgs: string[] = [];

    // DOT tick from previous state occurs at the start of turn resolution
    if (dot && dot.left > 0) {
      const newHp = clamp(hp + dot.hp, 0, 9); // dot.hp is negative
      setHp(newHp);
      msgs.push(`${dot.hp}❤️ sur DOT`);
      const left = dot.left - 1;
      if (left <= 0) setDot(null);
      else setDot({ ...dot, left });
    }

    // pixels immediate (positive only in MVP except exchanges)
    if (typeof c.effects.pixels === "number") {
      const amt = c.effects.pixels;
      if (amt > 0)
        emitPx({ type: "PIXELS_ADD", amount: amt, source: sourceFor(c) });
      if (amt < 0) {
        const need = Math.abs(amt);
        if (balance >= need)
          emitPx({ type: "PIXELS_SPEND", amount: need, source: sourceFor(c) });
        else msgs.push("Pas assez de pixels pour l’échange");
      }
    }

    // keys
    if (c.effects.keyDelta)
      setKeys((k) => Math.max(0, k + c.effects.keyDelta!));

    // hp
    if (typeof c.effects.hp === "number")
      setHp((h) => clamp(h + c.effects.hp!, 0, 9));

    // dot
    if (c.effects.dot)
      setDot({ hp: c.effects.dot.hp, left: c.effects.dot.turns });

    // reveal preview
    if (c.effects.reveal) setRevealMode(2); // reveal next 2 turns

    // shuffle
    if (c.effects.shuffle) {
      setDeck((d) => shuffle(rng, [...d, ...discard]));
      setDiscard([]);
    }

    // distance last (rule)
    if (typeof c.effects.distance === "number")
      setDistance((d) => d + c.effects.distance!);

    // consume turn
    setTurn((t) => t + 1);
    emitPx({ type: "PIXELS_ADD", amount: 1, source: "dungeon.turn" });

    // move chosen to discard and refresh choices
    setDiscard((d) => [c, ...d]);
    setChoices([]);

    // end checks after state updates — schedule microtask
    setTimeout(() => {
      const d = distance + (c.effects.distance || 0);
      const h =
        (typeof c.effects.hp === "number"
          ? clamp(hp + c.effects.hp, 0, 9)
          : hp) + (dot ? 0 : 0);
      if (d <= 0 && h > 0) {
        setWin(true);
        emitPx({ type: "PIXELS_ADD", amount: 15, source: "dungeon.finish" });
        setLog(`Sortie atteinte ! +15◆`);
        return;
      }
      if (h <= 0) {
        setLose(true);
        setLog(`0 PV — le donjon t’a mâché.`);
        return;
      }
      offer3();
      if (revealMode > 0) setRevealMode((n) => n - 1);
      setRerollLock(false);
      setLog(msgs.filter(Boolean).join(" · "));
    }, 0);
  }

  function sourceFor(c: Card) {
    switch (c.id) {
      case "coffre-simple":
        return "dungeon.loot.common";
      case "coffre-garni":
        return "dungeon.loot.uncommon";
      case "mimique":
        return "dungeon.loot.mimic";
      case "portail-chaotique":
        return "dungeon.portal.bonus";
      default:
        return "dungeon.card";
    }
  }

  function reroll() {
    if (rerollLock || win || lose) return;
    if (hp <= 1) {
      setLog("Trop risqué : 1❤️ restant.");
      return;
    }
    setHp((h) => h - 1);
    setRerollLock(true);
    setChoices([]);
    // put current 3 in discard then draw 3 new
    setDiscard((d) => [...choices, ...d]);
    setTimeout(() => offer3(), 0);
  }

  function restart() {
    setSeed(Math.floor(Math.random() * 1e9));
    setHp(5);
    setKeys(0);
    setTurn(0);
    setDot(null);
    setDistance(9 + Math.floor(Math.random() * 4));
    setDeck(shuffle(mulberry32(Math.floor(Math.random() * 1e9)), DECK));
    setDiscard([]);
    setChoices([]);
    setRevealMode(0);
    setRerollLock(false);
    setWin(false);
    setLose(false);
    setLog("Nouveau run !");
    setTimeout(() => offer3(), 0);
  }

  return (
    <div className="mx-auto mt-24 max-w-5xl px-4 text-neutral-100">
      <header className="mb-4">
        <h1 className="text-2xl font-bold">Donjon — MVP</h1>
        <p className="text-sm text-neutral-400">
          Runs courts, 3 cartes visibles. Distance initiale : {distance}.
        </p>
      </header>

      <div className="grid gap-4 md:grid-cols-[1fr,320px]">
        {/* Game */}
        <div className="rounded-2xl border border-neutral-800 bg-neutral-950 p-4">
          <div className="flex flex-wrap items-center gap-3 text-sm">
            <span>
              PV :{" "}
              <strong className="align-middle">
                {Array.from({ length: Math.max(0, hp) }).map((_, i) => (
                  <span key={i}>❤</span>
                ))}
              </strong>
            </span>
            <span className="text-neutral-500">·</span>
            <span>
              Clés : <strong>{keys}</strong>
            </span>
            <span className="text-neutral-500">·</span>
            <span>
              Tour : <strong>{turn}</strong>
            </span>
          </div>

          {/* Distance bar */}
          <div className="mt-3">
            <div className="mb-1 flex items-center justify-between text-xs text-neutral-400">
              <span>Distance vers la Sortie</span>
              <span>D : {Math.max(0, distance)}</span>
            </div>
            <div className="h-3 w-full rounded-full bg-neutral-800">
              <div
                className="h-3 rounded-full bg-fuchsia-500 shadow-[0_0_16px_rgba(244,114,182,0.5)]"
                style={{
                  width: `${Math.max(0, 100 - (distance / 12) * 100)}%`,
                }}
              />
            </div>
          </div>

          {/* Choices */}
          {!win && !lose && (
            <>
              <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-3">
                {choices.map((c) => (
                  <button
                    key={c.id}
                    onClick={() => applyCard(c)}
                    className={`rounded-2xl border bg-black/60 p-4 text-left transition hover:-translate-y-0.5 ${colorClass(
                      c.color
                    )}`}
                  >
                    <div className="text-xs uppercase tracking-wide text-neutral-400">
                      {c.rarity === "R"
                        ? "Rare"
                        : c.rarity === "U"
                        ? "Inhabituel"
                        : "Commun"}
                    </div>
                    <div className="mt-1 text-lg font-semibold">{c.title}</div>
                    <div className="mt-2 text-sm text-neutral-300">
                      {c.effects.hp
                        ? c.effects.hp > 0
                          ? `+${c.effects.hp}❤️`
                          : `${c.effects.hp}❤️`
                        : ""}
                      {typeof c.effects.pixels === "number"
                        ? `${c.effects.hp ? " · " : ""}${
                            c.effects.pixels > 0
                              ? `+${c.effects.pixels}`
                              : c.effects.pixels
                          }◆`
                        : ""}
                      {c.effects.dot
                        ? `${
                            c.effects.hp || typeof c.effects.pixels === "number"
                              ? " · "
                              : ""
                          }${c.effects.dot.hp}❤️/tour ×${c.effects.dot.turns}`
                        : ""}
                      {c.effects.shuffle
                        ? `${
                            c.effects.hp ||
                            typeof c.effects.pixels === "number" ||
                            c.effects.dot
                              ? " · "
                              : ""
                          }Shuffle`
                        : ""}
                      {c.effects.reveal
                        ? `${
                            c.effects.hp ||
                            typeof c.effects.pixels === "number" ||
                            c.effects.dot ||
                            c.effects.shuffle
                              ? " · "
                              : ""
                          }Révèle`
                        : ""}
                    </div>
                    <div className="mt-1 text-xs text-neutral-400">
                      ⇥{" "}
                      {c.effects.distance! > 0
                        ? `+${c.effects.distance}`
                        : c.effects.distance}{" "}
                      vers la Sortie
                    </div>
                  </button>
                ))}
              </div>

              <div className="mt-3 flex flex-wrap items-center gap-3">
                <button
                  onClick={reroll}
                  disabled={rerollLock}
                  className={`rounded-xl border border-neutral-700 bg-neutral-900 px-3 py-1.5 hover:bg-neutral-800 disabled:cursor-not-allowed disabled:opacity-50`}
                >
                  Je tente autre chose (−1❤️)
                </button>
                {revealMode > 0 && (
                  <span className="text-xs text-neutral-400">
                    Révélations actives : {revealMode} tour(s)
                  </span>
                )}
                {log && <span className="text-sm text-neutral-300">{log}</span>}
              </div>
            </>
          )}

          {win && (
            <div className="mt-6 rounded-xl border border-emerald-700/40 bg-emerald-900/20 p-4">
              <div className="text-emerald-300">
                🎉 Sortie atteinte — bonus +15◆
              </div>
              <button
                className="mt-3 rounded-xl border border-neutral-700 px-3 py-2 hover:bg-neutral-800"
                onClick={restart}
              >
                Rejouer (nouveau seed)
              </button>
            </div>
          )}

          {lose && (
            <div className="mt-6 rounded-xl border border-rose-700/40 bg-rose-900/20 p-4">
              <div className="text-rose-300">0 PV — le donjon t’a mâché.</div>
              <button
                className="mt-3 rounded-xl border border-neutral-700 px-3 py-2 hover:bg-neutral-800"
                onClick={restart}
              >
                Relancer
              </button>
            </div>
          )}
        </div>

        {/* Side: seed & tips */}
        <aside className="rounded-2xl border border-neutral-800 bg-neutral-950 p-4">
          <div className="mb-2 text-sm text-neutral-400">Infos</div>
          <ul className="space-y-1 text-sm text-neutral-300">
            <li>
              Seed:{" "}
              <code className="rounded bg-neutral-900 px-1 py-0.5">{seed}</code>
            </li>
            <li>DOT: {dot ? `${dot.hp}❤️/tour ×${dot.left}` : "—"}</li>
            <li>Révélation: {revealMode ? `${revealMode} tour(s)` : "—"}</li>
          </ul>
          <div className="mt-3 flex gap-2">
            <button
              onClick={restart}
              className="rounded-xl border border-neutral-700 bg-neutral-900 px-3 py-1.5 hover:bg-neutral-800"
            >
              Nouveau run
            </button>
          </div>
        </aside>
      </div>
    </div>
  );
}

/****************
 * PAGE EXPORT  *
 ****************/
export default function Page() {
  useEffect(() => {
    if (!sget(LS.gid)) sset(LS.gid, uuid());
    if (!sget(LS.ver)) sset(LS.ver, SV_VERSION);
    if (!sget(LS.px)) sset(LS.px, "0");
    emitPx({ type: "PIXELS_SYNC_LOCAL" });
  }, []);

  return (
    <PixelProvider>
      <main className="min-h-[100svh] bg-black pb-16">
        <PixelBar />
        <div className="mx-auto max-w-5xl px-4 pt-16">
          <p className="mb-3 text-xs text-fuchsia-400/70">
            💾 Page générée depuis SwamiVerse DB — MAJ :{" "}
            {new Date().toLocaleDateString("fr-FR")}
          </p>
        </div>
        <DonjonMVP />
        <footer className="mx-auto mt-10 max-w-5xl px-4 text-center text-xs text-neutral-500">
          Nous stockons localement votre solde de pixels (strictement
          fonctionnel).
        </footer>
      </main>
    </PixelProvider>
  );
}
