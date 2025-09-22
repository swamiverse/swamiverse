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
    icon: Wrench,
    imgAlt: "Porte Garage — anthracite & jaune",
  },
  {
    id: "bibliotheque",
    title: "Bibliothèque",
    slug: "/bibliotheque",
    tagline: "Covers IA d’un manga qui n’existe pas encore.",
    icon: BookOpen,
    imgAlt: "Porte Bibliothèque — ivoire & magenta",
  },
  {
    id: "acces-interdit",
    title: "Accès interdit",
    slug: "/acces-interdit",
    tagline: "Zone expérimentale : trébucher recommandé.",
    icon: ShieldAlert,
    imgAlt: "Porte Accès interdit — noir & néon",
  },
  {
    id: "flix",
    title: "Flix",
    slug: "/flix",
    tagline: "The Swamiflix.",
    icon: Wrench,
    imgAlt: "Porte Flix — style cinéma",
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
          className="inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs shadow-inner ring-1"
          style={{
            background: "var(--card)",
            color: "var(--card-foreground)",
            borderColor: "var(--border)",
            // fallback inner shadow doux
            boxShadow:
              "inset 0 1px 0 color-mix(in oklab, var(--foreground), transparent 92%)",
          }}
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
            style={{
              color: "var(--foreground)",
              fontFamily: "var(--font-display)",
            }}
          >
            Salut, je suis Swami.{" "}
            <span style={{ color: "var(--primary)" }}>
              Je fabrique des mondes jouables.
            </span>
          </motion.h1>

          <p
            className="mt-4 max-w-2xl text-lg"
            style={{ color: "var(--muted-foreground)" }}
          >
            SwamiVerse est mon portfolio expérimental. Chaque page est alimentée
            par une base de contenus. J’y montre mon côté créatif, mon design,
            mon frontend et un peu de backend — avec humour.
          </p>

          <div className="mt-6 flex flex-wrap items-center gap-3">
            {/* CTA primaire */}
            <a
              href="#portes"
              className="group inline-flex items-center gap-2 px-4 py-2 font-medium transition focus:outline-none focus-visible:ring-4"
              style={{
                borderRadius: "var(--t-radius-xl)",
                background: "var(--primary)",
                color: "var(--primary-foreground)",
                boxShadow: "var(--shadow-md)",
                outlineColor:
                  "color-mix(in oklab, var(--ring), transparent 50%)",
              }}
            >
              Entrer dans le SwamiVerse
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
            </a>

            {/* CTA secondaires */}
            <Link
              href="/blog"
              className="inline-flex items-center gap-2 px-4 py-2 transition focus:outline-none focus-visible:ring-4"
              style={{
                borderRadius: "var(--t-radius-xl)",
                background: "var(--card)",
                color: "var(--card-foreground)",
                border: "1px solid var(--border)",
              }}
            >
              <Rss className="h-4 w-4" />
              SwamiBlog
            </Link>

            <Link
              href="/casino"
              className="inline-flex items-center gap-2 px-4 py-2 transition focus:outline-none focus-visible:ring-4"
              style={{
                borderRadius: "var(--t-radius-xl)",
                background: "var(--card)",
                color: "var(--card-foreground)",
                border: "1px solid var(--border)",
              }}
            >
              <Dice6 className="h-4 w-4" />
              SwamiCasino
            </Link>
          </div>

          <div
            className="mt-4 text-sm"
            style={{ color: "var(--muted-foreground)" }}
          >
            v1 focus : Home + Blog + Garage ·{" "}
            <span
              className="uppercase tracking-wide"
              style={{ color: "var(--foreground)" }}
            >
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
          <div
            className="relative overflow-hidden p-5 shadow-xl ring-1"
            style={{
              borderRadius: "var(--t-radius-xl)",
              background: "var(--card)",
              color: "var(--card-foreground)",
              border: "1px solid var(--border)",
              boxShadow: "var(--shadow-lg)",
            }}
          >
            <div
              className="pointer-events-none absolute -right-10 -top-10 h-40 w-40 rounded-full blur-3xl"
              style={{
                background:
                  "color-mix(in oklab, var(--primary), transparent 85%)",
              }}
              aria-hidden
            />
            <div className="flex items-start gap-3">
              <Sparkles
                className="mt-0.5 h-5 w-5"
                style={{ color: "var(--primary)" }}
              />
              <div>
                <div
                  className="text-sm font-semibold"
                  style={{ color: "var(--primary)" }}
                >
                  ⚠️ Promo laboratoire
                </div>
                <p
                  className="mt-1 text-sm"
                  style={{ color: "var(--muted-foreground)" }}
                >
                  1 bug acheté = 2 offerts. Pixel premium : brille mieux la
                  nuit.
                </p>
              </div>
            </div>
            <Link
              href="/acces-interdit"
              className="mt-4 inline-block px-3 py-1.5 text-sm transition"
              style={{
                borderRadius: "var(--t-radius-sm)",
                background:
                  "color-mix(in oklab, var(--secondary), transparent 20%)",
                color: "var(--foreground)",
                border: "1px solid var(--border)",
              }}
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
            <Door key={u.id + i} universe={u} index={i} />
          ))}
        </div>
      </section>
    </>
  );
}

function Door({ universe, index }: DoorProps) {
  const { title, slug, tagline, icon: Icon, imgAlt } = universe;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.05 * index }}
      className="group relative overflow-hidden p-5 transition focus:outline-none"
      style={{
        borderRadius: "var(--t-radius-xl)",
        background: "var(--card)",
        color: "var(--card-foreground)",
        border: "1px solid var(--border)",
        boxShadow: "var(--shadow-lg)",
        // halo léger au survol
        outlineColor: "color-mix(in oklab, var(--ring), transparent 70%)",
      }}
    >
      {/* voile décorative, teinte par le thème */}
      <div
        className="absolute inset-0 -z-10"
        style={{
          background:
            "linear-gradient(180deg, color-mix(in oklab, var(--primary), transparent 94%), transparent 60%)",
        }}
        aria-hidden
      />
      <div className="flex items-start gap-4">
        <div
          className="p-3 ring-1"
          style={{
            borderRadius: "var(--t-radius-md)",
            background: "color-mix(in oklab, var(--primary), transparent 90%)",
            color: "var(--primary)",
            borderColor: "color-mix(in oklab, var(--primary), transparent 70%)",
          }}
        >
          <Icon className="h-6 w-6" />
        </div>
        <div>
          <h3
            className="text-lg font-semibold"
            style={{ fontFamily: "var(--font-display)" }}
          >
            {title}
          </h3>
          <p
            className="mt-1 text-sm"
            style={{ color: "var(--muted-foreground)" }}
          >
            {tagline}
          </p>
          <div
            className="mt-3 inline-flex items-center gap-2 text-sm"
            style={{ color: "var(--foreground)" }}
          >
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
        className="pointer-events-none absolute -bottom-16 right-0 h-40 w-40 rounded-full blur-3xl"
        style={{
          background: "color-mix(in oklab, var(--primary), transparent 90%)",
        }}
        aria-hidden
      />
    </motion.div>
  );
}
