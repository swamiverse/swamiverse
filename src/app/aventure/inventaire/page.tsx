"use client";

import { useInventaire } from "@/lib/useInventaire";
import { objetsMock } from "@/lib/aventure-data";

export default function InventairePage() {
  const { items, pixels } = useInventaire();

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Inventaire</h1>
      <p className="mb-4">💰 Pixels : {pixels}</p>

      <div className="grid grid-cols-5 gap-4">
        {Array.from({ length: 20 }).map((_, idx) => {
          const slot = items[idx];
          if (!slot) {
            return (
              <div
                key={idx}
                className="w-20 h-20 border border-gray-300 rounded bg-gray-50"
              />
            );
          }

          const objet = objetsMock[slot.objetId];
          return (
            <div
              key={idx}
              className="w-20 h-20 border rounded flex flex-col items-center justify-center text-center bg-white shadow"
              title={objet.description}
            >
              <img
                src={objet.image_url}
                alt={objet.nom}
                className="w-12 h-12"
              />
              <span className="text-xs">{slot.quantite}x</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
