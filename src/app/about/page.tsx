"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  Database,
  Workflow,
  Rocket,
  GitBranch,
  Wrench,
  BookOpen,
  Link2,
} from "lucide-react";

export default function AboutPage() {
  const lastUpdated = new Date().toLocaleString("fr-FR", {
    dateStyle: "medium",
    timeStyle: "short",
  });

  return (
    <>
      {/* Badge DB */}
      <div className="mt-6 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, y: -6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="inline-flex items-center gap-2 rounded-full border border-zinc-200 bg-black px-3 py-1 text-xs text-zinc-100 shadow-inner ring-1 ring-white/5 dark:border-zinc-800 dark:bg-zinc-900/50 dark:text-zinc-300"
        >
          <span role="img" aria-label="disquette">
            💾
          </span>
          <span>
            Page générée depuis <strong>SwamiVerse DB</strong> — MAJ :{" "}
            {lastUpdated}
          </span>
        </motion.div>
      </div>

      {/* Hero */}
      <section className="mt-10 lg:mt-14">
        <motion.h1
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-4xl font-bold leading-tight tracking-tight sm:text-5xl"
        >
          About — Making-of du SwamiVerse
        </motion.h1>
        <p className="mt-4 max-w-3xl text-lg text-zinc-700 dark:text-zinc-300">
          Portfolio expérimental, data-driven, construit vite et en public. Ici
          je documente l’architecture, les choix de design et la roadmap.
        </p>
        <div className="mt-5 flex flex-wrap gap-2 text-sm">
          {[
            "Next.js 15",
            "React 19",
            "Tailwind v4",
            "Framer Motion",
            "Lucide Icons",
          ].map((t) => (
            <span
              key={t}
              className="rounded-full border border-zinc-300 bg-white px-3 py-1 text-zinc-800 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-200"
            >
              {t}
            </span>
          ))}
        </div>
      </section>

      {/* Grid de sections */}
      <section className="mt-10 grid gap-6 lg:grid-cols-3">
        {/* Architecture */}
        <article className="rounded-3xl border border-zinc-200 bg-black p-5 text-white ring-1 ring-white/5 dark:border-zinc-800 dark:bg-gradient-to-b dark:from-zinc-900 dark:to-black">
          <div className="mb-3 flex items-center gap-2">
            <Workflow className="h-5 w-5 text-yellow-300" />
            <h2 className="text-lg font-semibold">Architecture</h2>
          </div>
          <p className="text-sm text-zinc-300">
            App Router, pages découplées, données centralisées (bientôt
            Notion/Airtable → Supabase). Un layout global pour header/footer,
            thème clair/nuit et SwamiBot volant.
          </p>
          <ul className="mt-4 list-disc space-y-1 pl-5 text-sm text-zinc-300">
            <li>Pages : Home, Blog, Garage, Casino, About, Contact</li>
            <li>
              Composants partagés : Header, Footer, ThemeProvider, SwamiBot
            </li>
            <li>Styles : Tailwind v4, dark mode par classe `.dark`</li>
          </ul>
        </article>

        {/* Schéma data (simplifié) */}
        <article className="rounded-3xl border border-zinc-200 bg-black p-5 text-white ring-1 ring-white/5 dark:border-zinc-800 dark:bg-gradient-to-b dark:from-zinc-900 dark:to-black">
          <div className="mb-3 flex items-center gap-2">
            <Database className="h-5 w-5 text-yellow-300" />
            <h2 className="text-lg font-semibold">Schéma data (v1)</h2>
          </div>
          <div className="overflow-hidden rounded-xl border border-zinc-300 bg-white text-zinc-800 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-200">
            <table className="w-full text-sm">
              <thead className="bg-zinc-100 dark:bg-zinc-800/60">
                <tr>
                  <th className="px-3 py-2 text-left">Collection</th>
                  <th className="px-3 py-2 text-left">Champs clés</th>
                </tr>
              </thead>
              <tbody>
                {[
                  ["UNIVERS", "id, title, slug, tagline, status, cover"],
                  ["PROJETS", "id, title, slug, type, universe, stack, demo"],
                  ["ARTICLES", "id, title, slug, excerpt, tags, date, status"],
                  ["AFFICHES", "id, title, category, image, synopsis"],
                  ["AUDIO", "id, title, kind, cover, audioUrl, duration"],
                  ["FAQ", "id, question, answer, tags"],
                ].map(([c, f]) => (
                  <tr
                    key={c}
                    className="border-t border-zinc-200 dark:border-zinc-800"
                  >
                    <td className="px-3 py-2 font-medium">{c}</td>
                    <td className="px-3 py-2">{f}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="mt-3 text-xs text-zinc-400">
            Note : source initiale Notion/Airtable, migration possible vers
            Supabase.
          </p>
        </article>

        {/* Roadmap */}
        <article className="rounded-3xl border border-zinc-200 bg-black p-5 text-white ring-1 ring-white/5 dark:border-zinc-800 dark:bg-gradient-to-b dark:from-zinc-900 dark:to-black">
          <div className="mb-3 flex items-center gap-2">
            <Rocket className="h-5 w-5 text-yellow-300" />
            <h2 className="text-lg font-semibold">Roadmap</h2>
          </div>
          <ol className="space-y-3 text-sm text-zinc-300">
            <li>
              <span className="font-medium">v1</span> — Home, Blog, Garage,
              About, Contact
            </li>
            <li>
              <span className="font-medium">v1.5</span> — Bibliothèque + Flix
              (simplifié)
            </li>
            <li>
              <span className="font-medium">v2</span> — Beats, WorldMap, Store
            </li>
          </ol>
          <Link
            href="/roadmap"
            className="mt-4 inline-flex items-center gap-2 rounded-xl border border-zinc-300 bg-white px-3 py-1.5 text-sm text-zinc-800 transition hover:bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-200"
          >
            <GitBranch className="h-4 w-4" />
            Voir la roadmap (Notion)
          </Link>
        </article>
      </section>

      {/* Liens utiles */}
      <section className="mt-10">
        <div className="rounded-3xl border border-zinc-200 bg-black p-5 text-white ring-1 ring-white/5 dark:border-zinc-800 dark:bg-gradient-to-b dark:from-zinc-900 dark:to-black">
          <div className="mb-3 flex items-center gap-2">
            <BookOpen className="h-5 w-5 text-yellow-300" />
            <h2 className="text-lg font-semibold">Liens & ressources</h2>
          </div>
          <ul className="grid gap-2 sm:grid-cols-2">
            {[
              { href: "/blog", label: "Devlog & articles" },
              { href: "/garage", label: "Garage — modèles UI" },
              { href: "/casino", label: "SwamiCasino — mini-jeu" },
              { href: "/contact", label: "Me contacter" },
            ].map((l) => (
              <li key={l.href}>
                <Link
                  href={l.href}
                  className="inline-flex items-center gap-2 rounded-xl border border-zinc-300 bg-white px-3 py-1.5 text-sm text-zinc-800 transition hover:bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-200"
                >
                  <Link2 className="h-4 w-4" />
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </>
  );
}
