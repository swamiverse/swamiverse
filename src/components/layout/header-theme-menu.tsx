"use client";
import { useEffect, useRef, useState } from "react";
import { Sun, Moon, Palette, Check } from "lucide-react";

type Mode = "light" | "dark";
type SwamiTheme =
  | "garage"
  | "bibliotheque"
  | "acces-interdit"
  | "flix"
  | "beats";

const THEMES: { id: SwamiTheme; label: string }[] = [
  { id: "garage", label: "Garage" },
  { id: "bibliotheque", label: "Bibliothèque" },
  { id: "acces-interdit", label: "Accès interdit" },
  { id: "flix", label: "Flix" },
  { id: "beats", label: "Beats" },
];

const STORAGE_THEME = "swamiverse-theme";
const STORAGE_MODE = "swami-mode"; // nouveau stockage pour Jour/Nuit

export default function HeaderThemeMenu({ size = 36 }: { size?: number }) {
  const [open, setOpen] = useState(false);
  const [mode, setMode] = useState<Mode>("light");
  const [theme, setTheme] = useState<SwamiTheme>("garage");
  const ref = useRef<HTMLDivElement | null>(null);

  // Bootstrap depuis storage + DOM actuel
  useEffect(() => {
    // mode
    try {
      const storedMode =
        (localStorage.getItem(STORAGE_MODE) as Mode | null) ??
        (document.documentElement.classList.contains("dark")
          ? "dark"
          : "light");
      applyMode(storedMode, { persist: false });
    } catch {
      applyMode(
        document.documentElement.classList.contains("dark") ? "dark" : "light",
        { persist: false }
      );
    }
    // theme
    try {
      const storedTheme =
        (localStorage.getItem(STORAGE_THEME) as SwamiTheme | null) ??
        ((document.documentElement.getAttribute("data-theme") ||
          "garage") as SwamiTheme);
      applyTheme(storedTheme, { persist: false });
    } catch {
      applyTheme(
        (document.documentElement.getAttribute("data-theme") ||
          "garage") as SwamiTheme,
        { persist: false }
      );
    }
    // outside click / esc
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    const onPointer = (e: PointerEvent) => {
      if (!ref.current) return;
      if (!ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("keydown", onKey);
    document.addEventListener("pointerdown", onPointer, { capture: true });
    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("pointerdown", onPointer, {
        capture: true,
      } as any);
    };
  }, []);

  function applyMode(m: Mode, opts: { persist?: boolean } = { persist: true }) {
    setMode(m);
    document.documentElement.classList.toggle("dark", m === "dark");
    if (opts.persist) {
      try {
        localStorage.setItem(STORAGE_MODE, m);
      } catch {}
    }
  }
  function applyTheme(
    t: SwamiTheme,
    opts: { persist?: boolean } = { persist: true }
  ) {
    setTheme(t);
    document.documentElement.setAttribute("data-theme", t);
    if (opts.persist) {
      try {
        localStorage.setItem(STORAGE_THEME, t);
      } catch {}
    }
  }

  const btnStyle: React.CSSProperties = {
    width: size,
    height: size,
    borderRadius: 999,
    background: "#0b0b0c",
    border: "1px solid rgba(255,255,255,0.12)",
    color: "#fff",
  };

  return (
    <div className="relative" ref={ref}>
      {/* Bouton header (remplace l’actuel nuit/jour) */}
      <button
        className="inline-flex items-center justify-center hover:opacity-90 transition focus-visible:outline-none"
        style={btnStyle}
        aria-haspopup="menu"
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
      >
        {mode === "dark" ? (
          <Moon className="w-4 h-4" />
        ) : (
          <Sun className="w-4 h-4" />
        )}
      </button>

      {/* Menu */}
      {open && (
        <div
          role="menu"
          className="absolute right-0 mt-2 w-60 rounded-xl border shadow-xl overflow-hidden z-50"
          style={{
            background: "#0b0b0c",
            borderColor: "rgba(255,255,255,0.12)",
          }}
        >
          {/* Ligne mode jour/nuit */}
          <div className="flex items-center justify-between px-3 py-2">
            <span className="text-xs uppercase tracking-wide text-white/70">
              Mode
            </span>
            <div
              className="inline-flex rounded-lg border overflow-hidden"
              style={{ borderColor: "rgba(255,255,255,0.12)" }}
            >
              <button
                onClick={() => {
                  applyMode("light"); // ⬅️ ne ferme plus le menu
                }}
                className={`px-3 py-1.5 text-sm flex items-center gap-1 ${
                  mode === "light" ? "bg-white text-black" : "text-white/90"
                }`}
              >
                <Sun className="w-3.5 h-3.5" /> Jour
              </button>
              <button
                onClick={() => {
                  applyMode("dark"); // ⬅️ ne ferme plus le menu
                }}
                className={`px-3 py-1.5 text-sm flex items-center gap-1 ${
                  mode === "dark" ? "bg-white text-black" : "text-white/90"
                }`}
              >
                <Moon className="w-3.5 h-3.5" /> Nuit
              </button>
            </div>
          </div>

          <div
            className="h-px"
            style={{ background: "rgba(255,255,255,0.08)" }}
          />

          {/* Liste des thèmes */}
          <div className="px-3 pt-2 pb-2">
            <div className="mb-1 text-xs uppercase tracking-wide text-white/70 flex items-center gap-1">
              <Palette className="w-3.5 h-3.5" /> Thème
            </div>
            <div className="flex flex-col">
              {THEMES.map(({ id, label }) => (
                <button
                  key={id}
                  role="menuitemradio"
                  aria-checked={theme === id}
                  onClick={() => {
                    applyTheme(id); // ⬅️ ne ferme plus le menu
                  }}
                  className="w-full flex items-center gap-2 px-2.5 py-2 text-sm rounded-lg hover:bg-white/10 text-left text-white"
                >
                  <span className="flex-1">{label}</span>
                  {theme === id && <Check className="w-4 h-4" />}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
