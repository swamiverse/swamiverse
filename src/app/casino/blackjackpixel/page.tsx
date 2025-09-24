"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Coins, Play, DollarSign } from "lucide-react";
import { usePixels } from "@/components/pixels-provider";
import { usePxPop, centerOf } from "@/components/casino/fx/use-px-pop";

type Card = {
  rank: string;
  suit: string;
  value: number;
};

type HistoryItem = {
  bet: number;
  result: "win" | "lose" | "push";
  gain: number;
  player: Card[];
  dealer: Card[];
};

const suits = ["♠", "♥", "♦", "♣"];
const ranks = [
  { rank: "A", value: 11 },
  { rank: "2", value: 2 },
  { rank: "3", value: 3 },
  { rank: "4", value: 4 },
  { rank: "5", value: 5 },
  { rank: "6", value: 6 },
  { rank: "7", value: 7 },
  { rank: "8", value: 8 },
  { rank: "9", value: 9 },
  { rank: "10", value: 10 },
  { rank: "J", value: 10 },
  { rank: "Q", value: 10 },
  { rank: "K", value: 10 },
];

function newDeck(): Card[] {
  return suits.flatMap((suit) =>
    ranks.map((r) => ({
      rank: r.rank,
      suit,
      value: r.value,
    }))
  );
}

function handValue(cards: Card[]): number {
  let sum = cards.reduce((a, c) => a + c.value, 0);
  let aces = cards.filter((c) => c.rank === "A").length;
  while (sum > 21 && aces > 0) {
    sum -= 10;
    aces--;
  }
  return sum;
}

function CardView({ card, hidden = false }: { card: Card; hidden?: boolean }) {
  return (
    <div className="w-16 h-24 rounded-lg border shadow-md bg-white flex items-center justify-center text-xl font-bold">
      {hidden ? (
        "❓"
      ) : (
        <span
          className={
            card.suit === "♥" || card.suit === "♦" ? "text-red-500" : ""
          }
        >
          {card.rank}
          {card.suit}
        </span>
      )}
    </div>
  );
}

