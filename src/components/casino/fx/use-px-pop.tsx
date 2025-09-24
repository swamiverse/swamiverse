"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

export type FxItem = {
  id: string;
  x: number;
  y: number;
  text: string;
  kind: "plus" | "minus";
  dx?: number; // décalage horizontal
};

/**
 * Hook générique pour afficher des bulles "FX" (+PX en jaune, -PX en rouge).
 * Réutilisable partout (Slots, Scratch, Big Scratch, etc.)
 */
export function usePxPop() {
  const [fx, setFx] = useState<FxItem[]>([]);

  // Spawn une bulle
  function spawn(item: Omit<FxItem, "id">) {
    const id = crypto.randomUUID();
    const it: FxItem = { id, ...item };
    setFx((arr) => [...arr, it]);

    // Auto-destroy après 750ms
    setTimeout(() => setFx((arr) => arr.filter((f) => f.id !== id)), 750);
  }

  // Bulle jaune "+PX"
  function popPlusAt(x: number, y: number, text: string) {
    spawn({ x, y, text, kind: "plus", dx: 0 });
  }

  // Bulle rouge "-PX"
  function popMinusAt(x: number, y: number, text: string) {
    spawn({ x, y, text, kind: "minus", dx: 16 });
  }

  // Rendu overlay global
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

  // Compat rétro: `popAt` = alias de `popPlusAt`
  return { popAt: popPlusAt, popPlusAt, popMinusAt, overlay };
}

/**
 * Utile pour centrer les bulles sur un élément
 */
export function centerOf(ref: React.RefObject<HTMLElement | null>) {
  if (!ref.current)
    return { x: window.innerWidth / 2, y: window.innerHeight / 2 };
  const r = ref.current.getBoundingClientRect();
  return { x: r.left + r.width / 2, y: r.top + r.height / 2 };
}
