"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { usePixels } from "@/components/pixels-provider";

/**
 * PXBubbles — vagues régulières, fluides.
 * - Bulles jaunes (#FFD21E) bord noir.
 * - Trajectoire sinusoïdale régulière sur l’axe Y pendant qu’elle traverse en X.
 * - Anti-doublon de spawn.
 * - Effet “pop” + texte +{reward} PX au clic.
 */
export default function PXBubbles({
  spawnEveryMs = 1_000, // fréquence d’apparition
  travelDurationMs = 18_000, // durée de traversée (lente = fluide)
  label = "PX",
  maxConcurrent = 1,
  sound = false,
}: {
  spawnEveryMs?: number;
  travelDurationMs?: number;
  reward?: number;
  label?: string;
  maxConcurrent?: number;
  sound?: boolean | string;
}) {
  const { addPixels } = usePixels();
  const [bubbles, setBubbles] = useState<BubbleInstance[]>([]);
  const [fx, setFx] = useState<FXInstance[]>([]);
  const spawnTimer = useRef<number | null>(null);
  const lastSpawnRef = useRef<number>(0);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Son optionnel
  useEffect(() => {
    if (typeof sound === "string") {
      const el = new Audio(sound);
      el.preload = "auto";
      audioRef.current = el;
    } else if (sound) {
      audioRef.current = new Audio(
        "data:audio/wav;base64,UklGRiQAAABXQVZFZm10IBAAAAABAAEAESsAACJWAAACABYAAAACAAABAAgAZGF0YQAAAAA="
      );
    }
  }, [sound]);

  // Spawn contrôlé
  useEffect(() => {
    spawn(); // premier
    spawnTimer.current = window.setInterval(spawn, spawnEveryMs);
    return () => {
      if (spawnTimer.current) window.clearInterval(spawnTimer.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [spawnEveryMs, travelDurationMs, label, maxConcurrent]);

  function spawn() {
    const now = Date.now();
    if (now - lastSpawnRef.current < 3000) return; // anti-double déclenchement rapproché
    lastSpawnRef.current = now;

    setBubbles((cur) => {
      if (cur.length >= maxConcurrent) return cur;

      const id = crypto.randomUUID();
      const h = window.innerHeight;
      const yBase = rand(h * 0.25, h * 0.6); // base de la vague (haut/milieu)
      const amp = rand(36, 72); // amplitude de la vague
      const freq = randFloat(1.0, 2.0); // nb d’oscillations sur la traversée
      const phase = Math.random() * Math.PI * 2; // phase unique pour casser les clones
      const size = rand(46, 64);
      const duration = travelDurationMs * randFloat(0.95, 1.1);
      const reward = getRandomReward(); // 🎁 Reward aléatoire pondérée

      return [...cur, { id, yBase, amp, freq, phase, size, duration, reward }];
    });
  }

  // Clic: incrémente XP + FX (pop & texte) + retire la bulle
  function handleHit(b: BubbleInstance, clientX: number, clientY: number) {
    addPixels(b.reward, "PX bubble");
    if (audioRef.current) {
      audioRef.current.currentTime = 0;
      audioRef.current.play().catch(() => {});
    }

    // Effets visuels au point de clic
    const fxId = crypto.randomUUID();
    setFx((arr) => [
      ...arr,
      { id: fxId, x: clientX, y: clientY, text: `+${b.reward} ${label}` },
    ]);
    setTimeout(() => {
      setFx((arr) => arr.filter((f) => f.id !== fxId));
    }, 700);

    // Retire la bulle
    setBubbles((cur) => cur.filter((x) => x.id !== b.id));
  }

  function handleExit(id: string) {
    setBubbles((cur) => cur.filter((b) => b.id !== id));
  }

  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 z-[60]">
      {bubbles.map((b) => (
        <Bubble
          key={b.id}
          b={b}
          label={label}
          onHit={(e) => handleHit(b, e.clientX, e.clientY)}
          onExit={() => handleExit(b.id)}
        />
      ))}

      {/* FX overlay */}
      <AnimatePresence>
        {fx.map((f) => (
          <motion.div
            key={f.id}
            initial={{ opacity: 0, y: 0, scale: 0.9 }}
            animate={{ opacity: 1, y: -24, scale: 1 }}
            exit={{ opacity: 0, y: -40, scale: 1.05 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="pointer-events-none fixed select-none text-xs font-bold"
            style={{ left: f.x, top: f.y, transform: "translate(-50%, -50%)" }}
          >
            <div
              className="rounded-full px-2 py-1 shadow-lg"
              style={{
                background: "#FFD21E",
                color: "#000",
                border: "2px solid #000",
              }}
            >
              {f.text}
            </div>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}

/* ------------------------------------------------------- */
/* Bubble — trajectoire sinusoïdale régulière et FLUIDE    */
/* ------------------------------------------------------- */

function Bubble({
  b,
  label,
  onHit,
  onExit,
}: {
  b: BubbleInstance;
  label: string;
  onHit: (e: React.MouseEvent<HTMLButtonElement>) => void;
  onExit: () => void;
}) {
  // Chemin fluide: on échantillonne la sinusoïde en 60 étapes
  const path = useMemo(() => buildWavePath(b), [b]);
  const times = useMemo(() => evenTimes(path.x.length), [path.x.length]);
  const durationSec = b.duration / 1000;

  const initialX = path.x[0];
  const initialY = path.y[0];

  return (
    <motion.button
      type="button"
      aria-label={`Collect ${label}`}
      onClick={(e) => {
        e.stopPropagation();
        onHit(e);
      }}
      initial={{ x: initialX, y: initialY, opacity: 0, scale: 0.9 }}
      animate={{
        x: path.x,
        y: path.y,
        opacity: [0, 1, 1, 0.98, 0.96, 0.94, 0.9, 0.85],
        scale: [0.9, 1, 1, 1],
      }}
      transition={{
        x: { duration: durationSec, ease: "linear", times },
        y: { duration: durationSec, ease: "linear", times },
        opacity: { duration: durationSec, ease: "linear" },
        scale: { duration: durationSec, ease: "linear" },
      }}
      onAnimationComplete={onExit}
      className="pointer-events-auto absolute select-none outline-none"
      style={{ left: 0, top: 0, transform: "translate(-50%, -50%)" }}
    >
      {/* Bulle jaune + bord noir */}
      <motion.span
        whileTap={{ scale: 0.92 }}
        className="flex items-center justify-center rounded-full font-bold shadow-xl backdrop-blur-md"
        style={{
          width: b.size,
          height: b.size,
          background: "#FFD21E",
          color: "#000",
          border: "2px solid #000",
        }}
      >
        {label}
      </motion.span>
    </motion.button>
  );
}

/* ------------------------------------------------------- */
/* Types & utils                                           */
/* ------------------------------------------------------- */

interface BubbleInstance {
  id: string;
  yBase: number;
  amp: number;
  freq: number;
  phase: number;
  size: number;
  duration: number;
  reward: number; // 🎁 ajouté
}

interface FXInstance {
  id: string;
  x: number;
  y: number;
  text: string;
}

/**
 * Construit un chemin sinusoïdal fluide:
 * - x: -10vw → 110vw
 * - y: yBase + sin(2π * freq * t + phase) * amp
 * NB: 60 steps + ease linear = mouvement bien lisse.
 */
function buildWavePath(b: BubbleInstance) {
  const steps = 60;
  const x: string[] = [];
  const y: number[] = [];
  for (let i = 0; i < steps; i++) {
    const t = i / (steps - 1);
    const xvw = -10 + 120 * t; // -10vw -> 110vw
    x.push(`${xvw}vw`);
    const wave = Math.sin(Math.PI * 2 * b.freq * t + b.phase) * b.amp;
    y.push(b.yBase + wave);
  }
  return { x, y };
}

function evenTimes(n: number) {
  return Array.from({ length: n }, (_, i) => i / (n - 1));
}
function rand(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}
function randFloat(min: number, max: number) {
  return Math.random() * (max - min) + min;
}

/**
 * Tirage aléatoire pondéré pour les rewards
 */
function getRandomReward() {
  const weightedRewards = [
    { value: 50, weight: 50 }, // fréquent
    { value: 100, weight: 25 }, // un peu moins
    { value: 200, weight: 15 }, // encore moins
    { value: 500, weight: 7 }, // rare
    { value: 1000, weight: 3 }, // très rare
  ];

  const totalWeight = weightedRewards.reduce((sum, r) => sum + r.weight, 0);
  let rnd = Math.random() * totalWeight;

  for (const r of weightedRewards) {
    if (rnd < r.weight) return r.value;
    rnd -= r.weight;
  }
  return 50; // fallback
}