export default function PixelBlackjackPage() {
  const { pixels: balance, setPixels, addPixels } = usePixels();
  const { overlay, popMinusAt, popPlusAt } = usePxPop();

  const [bet, setBet] = useState(20);
  const [deck, setDeck] = useState<Card[]>([]);
  const [player, setPlayer] = useState<Card[]>([]);
  const [dealer, setDealer] = useState<Card[]>([]);
  const [hidden, setHidden] = useState(true);
  const [playing, setPlaying] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const [history, setHistory] = useState<HistoryItem[]>([]);

  const canPlay = !playing && bet > 0 && balance >= bet;

  function dealCard(to: "player" | "dealer") {
    setDeck((prev) => {
      const d = [...prev];
      const card = d.splice(Math.floor(Math.random() * d.length), 1)[0];
      if (to === "player") setPlayer((p) => [...p, card]);
      else setDealer((p) => [...p, card]);
      return d;
    });
  }

  function startGame() {
    if (!canPlay) return;
    setDeck(newDeck());
    setPlayer([]);
    setDealer([]);
    setResult(null);
    setHidden(true);
    setPlaying(true);

    setPixels(balance - bet);
    const c = { x: window.innerWidth / 2, y: 100 };
    popMinusAt(c.x, c.y, `-${bet} PX`);

    setTimeout(() => {
      dealCard("player");
      dealCard("dealer");
      dealCard("player");
      dealCard("dealer");
    }, 200);
  }

  function hit() {
    if (!playing) return;
    dealCard("player");
    setTimeout(() => {
      if (handValue(player) > 21) endGame("lose");
    }, 200);
  }

  function stand() {
    if (!playing) return;
    setHidden(false);

    let dHand = [...dealer];
    while (handValue(dHand) < 17) {
      const d = [...deck];
      const card = d.splice(Math.floor(Math.random() * d.length), 1)[0];
      dHand.push(card);
      setDeck(d);
      setDealer([...dHand]);
    }

    const pVal = handValue(player);
    const dVal = handValue(dHand);

    if (dVal > 21 || pVal > dVal) endGame("win");
    else if (pVal < dVal) endGame("lose");
    else endGame("push");
  }

  function endGame(res: "win" | "lose" | "push") {
    setPlaying(false);
    setHidden(false);

    let gain = 0;
    if (res === "win") {
      gain = bet * 2;
      addPixels(gain);
      const c = { x: window.innerWidth / 2, y: 100 };
      popPlusAt(c.x, c.y, `+${gain} PX`);
    } else if (res === "push") {
      gain = bet;
      addPixels(gain);
    }

    setResult(
      res === "win" ? "✅ Gagné !" : res === "lose" ? "💀 Perdu" : "🤝 Égalité"
    );

    setHistory((h) => [
      { bet, result: res, gain, player, dealer },
      ...h.slice(0, 4),
    ]);
  }

  return (
    <>
      {overlay}

      <div className="mx-auto max-w-3xl py-12">
        {/* Header */}
        <div className="mb-2">
          <h1 className="text-4xl font-bold tracking-tight">
            PixelBlackjack ♠️♥️♦️♣️
          </h1>
          <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
            Atteins 21 sans dépasser. Gagne contre le croupier.
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
          {/* Mise + bouton */}
          <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between">
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

            <div className="flex sm:justify-end justify-center w-full sm:w-auto gap-2">
              {!playing && (
                <button
                  onClick={startGame}
                  disabled={!canPlay}
                  className="flex h-[42px] items-center justify-center gap-2 rounded-2xl bg-yellow-300 px-5 text-sm font-semibold text-black shadow-md disabled:cursor-not-allowed disabled:opacity-60"
                  style={{ minWidth: "160px" }}
                >
                  <Play className="h-4 w-4" /> Lancer ({bet} px)
                </button>
              )}
              {playing && (
                <>
                  <button
                    onClick={hit}
                    className="flex h-[42px] items-center justify-center gap-2 rounded-2xl bg-blue-500 px-5 text-sm font-semibold text-white shadow-md"
                  >
                    Tirer
                  </button>
                  <button
                    onClick={stand}
                    className="flex h-[42px] items-center justify-center gap-2 rounded-2xl bg-green-500 px-5 text-sm font-semibold text-white shadow-md"
                  >
                    Rester
                  </button>
                </>
              )}
            </div>
          </div>

          {/* Table */}
          <div className="flex flex-col gap-6 items-center">
            {/* Joueur */}
            <div className="flex flex-col items-center gap-2">
              <span className="font-semibold">
                Joueur ({handValue(player)})
              </span>
              <div className="flex gap-2">
                {player.map((c, i) => (
                  <CardView key={i} card={c} />
                ))}
              </div>
            </div>

            {/* Croupier */}
            <div className="flex flex-col items-center gap-2">
              <span className="font-semibold">
                Croupier ({hidden ? "?" : handValue(dealer)})
              </span>
              <div className="flex gap-2">
                {dealer.map((c, i) => (
                  <CardView key={i} card={c} hidden={hidden && i === 1} />
                ))}
              </div>
            </div>
          </div>

          {/* Résultat */}
          <div className="mt-6 text-center text-lg font-bold min-h-[40px]">
            {result}
          </div>
        </motion.div>

        {/* Historique */}
        <div className="mt-6 rounded-xl border bg-white/95 dark:bg-zinc-900/60 p-3 text-sm">
          <div className="font-semibold mb-2">Historique (5 derniers)</div>
          {history.length === 0 && (
            <div className="text-center text-zinc-500">
              Pas encore de parties.
            </div>
          )}
          {history.map((h, i) => (
            <div key={i} className="flex justify-between border-t py-1">
              <span>
                {h.result === "win"
                  ? "✅ Gagné"
                  : h.result === "lose"
                  ? "💀 Perdu"
                  : "🤝 Push"}{" "}
                ({h.bet} px)
              </span>
              <span>Gain : {h.gain}</span>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
