"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowRight,
  Sparkles,
  Wrench,
  BookOpen,
  ShieldAlert,
  Rss,
  Dice6,
} from "lucide-react";
import React from "react";

type IconType = React.ComponentType<React.SVGProps<SVGSVGElement>>;
type Universe = {
  id: string;
  title: string;
  slug: string;
  tagline: string;
  theme: { card: string; accent: string; ring: string };
  icon: IconType;
  imgAlt: string;
};
type DoorProps = { universe: Universe; index: number };

const UNIVERS: Universe[] = [
  {
    id: "garage",
    title: "Garage",
    slug: "/garage",
    tagline: "Showroom d’interfaces.",
    theme: {
      card: "bg-gradient-to-b from-zinc-800 to-zinc-900",
      accent: "text-yellow-400",
      ring: "ring-yellow-400/30",
    },
    icon: Wrench,
    imgAlt: "Porte Garage — anthracite & jaune",
  },
  {
    id: "bibliotheque",
    title: "Bibliothèque",
    slug: "/bibliotheque",
    tagline: "Covers IA d’un manga qui n’existe pas encore.",
    theme: {
      card: "bg-gradient-to-b from-white to-rose-50",
      accent: "text-fuchsia-600",
      ring: "ring-fuchsia-400/30",
    },
    icon: BookOpen,
    imgAlt: "Porte Bibliothèque — ivoire & magenta",
  },
  {
    id: "acces-interdit",
    title: "Accès interdit",
    slug: "/acces-interdit",
    tagline: "Zone expérimentale : trébucher recommandé.",
    theme: {
      card: "bg-gradient-to-b from-zinc-900 to-black",
      accent: "text-emerald-400",
      ring: "ring-emerald-400/30",
    },
    icon: ShieldAlert,
    imgAlt: "Porte Accès interdit — noir & néon",
  },
  {
    id: "garage",
    title: "Flix",
    slug: "/flix",
    tagline: "The Swamiflix.",
    theme: {
      card: "bg-gradient-to-b from-zinc-800 to-zinc-900",
      accent: "text-yellow-400",
      ring: "ring-yellow-400/30",
    },
    icon: Wrench,
    imgAlt: "Porte Flix — anthracite & jaune",
  },
];

