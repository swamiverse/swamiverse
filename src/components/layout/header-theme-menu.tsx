"use client";
import { useEffect, useRef, useState } from "react";
import { Palette, Check, Sparkles, Square } from "lucide-react";

type SwamiTheme =
  | "garage"
  | "bibliotheque"
  | "acces-interdit"
  | "flix"
  | "beats";

const THEMES: { id: SwamiTheme; color: string; label: string }[] = [
  { id: "garage", color: "#facc15", label: "Garage" },
  { id: "bibliotheque", color: "#db2777", label: "Bibliothèque" },
  { id: "acces-interdit", color: "#22d3ee", label: "Accès interdit" },
  { id: "flix", color: "#e50914", label: "Flix" },
  { id: "beats", color: "#3b82f6", label: "Beats" },
];

const STORAGE_THEME = "swamiverse-theme";
const STORAGE_NEON = "swamiverse-neon";
const STORAGE_RADIUS = "swamiverse-radius";

export default function HeaderThemeMenu({ size = 36 }: { size?: number }) {
  const [open, setOpen] = useState(false);
  const [theme, setTheme] = useState<SwamiTheme>("garage");
  const [neon, setNeon] = useState(false);
  const [radius, setRadius] = useState(1); // 1 = normal
  const ref = useRef<HTMLDivElement | null>(null);

  // Bootstrap depuis storage
  useEffect(() => {
    try {
      const storedTheme =
        (localStorage.getItem(STORAGE_THEME) as SwamiTheme | null) ??
        ((document.documentElement.getAttribute("data-theme") ||
          "garage") as SwamiTheme);
      applyTheme(storedTheme, { persist: false });

      const storedNeon = localStorage.getItem(STORAGE_NEON);
      if (storedNeon) {
        setNeon(storedNeon === "true");
        document.documentElement.setAttribute(
          "data-neon",
          storedNeon === "true" ? "true" : "false"
        );
      }

      const storedRadius = localStorage.getItem(STORAGE_RADIUS);
      if (storedRadius) {
        const val = parseFloat(storedRadius);
        setRadius(val);
        document.documentElement.style.setProperty(
          "--radius-scale",
          val.toString()
        );
      }
    } catch {
      // fallback theme
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

  function toggleNeon() {
    const next = !neon;
    setNeon(next);
    document.documentElement.setAttribute("data-neon", next ? "true" : "false");
    try {
      localStorage.setItem(STORAGE_NEON, String(next));
    } catch {}
  }

  function updateRadius(val: number) {
    setRadius(val);
    document.documentElement.style.setProperty(
      "--radius-scale",
      val.toString()
    );
    try {
      localStorage.setItem(STORAGE_RADIUS, String(val));
    } catch {}
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
      {/* Bouton header */}
      <button
        className="inline-flex items-center justify-center hover:opacity-90 transition focus-visible:outline-none"
        style={btnStyle}
        aria-haspopup="menu"
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
      >
        <Palette className="w-4 h-4" />
      </button>

      {/* Menu */}
      {open && (
        <div
          role="menu"
          className="absolute right-0 mt-2 w-64 rounded-xl border shadow-xl overflow-hidden z-50 p-3 space-y-4"
          style={{
            background: "#0b0b0c",
            borderColor: "rgba(255,255,255,0.12)",
            color: "#fff",
          }}
        >
          {/* Sélecteur de thèmes */}
          <div>
            <div className="mb-2 text-xs uppercase tracking-wide text-white/70 flex items-center gap-1">
              <Palette className="w-3.5 h-3.5" /> Thème
            </div>
            <div className="flex gap-2 flex-wrap">
              {THEMES.map(({ id, color, label }) => (
                <button
                  key={id}
                  onClick={() => applyTheme(id)}
                  className="w-8 h-8 rounded-full border-2 flex items-center justify-center transition"
                  style={{
                    background: color,
                    borderColor:
                      theme === id ? "white" : "rgba(255,255,255,0.2)",
                  }}
                  title={label}
                  aria-label={label}
                >
                  {theme === id && <Check className="w-4 h-4 text-black" />}
                </button>
              ))}
            </div>
          </div>

          {/* Toggle Néon */}
          <div>
            <div className="mb-1 text-xs uppercase tracking-wide text-white/70 flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5" /> Néon
            </div>
            <button
              onClick={toggleNeon}
              className="w-full px-3 py-2 rounded-lg border text-sm flex items-center justify-between transition"
              style={{
                background: neon ? "var(--primary)" : "transparent",
                color: neon ? "var(--primary-foreground)" : "white",
                borderColor: "rgba(255,255,255,0.2)",
              }}
            >
              {neon ? "Activé" : "Désactivé"}
              {neon && <Check className="w-4 h-4" />}
            </button>
          </div>

          {/* Slider Radius */}
          <div>
            <div className="mb-1 text-xs uppercase tracking-wide text-white/70 flex items-center gap-1">
              <Square className="w-3.5 h-3.5" /> Radius
            </div>
            <input
              type="range"
              min={0.5}
              max={2}
              step={0.1}
              value={radius}
              onChange={(e) => updateRadius(parseFloat(e.target.value))}
              className="w-full accent-[var(--primary)]"
            />
          </div>
        </div>
      )}
    </div>
  );
}
