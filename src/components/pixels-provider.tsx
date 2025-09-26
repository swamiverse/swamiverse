"use client";

import React, {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  useEffect,
} from "react";
import { supabase } from "@/lib/supabaseClient";

const STORAGE_KEY = "swami_pixels_v1";

type PixelsContextType = {
  pixels: number;
  addPixels: (amount: number, note?: string) => Promise<void>;
  setPixels: (value: number) => Promise<void>;
  resetPixels: () => Promise<void>;
  refreshFromDB: () => Promise<void>;
};

const PixelsContext = createContext<PixelsContextType | undefined>(undefined);

export function PixelsProvider({ children }: { children: React.ReactNode }) {
  const [pixels, setPixelsState] = useState<number>(100);
  const [hydrated, setHydrated] = useState(false);

  // Au démarrage → localStorage + sync Supabase
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = parseInt(raw, 10);
        if (!isNaN(parsed)) {
          setPixelsState(Math.max(0, parsed));
        }
      }
    } catch {}
    setHydrated(true);
    refreshFromDB(); // 🔌 sync DB
  }, []);

  // Sauvegarde locale
  useEffect(() => {
    if (hydrated) {
      try {
        localStorage.setItem(STORAGE_KEY, String(pixels));
      } catch {}
    }
  }, [pixels, hydrated]);

  // Force un rafraîchissement depuis la DB
  const refreshFromDB = useCallback(async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return;

    const { data, error } = await supabase
      .from("pixels_total")
      .select("total")
      .eq("user_id", user.id)
      .maybeSingle();

    if (!error && data) {
      setPixelsState(data.total);
    }
  }, []);

  // Fixer un solde direct
  const setPixels = useCallback(
    async (value: number) => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) return;

      const newTotal = Math.max(0, Math.floor(value));
      setPixelsState(newTotal);

      await supabase.from("pixels_log").insert({
        user_id: user.id,
        delta: newTotal - pixels,
        new_total: newTotal,
        note: "manual set",
      });
    },
    [pixels]
  );

  // Ajouter des PX
  const addPixels = useCallback(
    async (amount: number, note?: string) => {
      if (!Number.isFinite(amount)) return;
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) return;

      const newTotal = Math.max(0, pixels + Math.floor(amount));
      setPixelsState(newTotal);

      await supabase.from("pixels_log").insert({
        user_id: user.id,
        delta: Math.floor(amount),
        new_total: newTotal,
        note: note ?? null,
      });
    },
    [pixels]
  );

  // Reset = retour à 100 PX
  const resetPixels = useCallback(async () => {
    await setPixels(100);
  }, [setPixels]);

  const value = useMemo(
    () => ({ pixels, addPixels, setPixels, resetPixels, refreshFromDB }),
    [pixels, addPixels, setPixels, resetPixels, refreshFromDB]
  );

  return (
    <PixelsContext.Provider value={value}>{children}</PixelsContext.Provider>
  );
}

export function usePixels() {
  const ctx = useContext(PixelsContext);
  if (!ctx) {
    throw new Error("usePixels must be used within a PixelsProvider");
  }
  return ctx;
}
