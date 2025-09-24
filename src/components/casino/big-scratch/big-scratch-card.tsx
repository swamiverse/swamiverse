"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { usePixels } from "@/components/pixels-provider";
import {
  DEFAULT_REWARDS,
  RESET_COST,
  RewardItem,
  pickWeighted,
} from "../casino-utils";
import { centerOf } from "../fx/use-px-pop";

export default function BigScratchCard({
  thresholdPct = 70,
  brushRadius = 60,
  titles = ["Mystery Pass", "Pixel Surprise", "Énigme du Casino"],
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

  // Redessine le "revêtement"
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

    function pointerDown(e: PointerEvent) {
      isDown = true;
      const rect = canvas.getBoundingClientRect();
      scratchAt((e.clientX - rect.left) * dpr, (e.clientY - rect.top) * dpr);
    }

    function pointerMove(e: PointerEvent) {
      if (!isDown || revealed) return;
      const rect = canvas.getBoundingClientRect();
      scratchAt((e.clientX - rect.left) * dpr, (e.clientY - rect.top) * dpr);

      if (++sampleEvery % 10 === 0) {
        const { width, height } = canvas;
        const data = ctx.getImageData(0, 0, width, height).data;
        let clearedPix = 0;
        for (let i = 3; i < data.length; i += 32)
          if (data[i] === 0) clearedPix++;
        const pct = Math.round((clearedPix / (data.length / 32)) * 100);
        setCleared(pct);
        if (pct >= thresholdPct) {
          setRevealed(true);
          setPrize((p) => p ?? pickWeighted(rewards));
        }
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
  }, [revealed, brushRadius, thresholdPct, rewards]);

  // Réclamer la récompense
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

  // Reset
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
        className="relative aspect-video w-full overflow-hidden rounded-2xl border bg-gradient-to-br from-yellow-100 via-amber-50 to-white dark:from-zinc-900 dark:to-black"
      >
        {/* Contenu sous revêtement */}
        <div className="absolute inset-0 grid place-items-center p-4">
          <div className="text-center">
            <div className="text-4xl font-extrabold">{title}</div>
            <div className="mt-2 text-sm">
              {revealed
                ? prize
                  ? `Tu as trouvé : ${prize.label}`
                  : "Surprise débloquée"
                : "Gratte pour révéler la surprise"}
            </div>

            {revealed && (
              <motion.div
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-4 flex justify-center gap-3"
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
                  className="rounded-xl border bg-white px-4 py-2 text-sm dark:bg-zinc-950"
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

        {/* FX gain */}
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

      {/* Infos bas */}
      <div className="mt-3 flex justify-between text-xs">
        <span>Surface révélée ≈ {cleared}%</span>
        <span>
          {revealed
            ? claimed
              ? "Récompense récupérée — reset dispo"
              : "Récompense disponible"
            : "Gratte pour découvrir"}
        </span>
      </div>
    </div>
  );
}
