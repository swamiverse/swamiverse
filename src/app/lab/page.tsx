"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import { motion } from "framer-motion";

/**
 * SwamiVerse — /lab
 *
 * 👉 Ce composant propose :
 * 1) Un encadré sticky en haut avec 3 boutons qui appliquent un thème GLOBAL au site
 *    (en écrivant des --user-* sur :root + persistance localStorage).
 * 2) Une zone "sandbox" (aperçu) où l'utilisateur peut modifier des tokens SANS impacter le site entier.
 * 3) Plusieurs modules visuels (Hero, Cartes, Typo) avec contrôles fun (couleurs, radius, typo).
 *
 * ⚙️ Hypothèses d'intégration :
 * - Tailwind est configuré. On utilise des valeurs arbitraires pour lire des CSS variables.
 * - Le reste du site utilise les tokens --bg, --text, --card, --primary, --radius (via classes Tailwind).
 * - Placez un wrapper global (ex: <body>) avec bg-[var(--bg)] text-[var(--text)].
 */

// ----------------------
// Types & presets
// ----------------------

type Tokens = {
  bg: string;
  text: string;
  card: string;
  primary: string;
  radius: string; // avec unité, ex: "16px"
  fontBody?: string;
  fontDisplay?: string;
};

type PresetKey = "garage" | "bibliotheque" | "neon";

const PRESETS: Record<PresetKey, Tokens> = {
  garage: {
    bg: "#0f0f11",
    text: "#f6f6f6",
    card: "#17171a",
    primary: "#ffd33d",
    radius: "16px",
    fontBody:
      "ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Arial",
    fontDisplay: "ui-rounded, system-ui, Segoe UI, Roboto, Arial",
  },
  bibliotheque: {
    bg: "#f7f3ea",
    text: "#1a1523",
    card: "#ffffff",
    primary: "#e61e8c",
    radius: "12px",
    fontBody: "Georgia, Cambria, 'Times New Roman', Times, serif",
    fontDisplay: "'DM Serif Display', Georgia, serif",
  },
  neon: {
    bg: "#06070a",
    text: "#e6fff9",
    card: "#0a0f14",
    primary: "#00ffe0",
    radius: "24px",
    fontBody: "Inter, ui-sans-serif, system-ui, Roboto, Arial",
    fontDisplay: "Poppins, Inter, ui-sans-serif, system-ui",
  },
};

// ----------------------
// Helpers (global theme)
// ----------------------

const LS_KEY = "swami_user_theme";