export default function HomePage() {
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
          aria-live="polite"
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
      <section className="relative mt-10 grid gap-6 lg:mt-14 lg:grid-cols-12">
        <div className="lg:col-span-7">
          <motion.h1
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-4xl font-bold leading-tight tracking-tight sm:text-5xl"
          >
            Salut, je suis Swami.{" "}
            <span className="text-yellow-500 dark:text-yellow-300">
              Je fabrique des mondes jouables.
            </span>
          </motion.h1>
          <p className="mt-4 max-w-2xl text-lg text-zinc-700 dark:text-zinc-300">
            SwamiVerse est mon portfolio expérimental. Chaque page est alimentée
            par une base de contenus. J’y montre mon côté créatif, mon design,
            mon frontend et un peu de backend — avec humour.
          </p>

          <div className="mt-6 flex flex-wrap items-center gap-3">
            <a
              href="#portes"
              className="group inline-flex items-center gap-2 rounded-2xl bg-yellow-400 px-4 py-2 font-medium text-black shadow-md ring-2 ring-yellow-200 transition hover:shadow-yellow-300/30 focus:outline-none focus-visible:ring-4 focus-visible:ring-yellow-400/60"
            >
              Entrer dans le SwamiVerse
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
            </a>

            <Link
              href="/blog"
              className="inline-flex items-center gap-2 rounded-2xl border border-zinc-300 bg-white px-4 py-2 text-zinc-800 transition hover:bg-zinc-50 focus:outline-none focus-visible:ring-4 focus-visible:ring-zinc-200 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-200 dark:hover:bg-zinc-900/80"
            >
              <Rss className="h-4 w-4" />
              SwamiBlog
            </Link>

            <Link
              href="/casino"
              className="inline-flex items-center gap-2 rounded-2xl border border-zinc-300 bg-white px-4 py-2 text-zinc-800 transition hover:bg-zinc-50 focus:outline-none focus-visible:ring-4 focus-visible:ring-zinc-200 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-200 dark:hover:bg-zinc-900/80"
            >
              <Dice6 className="h-4 w-4" />
              SwamiCasino
            </Link>
          </div>

          <div className="mt-4 text-sm text-zinc-500 dark:text-zinc-400">
            v1 focus : Home + Blog + Garage ·{" "}
            <span className="uppercase tracking-wide text-zinc-700 dark:text-zinc-300">
              WIP
            </span>
          </div>
        </div>

        {/* Aside fun */}
        <motion.aside
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.05 }}
          className="lg:col-span-5"
          aria-label="Publicité humoristique"
        >
          <div className="relative overflow-hidden rounded-3xl border border-zinc-200 bg-black p-5 text-white shadow-xl ring-1 ring-white/5 dark:border-zinc-800 dark:bg-gradient-to-b dark:from-zinc-900 dark:to-black dark:text-zinc-200">
            <div className="pointer-events-none absolute -right-10 -top-10 h-40 w-40 rounded-full bg-yellow-300/10 blur-3xl" />
            <div className="flex items-start gap-3">
              <Sparkles className="mt-0.5 h-5 w-5 text-yellow-300" />
              <div>
                <div className="text-sm font-semibold text-yellow-300">
                  ⚠️ Promo laboratoire
                </div>
                <p className="mt-1 text-sm">
                  1 bug acheté = 2 offerts. Pixel premium : brille mieux la
                  nuit.
                </p>
              </div>
            </div>
            <Link
              href="/acces-interdit"
              className="mt-4 inline-block rounded-xl bg-zinc-800/80 px-3 py-1.5 text-sm text-zinc-200 ring-1 ring-white/10 transition hover:bg-zinc-800"
            >
              Voir la zone expérimentale
            </Link>
          </div>
        </motion.aside>
      </section>

      {/* Doors */}
      <section id="portes" className="mt-12">
        <h2 className="sr-only">Choisir un univers</h2>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {UNIVERS.map((u, i) => (
            <Door key={u.id} universe={u} index={i} />
          ))}
        </div>
      </section>
    </>
  );
}

function Door({ universe, index }: DoorProps) {
  const { title, slug, tagline, theme, icon: Icon, imgAlt } = universe;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.05 * index }}
      className={`group relative overflow-hidden rounded-3xl
                  border border-zinc-200 bg-black text-white
                  dark:border-zinc-800 dark:bg-gradient-to-b dark:from-zinc-900 dark:to-black dark:text-zinc-50
                  p-5 shadow-xl ring-1 ring-white/5 transition focus:outline-none focus-visible:ring-4 ${theme.ring}`}
    >
      <div className={`absolute inset-0 -z-10 ${theme.card}`} aria-hidden />
      <div className="flex items-start gap-4">
        <div className="rounded-2xl bg-white/10 p-3 ring-1 ring-white/20 dark:bg-black/20 dark:ring-white/10">
          <Icon className={`h-6 w-6 ${theme.accent}`} />
        </div>
        <div>
          <h3 className="text-lg font-semibold">{title}</h3>
          <p className="mt-1 text-sm text-zinc-200 dark:text-zinc-300">
            {tagline}
          </p>
          <div className="mt-3 inline-flex items-center gap-2 text-sm text-zinc-200 dark:text-zinc-300">
            Explorer
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
          </div>
        </div>
      </div>
      <span className="sr-only">{imgAlt}</span>
      <Link
        href={slug}
        className="absolute inset-0"
        aria-label={`Aller à ${title}`}
      />
      <div
        className="pointer-events-none absolute -bottom-16 right-0 h-40 w-40 rounded-full bg-yellow-300/10 blur-3xl"
        aria-hidden
      />
    </motion.div>
  );
}
