"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { usePixels } from "@/components/pixels-provider";

export default function ArticleBody({ content }: { content: string }) {
  const [expanded, setExpanded] = useState(false);
  const [fx, setFx] = useState<{ id: string; x: number; y: number }[]>([]);
  const { addPixels } = usePixels(); // hook global pixels

  const handleUnlock = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (expanded) return;

    // Retire -200 px du compteur global
    addPixels(-200, "Lire article");

    setExpanded(true);

    // Position du bouton (avec léger décalage droite)
    const rect = e.currentTarget.getBoundingClientRect();
    const x = rect.left + rect.width * 0.65; // → un peu à droite du centre
    const y = rect.top + rect.height / 2;

    // Crée un effet unique
    const id = crypto.randomUUID();
    setFx((arr) => [...arr, { id, x, y }]);
    setTimeout(() => setFx((arr) => arr.filter((f) => f.id !== id)), 800);
  };

  return (
    <div className="relative">
      {/* Texte tronqué */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className={`prose max-w-none ${
          expanded ? "max-h-full" : "max-h-[500px] overflow-hidden"
        }`}
        dangerouslySetInnerHTML={{ __html: content.replace(/\n/g, "<br />") }}
      />

      {/* Overlay flouté + bouton */}
      {!expanded && (
        <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-white to-transparent flex justify-center items-end pb-6">
          <button
            onClick={handleUnlock}
            className="px-4 py-2 bg-yellow-400 text-black font-semibold rounded-xl shadow-md hover:bg-yellow-300 relative z-10"
          >
            Lire l’article complet 200px
          </button>
        </div>
      )}

      {/* FX -200 PX → bulle rouge qui descend */}
      <AnimatePresence>
        {fx.map((f) => (
          <motion.div
            key={f.id}
            initial={{ opacity: 0, y: 0, scale: 0.9 }}
            animate={{ opacity: 1, y: 40, scale: 1 }}
            exit={{ opacity: 0, y: 60, scale: 1.05 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="pointer-events-none fixed select-none text-xs font-bold"
            style={{
              left: f.x,
              top: f.y,
              transform: "translate(-50%, -50%)",
            }}
          >
            <div
              className="rounded-full px-2 py-1 shadow-lg"
              style={{
                background: "#DC2626", // rouge
                color: "#fff",
                border: "2px solid #000",
              }}
            >
              -200 PX
            </div>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
