"use client";

import { useState } from "react";
import { scenes, Scene } from "@/lib/aventure-data";
import { motion } from "framer-motion";

export default function HistoirePage() {
  // état courant : scène + inventaire
  const [currentId, setCurrentId] = useState("start");
  const [inventory, setInventory] = useState<string[]>([]);

  // retrouver la scène active
  const current: Scene | undefined = scenes.find((s) => s.id === currentId);

  if (!current) {
    return (
      <div className="p-6">
        <h1 className="text-2xl font-bold text-red-500">Erreur</h1>
        <p>Scène introuvable : {currentId}</p>
      </div>
    );
  }

  const handleChoice = (next: string, item?: string) => {
    // ajouter item si défini
    if (item && !inventory.includes(item)) {
      setInventory((inv) => [...inv, item]);
    }
    // avancer à la scène suivante
    setCurrentId(next);
  };

  return (
    <div className="mt-10 space-y-8">
      {/* Scène courante */}
      <motion.div
        key={current.id}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="rounded-2xl border border-zinc-800 bg-zinc-950 p-6 shadow-lg"
      >
        <p className="text-lg text-zinc-200">{current.text}</p>
      </motion.div>

      {/* Choix */}
      <div className="space-y-3">
        {current.choices.length > 0 ? (
          current.choices.map((choice, i) => (
            <button
              key={i}
              onClick={() => handleChoice(choice.next, choice.item)}
              className="block w-full rounded-xl border border-yellow-400/40 bg-zinc-900 px-4 py-2 text-left text-zinc-100 transition hover:bg-zinc-800 focus:outline-none focus-visible:ring-4 focus-visible:ring-yellow-400/40"
            >
              {choice.text}
              {choice.item && (
                <span className="ml-2 text-yellow-300">+ {choice.item}</span>
              )}
            </button>
          ))
        ) : (
          <p className="text-zinc-500 italic">Fin de l’histoire.</p>
        )}
      </div>

      {/* Inventaire minimal */}
      <div className="rounded-2xl border border-zinc-800 bg-zinc-950 p-4 shadow-inner">
        <h2 className="text-lg font-semibold text-white mb-2">Inventaire</h2>
        {inventory.length === 0 ? (
          <p className="text-sm text-zinc-400">
            Ton sac est vide pour l’instant...
          </p>
        ) : (
          <ul className="list-disc pl-5 text-sm text-zinc-300">
            {inventory.map((it, i) => (
              <li key={i}>{it}</li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
