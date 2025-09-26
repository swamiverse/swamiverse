"use client";

import { useState, useEffect } from "react";
import { objetsMock } from "./aventure-data";

export type InventaireItem = {
  objetId: string;
  quantite: number;
};

export function useInventaire() {
  const [items, setItems] = useState<InventaireItem[]>([]);
  const [pixels, setPixels] = useState<number>(0);

  // Charger depuis localStorage
  useEffect(() => {
    const savedItems = localStorage.getItem("inventaire");
    const savedPixels = localStorage.getItem("pixels");
    if (savedItems) setItems(JSON.parse(savedItems));
    if (savedPixels) setPixels(parseInt(savedPixels));
  }, []);

  // Sauvegarder à chaque changement
  useEffect(() => {
    localStorage.setItem("inventaire", JSON.stringify(items));
    localStorage.setItem("pixels", pixels.toString());
  }, [items, pixels]);

  function addItem(objetId: string, qty: number = 1) {
    setItems((prev) => {
      const exists = prev.find((i) => i.objetId === objetId);
      if (exists) {
        return prev.map((i) =>
          i.objetId === objetId ? { ...i, quantite: i.quantite + qty } : i
        );
      }
      return [...prev, { objetId, quantite: qty }];
    });
  }

  function addPixels(amount: number) {
    setPixels((p) => p + amount);
  }

  return { items, pixels, addItem, addPixels };
}
