"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ThemeToggle } from "./theme-toggle";
import { useEffect, useRef, useState } from "react";
import PixelCounter from "./pixel-counter";

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

  // Clic extérieur pour fermer
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
    <header className="sticky top-0 z-40 border-b border-zinc-900 bg-black">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-4 py-3 sm:px-6 lg:px-8">
        {/* Brand */}
        <Link
          href="/"
          className="flex items-center gap-3 focus:outline-none focus-visible:ring-4 focus-visible:ring-white/10"
        >
          <div
            className="h-8 w-8 rounded-xl bg-gradient-to-br from-yellow-300 to-amber-400 shadow ring-1 ring-yellow-200/50"
            aria-hidden
          />
          <span className="text-sm font-semibold tracking-tight text-zinc-100">
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
                  "rounded-xl px-3 py-2 text-sm transition focus:outline-none focus-visible:ring-4 focus-visible:ring-white/10",
                  active
                    ? "bg-zinc-900 text-white"
                    : "text-zinc-300 hover:bg-zinc-900 hover:text-white",
                ].join(" ")}
              >
                {l.label}
              </Link>
            );
          })}
          {/* Compteur de pixels 👇 */}
          <div className="ms-3">
            <PixelCounter />
          </div>
          {/* Theme toggle visible uniquement en desktop */}
          <div className="ms-2 hidden sm:block">
            <ThemeToggle />
          </div>
        </nav>

        {/* Bouton burger (mobile) */}
        <div className="sm:hidden flex items-center gap-2">
          <PixelCounter />
          {/* ThemeToggle en mobile retiré ici 👇 */}
          <button
            ref={btnRef}
            onClick={() => setOpen((v) => !v)}
            aria-label={open ? "Fermer le menu" : "Ouvrir le menu"}
            aria-expanded={open}
            className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-zinc-900 text-zinc-100 transition hover:bg-zinc-800 focus:outline-none focus-visible:ring-4 focus-visible:ring-white/10"
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
          <div className="fixed inset-0 z-40 bg-black/50 backdrop-blur-[1px]" />
          {/* Panel coulissant */}
          <div
            ref={panelRef}
            role="dialog"
            aria-modal="true"
            aria-label="Menu"
            className="fixed right-0 top-0 z-50 h-dvh w-[82%] max-w-xs translate-x-0 overflow-y-auto border-l border-white/10 bg-zinc-950 p-4 shadow-2xl transition-transform duration-200 sm:hidden"
          >
            <div className="mb-4 flex items-center justify-between">
              <span className="text-sm font-semibold tracking-tight text-zinc-100">
                Menu
              </span>
              <button
                onClick={() => setOpen(false)}
                className="rounded-lg p-2 text-zinc-300 transition hover:bg-zinc-900 focus:outline-none focus-visible:ring-4 focus-visible:ring-white/10"
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

            <ul className="space-y-1">
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
                      className={[
                        "flex items-center justify-between rounded-xl px-3 py-3 text-base transition focus:outline-none focus-visible:ring-4 focus-visible:ring-white/10",
                        active
                          ? "bg-zinc-900 text-white"
                          : "text-zinc-300 hover:bg-zinc-900 hover:text-white",
                      ].join(" ")}
                    >
                      {l.label}
                    </Link>
                  </li>
                );
              })}
            </ul>

            <div className="mt-4 border-t border-dashed border-white/10 pt-4 flex justify-center">
              <ThemeToggle />
            </div>

            <div className="mt-6 text-xs text-zinc-500">
              💾 Page générée depuis SwamiVerse DB — MAJ :{" "}
              {new Date().toISOString().slice(0, 10)}
            </div>
          </div>
        </>
      )}
    </header>
  );
}
