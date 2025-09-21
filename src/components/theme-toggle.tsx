"use client";

import { useTheme } from "./theme-provider";
import { Moon, Sun } from "lucide-react";

export function ThemeToggle() {
  const { theme, toggle } = useTheme();
  const isDark = theme === "dark";
  return (
    <button
      type="button"
      onClick={toggle}
      className="inline-flex items-center gap-2 rounded-xl border border-zinc-800 bg-zinc-900/70 px-3 py-1.5 text-sm text-zinc-200 transition hover:bg-zinc-900 focus:outline-none focus-visible:ring-4 focus-visible:ring-white/10 dark:border-zinc-700"
      aria-pressed={isDark}
      title={isDark ? "Passer en mode clair" : "Passer en mode nuit"}
    >
      {isDark ? (
        <Sun className="h-4 w-4 text-yellow-300" />
      ) : (
        <Moon className="h-4 w-4 text-zinc-300" />
      )}
      {isDark ? "Clair" : "Nuit"}
    </button>
  );
}
