"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { Palette, ChevronUp, ChevronDown, Check } from "lucide-react";
import { useIsMounted } from "@/hooks/use-is-mounted";

type SwamiTheme =
  | "garage"
  | "bibliotheque"
  | "acces-interdit"
  | "flix"
  | "beats";

const THEMES: SwamiTheme[] = [
  "garage",
  "bibliotheque",
  "acces-interdit",
  "flix",
  "beats",
];
const STORAGE_KEY = "swamiverse-theme";

export default function ThemeSwitcher({
  anchorSelector = "[data-swamibot]",
  side = "left",
  gap = 12,
  size = 56,
  zIndex = 60,
}: {
  anchorSelector?: string;
  side?: "left" | "right";
  gap?: number;
  size?: number;
  zIndex?: number;
}) {
  const [open, setOpen] = useState(false);
  const [theme, setTheme] = useState<SwamiTheme>("garage");
  const ref = useRef<HTMLDivElement | null>(null);
  const mounted = useIsMounted();

  const [pos, setPos] = useState<{
    bottom: number;
    right?: number;
    left?: number;
  }>({
    bottom: 16,
    right: 16,
  });

  // bootstrap depuis localStorage ou <html data-theme="">
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY) as SwamiTheme | null;
      if (stored && THEMES.includes(stored)) {
        setTheme(stored);
        document.documentElement.setAttribute("data-theme", stored);
      } else {
        const current = (document.documentElement.getAttribute("data-theme") ||
          "garage") as SwamiTheme;
        if (THEMES.includes(current)) setTheme(current);
      }
    } catch {}
  }, []);

  // calcule position vs chatbot
  useEffect(() => {
    const compute = () => {
      const el = document.querySelector(anchorSelector) as HTMLElement | null;
      if (!el) {
        setPos({ bottom: 16, right: 16 });
        return;
      }
      const r = el.getBoundingClientRect();
      const bottom = Math.max(12, window.innerHeight - r.bottom);
      if (side === "left") {
        const right = Math.max(12, window.innerWidth - r.left + gap);
        setPos({ bottom, right });
      } else {
        const left = Math.max(12, r.right + gap);
        setPos({ bottom, left });
      }
    };
    compute();
    const ro = new ResizeObserver(compute);
    const el = document.querySelector(anchorSelector) as HTMLElement | null;
    if (el) ro.observe(el);
    window.addEventListener("resize", compute);
    window.addEventListener("scroll", compute, true);
    return () => {
      ro.disconnect();
      window.removeEventListener("resize", compute);
      window.removeEventListener("scroll", compute, true);
    };
  }, [anchorSelector, side, gap]);

  // ferme au clic extérieur / échappe
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    const onPointerDown = (e: PointerEvent) => {
      if (!ref.current) return;
      if (!ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("keydown", onKey);
    document.addEventListener("pointerdown", onPointerDown, { capture: true });
    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("pointerdown", onPointerDown, {
        capture: true,
      } as any);
    };
  }, []);

  const apply = (t: SwamiTheme) => {
    setTheme(t);
    try {
      localStorage.setItem(STORAGE_KEY, t);
    } catch {}
    document.documentElement.setAttribute("data-theme", t);
    setOpen(false);
  };

  // ⚡ Important : attendre le montage client avant de rendre le portal
  if (!mounted) return null;

  const btnStyle: React.CSSProperties = {
    width: size,
    height: size,
    borderRadius: size,
    background: "#0b0b0c",
    border: "1px solid rgba(255,255,255,0.12)",
    color: "#fff",
    boxShadow: "0 4px 16px oklch(0 0 0 / .25)",
  };

  return createPortal(
    <div
      ref={ref}
      style={{
        position: "fixed",
        zIndex,
        bottom: pos.bottom,
        right: pos.right,
        left: pos.left,
      }}
      aria-live="polite"
      onPointerDownCapture={(e) => e.stopPropagation()}
    >
      {/* bouton rond */}
      <button
        aria-label="Changer de thème"
        aria-haspopup="menu"
        aria-expanded={open}
        onClick={(e) => {
          e.stopPropagation();
          setOpen((v) => !v);
        }}
        onPointerDown={(e) => e.stopPropagation()}
        className="flex items-center justify-center transition hover:opacity-90 focus:outline-none"
        style={btnStyle}
      >
        <Palette className="w-5 h-5" />
        {open ? (
          <ChevronDown className="w-3 h-3 ml-1 opacity-70" />
        ) : (
          <ChevronUp className="w-3 h-3 ml-1 opacity-70" />
        )}
      </button>

      {/* menu */}
      {open && (
        <div
          role="menu"
          className="mt-2 rounded-xl border shadow-xl overflow-hidden"
          style={{
            background: "#0b0b0c",
            borderColor: "rgba(255,255,255,0.12)",
            minWidth: 180,
          }}
          onPointerDown={(e) => e.stopPropagation()}
        >
          {THEMES.map((id) => (
            <button
              key={id}
              role="menuitemradio"
              aria-checked={theme === id}
              onClick={() => apply(id)}
              className="w-full flex items-center gap-2 px-3 py-2 text-sm hover:opacity-90 text-left"
              style={{
                color: "#fff",
                borderBottom: "1px solid rgba(255,255,255,0.08)",
              }}
            >
              <span className="flex-1 capitalize">
                {id === "acces-interdit"
                  ? "Accès interdit"
                  : id === "bibliotheque"
                  ? "Bibliothèque"
                  : id}
              </span>
              {theme === id && <Check className="w-4 h-4" />}
            </button>
          ))}
        </div>
      )}
    </div>,
    document.body
  );
}
