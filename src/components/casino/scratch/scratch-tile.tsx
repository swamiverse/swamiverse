"use client";

import { useEffect, useRef, useState } from "react";

export default function ScratchTile({
  idx,
  state,
  onReveal,
}: {
  idx: number;
  state:
    | { status: "idle" }
    | { status: "armed"; tiles: any[]; revealed: boolean[] }
    | { status: "done"; tiles: any[]; revealed: boolean[]; outcome: any };
  onReveal: (i: number) => void;
}) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [cleared, setCleared] = useState(0);
  const isRevealed = state.status !== "idle" && state.revealed[idx];
  const symbol = state.status === "idle" ? null : state.tiles[idx];

  useEffect(() => {
    if (state.status !== "armed" || isRevealed) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const dpr = window.devicePixelRatio || 1;

    function drawCover() {
      canvas.width = canvas.offsetWidth * dpr;
      canvas.height = canvas.offsetHeight * dpr;
      ctx.fillStyle = "#999";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
    }
    drawCover();

    let isDown = false;
    const brush = 30 * dpr;

    function scratch(x: number, y: number) {
      ctx.save();
      ctx.globalCompositeOperation = "destination-out";
      ctx.beginPath();
      ctx.arc(x, y, brush, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }

    function pointerDown(e: PointerEvent) {
      isDown = true;
      const rect = canvas.getBoundingClientRect();
      scratch((e.clientX - rect.left) * dpr, (e.clientY - rect.top) * dpr);
    }

    function pointerMove(e: PointerEvent) {
      if (!isDown) return;
      const rect = canvas.getBoundingClientRect();
      scratch((e.clientX - rect.left) * dpr, (e.clientY - rect.top) * dpr);
      const data = ctx.getImageData(0, 0, canvas.width, canvas.height).data;
      let clearedPixels = 0;
      for (let i = 3; i < data.length; i += 32)
        if (data[i] === 0) clearedPixels++;
      const pct = Math.round((clearedPixels / (data.length / 4 / 8)) * 100);
      setCleared(pct);
      if (pct > 70) onReveal(idx);
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
  }, [state.status, isRevealed]);

  return (
    <div
      className={`relative aspect-[4/3] w-full rounded-2xl border text-4xl ${
        isRevealed
          ? "border-yellow-300 bg-white text-black"
          : "border-zinc-300 bg-gradient-to-b from-zinc-200 to-zinc-100 text-zinc-600"
      }`}
    >
      <div className="flex h-full w-full items-center justify-center">
        {isRevealed ? symbol?.label : "?"}
      </div>
      {state.status === "armed" && !isRevealed && (
        <canvas
          ref={canvasRef}
          className="absolute inset-0 h-full w-full rounded-2xl"
        />
      )}
    </div>
  );
}
