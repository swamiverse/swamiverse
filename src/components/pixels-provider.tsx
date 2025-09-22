"use client";
import React, {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  useEffect,
} from "react";

const STORAGE_KEY = "swami_pixels_v1";

type PixelsContextType = {
  pixels: number;
  addPixels: (amount: number, note?: string) => void;
  setPixels: (value: number) => void;
  resetPixels: () => void;
};

const PixelsContext = createContext<PixelsContextType | undefined>(undefined);

export function PixelsProvider({ children }: { children: React.ReactNode }) {
  const [pixels, setPixelsState] = useState<number>(100);
  const [hydrated, setHydrated] = useState(false);

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
  }, []);

  useEffect(() => {
    if (hydrated) {
      try {
        localStorage.setItem(STORAGE_KEY, String(pixels));
      } catch {}
    }
  }, [pixels, hydrated]);

  const setPixels = useCallback((value: number) => {
    setPixelsState(Math.max(0, Math.floor(value)));
  }, []);

  const addPixels = useCallback((amount: number, _note?: string) => {
    if (!Number.isFinite(amount)) return;
    setPixelsState((p) => Math.max(0, p + Math.floor(amount)));
  }, []);

  const resetPixels = useCallback(() => setPixelsState(100), []);

  const value = useMemo(
    () => ({ pixels, addPixels, setPixels, resetPixels }),
    [pixels, addPixels, setPixels, resetPixels]
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
