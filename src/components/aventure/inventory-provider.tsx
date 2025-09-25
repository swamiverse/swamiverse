"use client";

import React, { createContext, useContext, useEffect, useState } from "react";

type Item = { id: string; label: string; qty: number };

type InventoryContextType = {
  items: Item[];
  addItem: (id: string, label: string, qty?: number) => void;
  clear: () => void;
};

const STORAGE_KEY = "sv-inventory-v1";
const InventoryContext = createContext<InventoryContextType | undefined>(
  undefined
);

export function InventoryProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<Item[]>([]);

  // hydrate depuis localStorage
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) setItems(JSON.parse(raw));
    } catch {}
  }, []);

  // persiste
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch {}
  }, [items]);

  const addItem = (id: string, label: string, qty = 1) => {
    setItems((prev) => {
      const existing = prev.find((it) => it.id === id);
      if (existing) {
        return prev.map((it) =>
          it.id === id ? { ...it, qty: it.qty + qty } : it
        );
      }
      return [...prev, { id, label, qty }];
    });
  };

  const clear = () => setItems([]);

  return (
    <InventoryContext.Provider value={{ items, addItem, clear }}>
      {children}
    </InventoryContext.Provider>
  );
}

export function useInventory() {
  const ctx = useContext(InventoryContext);
  if (!ctx)
    throw new Error("useInventory must be used within InventoryProvider");
  return ctx;
}