export default function LabPage() {
  const sandboxRef = useRef<HTMLDivElement | null>(null);

  // State pour les contrôles du SANDBOX uniquement
  const [sandboxTokens, setSandboxTokens] = useState<Tokens>({
    bg: "#101114",
    text: "#f5f7fa",
    card: "#171a20",
    primary: "#ffd33d",
    radius: "16px",
    fontBody:
      "ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Arial",
    fontDisplay: "ui-rounded, system-ui, Segoe UI, Roboto, Arial",
  });

  // Applique des variables CSS dans un scope (root vs sandbox)
  const setToken = (
    scope: "root" | "sandbox",
    key: keyof Tokens,
    value: string
  ) => {
    const target =
      scope === "root" ? document.documentElement : sandboxRef.current;
    if (!target) return;
    target.style.setProperty(`--${key}`, value);
  };

  const applySandboxTokens = (tokens: Partial<Tokens>) => {
    const next = { ...sandboxTokens, ...tokens };
    setSandboxTokens(next);
    // push sur le conteneur sandbox uniquement
    Object.entries(next).forEach(([k, v]) => {
      if (typeof v === "string") setToken("sandbox", k as keyof Tokens, v);
    });
  };

  // Initialiser le SANDBOX avec les valeurs de state
  useEffect(() => {
    applySandboxTokens({});
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Recharger thème GLOBAL persistant si présent
  useEffect(() => {
    const raw = localStorage.getItem(LS_KEY);
    if (!raw) return;
    try {
      const parsed: Tokens = JSON.parse(raw);
      applyGlobalPreset(parsed);
    } catch {}
  }, []);

  // Appliquer un preset en GLOBAL (tout le site, session visiteur)
  const applyGlobalPreset = (tokens: Tokens | PresetKey) => {
    const t = typeof tokens === "string" ? PRESETS[tokens] : tokens;
    // Marqueur pour signaler qu'un thème user est actif
    document.documentElement.setAttribute("data-user-theme", "on");
    (Object.keys(t) as (keyof Tokens)[]).forEach((k) => {
      const v = t[k];
      if (typeof v === "string") {
        document.documentElement.style.setProperty(`--user-${k}`, v);
        // On pousse aussi sur les tokens effectifs pour sites déjà branchés
        document.documentElement.style.setProperty(`--${k}`, v);
      }
    });
    localStorage.setItem(LS_KEY, JSON.stringify(t));
  };

  // Reset global → revenir au thème de base/univers
  const resetGlobal = () => {
    document.documentElement.removeAttribute("data-user-theme");
    // Efface les --user-*
    [
      "bg",
      "text",
      "card",
      "primary",
      "radius",
      "fontBody",
      "fontDisplay",
    ].forEach((k) => {
      document.documentElement.style.removeProperty(`--user-${k}`);
    });
    localStorage.removeItem(LS_KEY);
  };

  // ----------------------
  // UI
  // ----------------------

  return (
    <div className="min-h-dvh bg-[var(--bg)] text-[var(--text)]">
      {/* ENCADRÉ STICKY — 3 boutons globaux + reset */}
      <div className="sticky top-0 z-50 backdrop-blur supports-[backdrop-filter]:bg-black/30 bg-black/60 border-b border-white/10">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center gap-3">
          <span className="text-sm opacity-80">Le Labo — Thèmes globaux :</span>
          <button
            onClick={() => applyGlobalPreset("garage")}
            className="px-3 py-1.5 rounded-xl bg-[var(--card)] hover:opacity-90 border border-white/10 text-sm"
          >
            Garage Nitro
          </button>
          <button
            onClick={() => applyGlobalPreset("bibliotheque")}
            className="px-3 py-1.5 rounded-xl bg-[var(--card)] hover:opacity-90 border border-white/10 text-sm"
          >
            Bibliothèque Ivoire
          </button>
          <button
            onClick={() => applyGlobalPreset("neon")}
            className="px-3 py-1.5 rounded-xl bg-[var(--card)] hover:opacity-90 border border-white/10 text-sm"
          >
            Neon Lab
          </button>

          <div className="ml-auto flex items-center gap-2">
            <span className="text-xs opacity-70">Style du site :</span>
            <button
              onClick={resetGlobal}
              className="px-2.5 py-1.5 rounded-lg bg-transparent border border-white/15 hover:bg-white/5 text-xs"
              title="Réinitialiser le thème global"
            >
              Reset
            </button>
          </div>
        </div>
      </div>

      {/* HERO */}
      <section className="max-w-6xl mx-auto px-4 md:px-8 py-10 md:py-14">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="grid md:grid-cols-2 gap-8"
        >
          <div>
            <h1 className="text-3xl md:text-5xl [font-family:var(--fontDisplay)] leading-tight">
              Bienvenue au{" "}
              <span className="bg-gradient-to-r from-[var(--primary)] to-white bg-clip-text text-transparent">
                Labo
              </span>
            </h1>
            <p className="mt-4 md:text-lg opacity-85 [font-family:var(--fontBody)]">
              Ici, la réalité a des sliders. Modifie couleurs, radius, typo… et
              regarde le site se transformer.
            </p>
            <div className="mt-6 flex gap-3">
              <a
                href="#sandbox"
                className="px-4 py-2 rounded-[calc(var(--radius)/1.5)] bg-[var(--primary)] text-black font-medium"
              >
                Jouer maintenant
              </a>
              <button className="px-4 py-2 rounded-[calc(var(--radius)/1.8)] border border-white/15 hover:bg-white/5">
                Doc rapide
              </button>
            </div>
            <p className="mt-4 text-xs opacity-60">
              💾 Page générée depuis SwamiVerse DB — MAJ :{" "}
              {/* brancher dynamiquement la date */}2025-09-20
            </p>
          </div>

          {/* Carte d'info rapide */}
          <div className="bg-[var(--card)] rounded-[var(--radius)] p-5 border border-white/10">
            <h3 className="text-lg [font-family:var(--fontDisplay)]">
              Ce que tu peux changer
            </h3>
            <ul className="mt-3 text-sm opacity-90 list-disc pl-5 space-y-1">
              <li>Couleurs (fond, texte, cartes, bouton primaire)</li>
              <li>Rayon des cartes et des boutons</li>
              <li>Typographies (body & display)</li>
            </ul>
            <p className="mt-3 text-xs opacity-60">
              Les réglages ci‑dessous n'affectent que l'aperçu sandbox. Les 3
              boutons en haut modifient tout le site.
            </p>
          </div>
        </motion.div>
      </section>

      {/* SANDBOX / Modules éditables */}
      <section id="sandbox" className="max-w-6xl mx-auto px-4 md:px-8 pb-20">
        <div className="grid lg:grid-cols-[1fr,380px] gap-8">
          {/* Aperçu (scope sandbox) */}
          <div
            ref={sandboxRef}
            className="rounded-[var(--radius)] border border-white/10 overflow-hidden"
            style={
              {
                // Valeurs par défaut du sandbox (au cas où)
                // NB: les contrôles vont surcharger via style.setProperty("--…")
                // @ts-ignore
                "--bg": sandboxTokens.bg,
                "--text": sandboxTokens.text,
                "--card": sandboxTokens.card,
                "--primary": sandboxTokens.primary,
                "--radius": sandboxTokens.radius,
                "--fontBody": sandboxTokens.fontBody,
                "--fontDisplay": sandboxTokens.fontDisplay,
              } as React.CSSProperties
            }
          >
            {/* Header sandbox */}
            <div className="bg-[var(--bg)] text-[var(--text)]">
              <div className="px-6 py-4 flex items-center justify-between border-b border-white/10">
                <div className="[font-family:var(--fontDisplay)]">
                  Sandbox Preview
                </div>
                <div className="text-xs opacity-70">Scope local uniquement</div>
              </div>

              {/* Contenu sandbox */}
              <div className="p-6 grid md:grid-cols-2 gap-6">
                {/* Module Cartes */}
                <div className="space-y-4">
                  <h4 className="[font-family:var(--fontDisplay)]">Cartes</h4>
                  <div className="grid sm:grid-cols-2 gap-4">
                    {[1, 2, 3, 4].map((i) => (
                      <article
                        key={i}
                        className="bg-[var(--card)] rounded-[var(--radius)] p-4 border border-white/10"
                      >
                        <h5 className="[font-family:var(--fontDisplay)]">
                          Carte {i}
                        </h5>
                        <p className="mt-1 text-sm opacity-85 [font-family:var(--fontBody)]">
                          Aperçu live. Rayon & couleurs suivent tes réglages.
                        </p>
                        <button className="mt-3 px-3 py-1.5 rounded-[calc(var(--radius)/1.5)] bg-[var(--primary)] text-black text-sm">
                          Action
                        </button>
                      </article>
                    ))}
                  </div>
                </div>

                {/* Module Typo */}
                <div className="space-y-4">
                  <h4 className="[font-family:var(--fontDisplay)]">
                    Typographies
                  </h4>
                  <div className="bg-[var(--card)] rounded-[var(--radius)] p-4 border border-white/10">
                    <p className="text-2xl [font-family:var(--fontDisplay)]">
                      Titre spectaculaire
                    </p>
                    <p className="mt-2 text-sm [font-family:var(--fontBody)] opacity-85">
                      Paragraphe de démonstration avec la police de corps
                      choisie. Accents français : éèàçùô.
                    </p>
                    <label className="block mt-4 text-xs opacity-80">
                      Bouton primaire
                    </label>
                    <button className="mt-1 px-3 py-1.5 rounded-[calc(var(--radius)/1.5)] bg-[var(--primary)] text-black text-sm">
                      Bouton
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Panneau de contrôle (n'affecte que SANDBOX) */}
          <div>
            <div className="bg-[var(--card)] rounded-[var(--radius)] p-4 border border-white/10 sticky top-20">
              <h3 className="[font-family:var(--fontDisplay)] text-lg">
                Contrôles (sandbox)
              </h3>

              <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
                <label className="space-y-1">
                  <span>Fond</span>
                  <input
                    type="color"
                    className="w-full h-9 rounded-md bg-transparent border border-white/10"
                    value={sandboxTokens.bg}
                    onChange={(e) => applySandboxTokens({ bg: e.target.value })}
                    aria-label="Couleur de fond"
                  />
                </label>
                <label className="space-y-1">
                  <span>Texte</span>
                  <input
                    type="color"
                    className="w-full h-9 rounded-md bg-transparent border border-white/10"
                    value={sandboxTokens.text}
                    onChange={(e) =>
                      applySandboxTokens({ text: e.target.value })
                    }
                    aria-label="Couleur du texte"
                  />
                </label>
                <label className="space-y-1">
                  <span>Cartes</span>
                  <input
                    type="color"
                    className="w-full h-9 rounded-md bg-transparent border border-white/10"
                    value={sandboxTokens.card}
                    onChange={(e) =>
                      applySandboxTokens({ card: e.target.value })
                    }
                    aria-label="Couleur des cartes"
                  />
                </label>
                <label className="space-y-1">
                  <span>Primaire</span>
                  <input
                    type="color"
                    className="w-full h-9 rounded-md bg-transparent border border-white/10"
                    value={sandboxTokens.primary}
                    onChange={(e) =>
                      applySandboxTokens({ primary: e.target.value })
                    }
                    aria-label="Couleur primaire"
                  />
                </label>
                <label className="col-span-2 space-y-1">
                  <span>Radius : {sandboxTokens.radius}</span>
                  <input
                    type="range"
                    min={0}
                    max={48}
                    value={parseInt(sandboxTokens.radius)}
                    onChange={(e) =>
                      applySandboxTokens({ radius: `${e.target.value}px` })
                    }
                    className="w-full"
                    aria-label="Rayon des cartes"
                  />
                </label>

                <label className="col-span-2 space-y-1">
                  <span>Police de titre</span>
                  <select
                    className="w-full h-9 rounded-md bg-transparent border border-white/10"
                    value={sandboxTokens.fontDisplay}
                    onChange={(e) =>
                      applySandboxTokens({ fontDisplay: e.target.value })
                    }
                  >
                    <option value="ui-rounded, system-ui, Segoe UI, Roboto, Arial">
                      UI Rounded
                    </option>
                    <option value="Poppins, Inter, ui-sans-serif, system-ui">
                      Poppins
                    </option>
                    <option value="'DM Serif Display', Georgia, serif">
                      DM Serif Display
                    </option>
                    <option value="Inter, ui-sans-serif, system-ui, Roboto, Arial">
                      Inter
                    </option>
                  </select>
                </label>

                <label className="col-span-2 space-y-1">
                  <span>Police de corps</span>
                  <select
                    className="w-full h-9 rounded-md bg-transparent border border-white/10"
                    value={sandboxTokens.fontBody}
                    onChange={(e) =>
                      applySandboxTokens({ fontBody: e.target.value })
                    }
                  >
                    <option value="ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Arial">
                      Système Sans
                    </option>
                    <option value="Inter, ui-sans-serif, system-ui, Roboto, Arial">
                      Inter
                    </option>
                    <option value="Georgia, Cambria, 'Times New Roman', Times, serif">
                      Georgia / Serif
                    </option>
                    <option value="Poppins, Inter, ui-sans-serif, system-ui">
                      Poppins
                    </option>
                  </select>
                </label>
              </div>

              {/* Actions */}
              <div className="mt-5 grid grid-cols-2 gap-2">
                <button
                  className="px-3 py-2 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-sm"
                  onClick={() =>
                    applySandboxTokens({
                      bg: "#101114",
                      text: "#f5f7fa",
                      card: "#171a20",
                      primary: "#ffd33d",
                      radius: "16px",
                      fontBody:
                        "ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Arial",
                      fontDisplay:
                        "ui-rounded, system-ui, Segoe UI, Roboto, Arial",
                    })
                  }
                >
                  Reset Sandbox
                </button>
                <button
                  className="px-3 py-2 rounded-lg bg-[var(--primary)] text-black font-medium text-sm"
                  onClick={() => applyGlobalPreset(sandboxTokens)}
                >
                  Appliquer au site
                </button>
              </div>

              <p className="mt-3 text-xs opacity-60">
                Astuce : clique sur un des 3 presets en haut pour changer *tout
                le site*, puis ajuste ici et “Appliquer au site”.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Pied avec pubs fun (option) */}
      <footer className="border-t border-white/10">
        <div className="max-w-6xl mx-auto px-4 md:px-8 py-8 flex items-center justify-between">
          <div className="text-sm opacity-75">
            ⚠️ Promo : 1 bug acheté = 2 offerts.
          </div>
          <a href="#top" className="text-sm underline opacity-80">
            Retour en haut
          </a>
        </div>
      </footer>
    </div>
  );
}
