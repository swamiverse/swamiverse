"use client";
import { useEffect } from "react";

const STORAGE_KEY = "swamiverse-theme";
type SwamiTheme =
  | "garage"
  | "bibliotheque"
  | "acces-interdit"
  | "flix"
  | "beats";

export default function DataThemeBridge({
  initial = "garage",
}: {
  initial?: SwamiTheme;
}) {
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY) as SwamiTheme | null;
      const theme = stored ?? (initial as SwamiTheme);
      document.documentElement.setAttribute("data-theme", theme);
    } catch {
      document.documentElement.setAttribute("data-theme", initial);
    }
  }, [initial]);

  return null;
}
