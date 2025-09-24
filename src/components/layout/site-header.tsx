"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import PixelCounter from "../pixel-counter";
import HeaderThemeMenu from "./header-theme-menu"; // menu Jour/Nuit + Thèmes
import DebugResetButton from "@/components/debug-reset-button";

const nav = [
  { href: "/garage", label: "Garage" },
  { href: "/blog", label: "Blog" },
  { href: "/casino", label: "Casino" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
];

export function SiteHeader() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const btnRef = useRef<HTMLButtonElement | null>(null);
  const panelRef = useRef<HTMLDivElement | null>(null);

  // ESC pour fermer
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  // Clic extérieur pour fermer le panneau mobile
  useEffect(() => {
    function onClick(e: MouseEvent) {
      if (!open) return;
      if (panelRef.current && !panelRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, [open]);

  // Restaure le focus sur le bouton après fermeture
  useEffect(() => {
    if (!open && btnRef.current) {
      btnRef.current.focus({ preventScroll: true });
    }
  }, [open]);

  return (
    <header
      className="sticky top-0 z-40 border-b bg-[var(--card)]/95 backdrop-blur supports-[backdrop-filter]:bg-[var(--card)]/80"
      style={{ borderColor: "var(--border)" }}
    >
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-4 py-3 sm:px-6 lg:px-8">
        {/* Brand */}
        <Link
          href="/"
          className="flex items-center gap-3 focus:outline-none focus-visible:ring-4"
          style={{
            outlineColor: "color-mix(in oklab, var(--ring), transparent 60%)",
          }}
        >
          <div
            className="h-8 w-8 rounded-[var(--t-radius-md)] bg-gradient-to-br from-yellow-300 to-amber-400 shadow ring-1"
            style={{
              boxShadow: "var(--shadow-sm)",
              borderColor:
                "color-mix(in oklab, var(--primary), transparent 70%)",
            }}
            aria-hidden
          />
          <span
            className="text-sm font-semibold tracking-tight"
            style={{ color: "var(--foreground)" }}
          >
            SwamiVerse
          </span>
        </Link>

        {/* Nav desktop */}
        <nav
          aria-label="Navigation principale"
          className="hidden items-center gap-3 sm:flex"
        >
          {nav.map((l) => {
            const active =
              pathname === l.href ||
              (l.href !== "/" && pathname.startsWith(l.href));
            return (
              <Link
                key={l.href}
                href={l.href}
                aria-current={active ? "page" : undefined}
                className={[
                  "px-3 py-2 text-sm transition rounded-[var(--t-radius-sm)] focus:outline-none focus-visible:ring-4",
                  "hover:opacity-100",
                ].join(" ")}
                style={{
                  background: active ? "var(--secondary)" : "transparent",
                  color: active
                    ? "var(--secondary-foreground)"
                    : "var(--foreground)",
                  outlineColor:
                    "color-mix(in oklab, var(--ring), transparent 60%)",
                  borderColor: "var(--border)",
                }}
              >
                {l.label}
              </Link>
            );
          })}

          {/* Compteur de pixels */}
          <div className="ms-3">
            <PixelCounter />
          </div>

          {/* Menu thème (Jour/Nuit + Thèmes) — Desktop */}
          <div className="ms-2 hidden sm:block">
            <HeaderThemeMenu size={36} />
          </div>

          {/* Bouton Debug Reset dans le header */}
          <div className="ms-3">
            <DebugResetButton />
          </div>
        </nav>

        {/* Bouton burger (mobile) */}
        <div className="sm:hidden flex items-center gap-2">
          <PixelCounter />
          <button
            ref={btnRef}
            onClick={() => setOpen((v) => !v)}
            aria-label={open ? "Fermer le menu" : "Ouvrir le menu"}
            aria-expanded={open}
            className="inline-flex h-10 w-10 items-center justify-center transition"
            style={{
              borderRadius: "var(--t-radius-sm)",
              background: "var(--secondary)",
              color: "var(--secondary-foreground)",
              border: "1px solid var(--border)",
              boxShadow: "var(--shadow-sm)",
              outlineColor: "color-mix(in oklab, var(--ring), transparent 60%)",
            }}
          >
            {open ? (
              // Icone X
              <svg viewBox="0 0 24 24" className="h-5 w-5" aria-hidden>
                <path
                  d="M6 6l12 12M18 6L6 18"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
              </svg>
            ) : (
              // Icone menu
              <svg viewBox="0 0 24 24" className="h-5 w-5" aria-hidden>
                <path
                  d="M4 6h16M4 12h16M4 18h16"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
              </svg>
            )}
          </button>
        </div>
      </div>

      {/* Panneau mobile */}
      {open && (
        <>
          {/* Voile */}
          <div
            className="fixed inset-0 z-40 backdrop-blur-[1px]"
            style={{
              background:
                "color-mix(in oklab, var(--background), transparent 50%)",
            }}
          />
          {/* Panel coulissant */}
          <div
            ref={panelRef}
            role="dialog"
            aria-modal="true"
            aria-label="Menu"
            className="fixed right-0 top-0 z-50 h-dvh w-[82%] max-w-xs translate-x-0 overflow-y-auto shadow-2xl transition-transform duration-200 sm:hidden"
            style={{
              background: "var(--popover)",
              color: "var(--popover-foreground)",
              borderLeft: "1px solid var(--border)",
            }}
          >
            <div className="mb-4 flex items-center justify-between p-4">
              <span className="text-sm font-semibold tracking-tight">Menu</span>
              <button
                onClick={() => setOpen(false)}
                className="rounded-[var(--t-radius-sm)] p-2 transition"
                style={{
                  color: "var(--muted-foreground)",
                  background: "transparent",
                }}
                aria-label="Fermer le menu"
              >
                <svg viewBox="0 0 24 24" className="h-5 w-5" aria-hidden>
                  <path
                    d="M6 6l12 12M18 6L6 18"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                  />
                </svg>
              </button>
            </div>

            <ul className="space-y-1 px-4">
              {nav.map((l) => {
                const active =
                  pathname === l.href ||
                  (l.href !== "/" && pathname.startsWith(l.href));
                return (
                  <li key={l.href}>
                    <Link
                      href={l.href}
                      onClick={() => setOpen(false)}
                      aria-current={active ? "page" : undefined}
                      className="flex items-center justify-between rounded-[var(--t-radius-sm)] px-3 py-3 text-base transition"
                      style={{
                        background: active ? "var(--secondary)" : "transparent",
                        color: active
                          ? "var(--secondary-foreground)"
                          : "var(--foreground)",
                        border: "1px solid var(--border)",
                      }}
                    >
                      {l.label}
                    </Link>
                  </li>
                );
              })}
            </ul>

            {/* Menu thème intégré en mobile */}
            <div
              className="mt-4 border-t border-dashed pt-4 flex justify-center px-4"
              style={{
                borderColor:
                  "color-mix(in oklab, var(--border), transparent 30%)",
              }}
            >
              <HeaderThemeMenu size={40} />
            </div>

            <div
              className="mt-6 px-4 pb-6 text-xs"
              style={{ color: "var(--muted-foreground)" }}
            >
              💾 Page générée depuis SwamiVerse DB — MAJ :{" "}
              {new Date().toISOString().slice(0, 10)}
            </div>
          </div>
        </>
      )}
    </header>
  );
}
