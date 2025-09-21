"use client";

import Link from "next/link";
import React from "react";
import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import {
  Wrench,
  Palette,
  LayoutGrid,
  Copy,
  Check,
  ArrowRight,
} from "lucide-react";

// ---------------------------------------------
// Types
// ---------------------------------------------
export type Model = {
  id: string;
  title: string;
  slug: string; // local anchor
  description: string;
  tags: string[]; // e.g. ["buttons", "ux"]
  Preview: React.FC;
  code: string; // minimal snippet to copy
};

// ---------------------------------------------
// Demo components (previews)
// ---------------------------------------------
const PreviewButtons: React.FC = () => (
  <div className="flex flex-wrap items-center gap-3">
    <button className="rounded-xl bg-yellow-300 px-4 py-2 font-semibold text-black shadow-sm ring-2 ring-yellow-200 transition hover:shadow-yellow-300/30 focus:outline-none focus-visible:ring-4 focus-visible:ring-yellow-400/60">
      Primaire
    </button>
    <button className="rounded-xl border border-zinc-800 bg-zinc-900/70 px-4 py-2 text-zinc-200 transition hover:bg-zinc-900 focus:outline-none focus-visible:ring-4 focus-visible:ring-white/10">
      Ghost
    </button>
    <button className="rounded-xl border border-yellow-400/40 px-4 py-2 text-yellow-300 transition hover:bg-yellow-300/10 focus:outline-none focus-visible:ring-4 focus-visible:ring-yellow-400/40">
      Outline
    </button>
    <button className="rounded-xl bg-gradient-to-br from-zinc-800 to-zinc-900 px-4 py-2 text-zinc-200 shadow-inner ring-1 ring-white/10 transition hover:brightness-110 focus:outline-none focus-visible:ring-4 focus-visible:ring-white/10">
      Subtil
    </button>
  </div>
);

const PreviewSkeleton: React.FC = () => (
  <div className="w-full max-w-sm overflow-hidden rounded-2xl border border-zinc-800 bg-gradient-to-b from-zinc-900 to-black p-4 ring-1 ring-white/5">
    <div className="h-36 w-full animate-pulse rounded-xl bg-zinc-800/60" />
    <div className="mt-4 space-y-2">
      <div className="h-4 w-2/3 animate-pulse rounded bg-zinc-800/60" />
      <div className="h-3 w-full animate-pulse rounded bg-zinc-800/60" />
      <div className="h-3 w-5/6 animate-pulse rounded bg-zinc-800/60" />
    </div>
    <div className="mt-4 flex gap-2">
      <div className="h-9 w-24 animate-pulse rounded-lg bg-zinc-800/60" />
      <div className="h-9 w-24 animate-pulse rounded-lg bg-zinc-800/60" />
    </div>
  </div>
);

const PreviewStats: React.FC = () => (
  <div className="w-full max-w-sm rounded-2xl border border-zinc-800 bg-gradient-to-b from-zinc-900 to-black p-4 ring-1 ring-white/5">
    <div className="flex items-center justify-between text-sm text-zinc-300">
      <span>Progression</span>
      <span className="font-medium text-yellow-300">72%</span>
    </div>
    <div className="mt-2 h-3 w-full rounded-full bg-zinc-800">
      <div className="h-full w-[72%] rounded-full bg-gradient-to-r from-yellow-300 to-amber-400" />
    </div>
    <div className="mt-3 grid grid-cols-3 gap-2 text-[11px] text-zinc-400">
      <div className="rounded-lg bg-zinc-900/60 p-2 ring-1 ring-white/5">
        <span className="block text-zinc-300">Design</span> 80%
      </div>
      <div className="rounded-lg bg-zinc-900/60 p-2 ring-1 ring-white/5">
        <span className="block text-zinc-300">Code</span> 65%
      </div>
      <div className="rounded-lg bg-zinc-900/60 p-2 ring-1 ring-white/5">
        <span className="block text-zinc-300">Déploiement</span> 55%
      </div>
    </div>
  </div>
);

// --- New Previews (6) ---
const PreviewModal: React.FC = () => (
  <div className="relative h-48 w-full max-w-sm rounded-2xl border border-zinc-800 bg-zinc-950 p-4 ring-1 ring-white/5">
    <div className="absolute inset-0 rounded-xl bg-black/50" />
    <div className="absolute left-1/2 top-1/2 w-[85%] -translate-x-1/2 -translate-y-1/2 rounded-2xl border border-zinc-700 bg-zinc-900 p-4 text-sm shadow-2xl">
      <div className="mb-2 font-semibold text-zinc-100">Titre de la modal</div>
      <p className="text-zinc-300">
        Petit contenu de démonstration dans une modal.
      </p>
      <div className="mt-3 flex gap-2">
        <button className="rounded-lg bg-yellow-300 px-3 py-1.5 text-black">
          Valider
        </button>
        <button className="rounded-lg border border-zinc-700 px-3 py-1.5 text-zinc-200">
          Annuler
        </button>
      </div>
    </div>
  </div>
);

const PreviewToast: React.FC = () => (
  <div className="relative h-40 w-full max-w-sm rounded-2xl border border-zinc-800 bg-zinc-950 p-4 ring-1 ring-white/5">
    <div className="absolute right-3 top-3 rounded-xl border border-emerald-400/30 bg-emerald-500/15 px-3 py-2 text-sm text-emerald-300 shadow">
      ✅ Sauvegardé !{" "}
      <span className="text-emerald-200/80">Tout est à jour.</span>
    </div>
    <div className="text-zinc-400">Zone de travail…</div>
  </div>
);

const PreviewTabs: React.FC = () => (
  <div className="w-full max-w-sm rounded-2xl border border-zinc-800 bg-zinc-950 p-4 ring-1 ring-white/5">
    <div className="flex gap-2">
      <button className="rounded-lg bg-zinc-800 px-3 py-1.5 text-sm text-white">
        Onglet A
      </button>
      <button className="rounded-lg px-3 py-1.5 text-sm text-zinc-300 hover:bg-zinc-900">
        Onglet B
      </button>
      <button className="rounded-lg px-3 py-1.5 text-sm text-zinc-300 hover:bg-zinc-900">
        Onglet C
      </button>
    </div>
    <div className="mt-3 rounded-xl border border-zinc-800 bg-zinc-900 p-3 text-sm text-zinc-200">
      Contenu de l’onglet A (exemple).
    </div>
  </div>
);

const PreviewPricing: React.FC = () => (
  <div className="w-full max-w-sm rounded-2xl border border-zinc-800 bg-gradient-to-b from-zinc-900 to-black p-4 ring-1 ring-white/5">
    <div className="text-sm text-zinc-300">
      Plan <span className="font-semibold text-white">Indie</span>
    </div>
    <div className="mt-1 text-3xl font-bold text-yellow-300">
      9€<span className="text-base text-zinc-400"> /mo</span>
    </div>
    <ul className="mt-3 space-y-1 text-sm text-zinc-300">
      <li>• 3 projets</li>
      <li>• Analytics basiques</li>
      <li>• Support email</li>
    </ul>
    <button className="mt-4 w-full rounded-xl bg-yellow-300 py-2 font-semibold text-black">
      Choisir
    </button>
  </div>
);

const PreviewAvatarStack: React.FC = () => (
  <div className="w-full max-w-sm rounded-2xl border border-zinc-800 bg-zinc-950 p-4 ring-1 ring-white/5">
    <div className="flex items-center">
      <div className="flex -space-x-2">
        <div className="h-8 w-8 rounded-full border border-zinc-900 bg-gradient-to-br from-fuchsia-400 to-pink-500" />
        <div className="h-8 w-8 rounded-full border border-zinc-900 bg-gradient-to-br from-sky-400 to-blue-500" />
        <div className="h-8 w-8 rounded-full border border-zinc-900 bg-gradient-to-br from-emerald-400 to-teal-500" />
        <div className="h-8 w-8 rounded-full border border-zinc-900 bg-gradient-to-br from-amber-300 to-orange-400" />
      </div>
      <span className="ms-3 text-sm text-zinc-300">+ 12 contributeurs</span>
    </div>
  </div>
);

const PreviewBreadcrumbs: React.FC = () => (
  <div className="w-full max-w-sm rounded-2xl border border-zinc-800 bg-zinc-950 p-4 ring-1 ring-white/5">
    <nav aria-label="breadcrumbs" className="text-sm">
      <ol className="flex flex-wrap items-center gap-1 text-zinc-400">
        <li>
          <a
            className="rounded px-1 hover:bg-zinc-900 hover:text-zinc-200"
            href="#"
          >
            Accueil
          </a>
        </li>
        <li>›</li>
        <li>
          <a
            className="rounded px-1 hover:bg-zinc-900 hover:text-zinc-200"
            href="#"
          >
            Projets
          </a>
        </li>
        <li>›</li>
        <li className="text-zinc-200">SwamiVerse</li>
      </ol>
    </nav>
  </div>
);

// ---------------------------------------------
// Mock DB
// ---------------------------------------------
const MODELS: Model[] = [
  {
    id: "btn-kit",
    title: "Button Kit",
    slug: "btn-kit",
    description: "4 variantes de boutons Tailwind accessibles.",
    tags: ["buttons", "tailwind", "a11y"],
    Preview: PreviewButtons,
    code: `<div className="flex gap-3">
  <button className="rounded-xl bg-yellow-300 px-4 py-2 font-semibold text-black ring-2 ring-yellow-200 focus-visible:ring-4">Primaire</button>
  <button className="rounded-xl border border-zinc-800 bg-zinc-900/70 px-4 py-2 text-zinc-200 focus-visible:ring-4 focus-visible:ring-white/10">Ghost</button>
  <button className="rounded-xl border border-yellow-400/40 px-4 py-2 text-yellow-300 focus-visible:ring-4 focus-visible:ring-yellow-400/40">Outline</button>
  <button className="rounded-xl bg-gradient-to-br from-zinc-800 to-zinc-900 px-4 py-2 text-zinc-200 ring-1 ring-white/10">Subtil</button>
</div>`,
  },
  {
    id: "card-skeleton",
    title: "Card Skeleton",
    slug: "card-skeleton",
    description: "Carte de chargement avec shimmer simple.",
    tags: ["loading", "cards"],
    Preview: PreviewSkeleton,
    code: `<div className="max-w-sm rounded-2xl border border-zinc-800 p-4 bg-zinc-950">
  <div className="h-36 w-full animate-pulse rounded-xl bg-zinc-800/60" />
  <div className="mt-4 space-y-2">
    <div className="h-4 w-2/3 animate-pulse rounded bg-zinc-800/60" />
    <div className="h-3 w-full animate-pulse rounded bg-zinc-800/60" />
    <div className="h-3 w-5/6 animate-pulse rounded bg-zinc-800/60" />
  </div>
</div>`,
  },
  {
    id: "stats-bar",
    title: "Stats Bar",
    slug: "stats-bar",
    description: "Barre de progression + micro cartes de stats.",
    tags: ["data", "stats"],
    Preview: PreviewStats,
    code: `<div className="max-w-sm p-4 rounded-2xl border border-zinc-800 bg-zinc-950">
  <div className="flex justify-between text-sm"><span>Progression</span><span className="text-yellow-300">72%</span></div>
  <div className="mt-2 h-3 w-full rounded-full bg-zinc-800">
    <div className="h-full w-[72%] rounded-full bg-gradient-to-r from-yellow-300 to-amber-400" />
  </div>
</div>`,
  },

  // ---- New 6 models ----
  {
    id: "modal-basic",
    title: "Modal Basic",
    slug: "modal-basic",
    description: "Fenêtre modale avec overlay, boutons primaire/secondaire.",
    tags: ["overlay", "modal", "a11y"],
    Preview: PreviewModal,
    code: `<div className="relative">
  <div className="fixed inset-0 bg-black/50" />
  <div className="fixed left-1/2 top-1/2 w-[92%] max-w-sm -translate-x-1/2 -translate-y-1/2 rounded-2xl border border-zinc-700 bg-zinc-900 p-4 shadow-2xl">
    <div className="mb-2 font-semibold text-zinc-100">Titre de la modal</div>
    <p className="text-zinc-300">Petit contenu de démonstration.</p>
    <div className="mt-3 flex gap-2">
      <button className="rounded-lg bg-yellow-300 px-3 py-1.5 text-black">Valider</button>
      <button className="rounded-lg border border-zinc-700 px-3 py-1.5 text-zinc-200">Annuler</button>
    </div>
  </div>
</div>`,
  },
  {
    id: "toast-notif",
    title: "Toast Notification",
    slug: "toast-notif",
    description: "Toast discret en haut/droite, succès/erreur/infos.",
    tags: ["feedback", "toast", "ux"],
    Preview: PreviewToast,
    code: `<div className="fixed right-4 top-4 rounded-xl border border-emerald-400/30 bg-emerald-500/15 px-3 py-2 text-sm text-emerald-300 shadow">
  ✅ Sauvegardé ! <span className="text-emerald-200/80">Tout est à jour.</span>
</div>`,
  },
  {
    id: "tabs-minimal",
    title: "Tabs Minimal",
    slug: "tabs-minimal",
    description: "Onglets simples + panneau de contenu.",
    tags: ["navigation", "tabs"],
    Preview: PreviewTabs,
    code: `<div>
  <div className="flex gap-2">
    <button className="rounded-lg bg-zinc-800 px-3 py-1.5 text-sm text-white">Onglet A</button>
    <button className="rounded-lg px-3 py-1.5 text-sm text-zinc-300 hover:bg-zinc-900">Onglet B</button>
    <button className="rounded-lg px-3 py-1.5 text-sm text-zinc-300 hover:bg-zinc-900">Onglet C</button>
  </div>
  <div className="mt-3 rounded-xl border border-zinc-800 bg-zinc-900 p-3 text-sm text-zinc-200">
    Contenu de l’onglet A (exemple).
  </div>
</div>`,
  },
  {
    id: "pricing-card",
    title: "Pricing Card",
    slug: "pricing-card",
    description: "Carte de prix simple, CTA contrasté.",
    tags: ["marketing", "pricing", "cta"],
    Preview: PreviewPricing,
    code: `<div className="max-w-sm rounded-2xl border border-zinc-800 bg-gradient-to-b from-zinc-900 to-black p-4">
  <div className="text-sm text-zinc-300">Plan <span className="font-semibold text-white">Indie</span></div>
  <div className="mt-1 text-3xl font-bold text-yellow-300">9€<span className="text-base text-zinc-400"> /mo</span></div>
  <ul className="mt-3 space-y-1 text-sm text-zinc-300">
    <li>• 3 projets</li>
    <li>• Analytics basiques</li>
    <li>• Support email</li>
  </ul>
  <button className="mt-4 w-full rounded-xl bg-yellow-300 py-2 font-semibold text-black">Choisir</button>
</div>`,
  },
  {
    id: "avatar-stack",
    title: "Avatar Stack",
    slug: "avatar-stack",
    description: "Pile d’avatars avec compteur.",
    tags: ["avatars", "ui", "social"],
    Preview: PreviewAvatarStack,
    code: `<div className="flex items-center">
  <div className="flex -space-x-2">
    <div className="h-8 w-8 rounded-full border border-zinc-900 bg-gradient-to-br from-fuchsia-400 to-pink-500" />
    <div className="h-8 w-8 rounded-full border border-zinc-900 bg-gradient-to-br from-sky-400 to-blue-500" />
    <div className="h-8 w-8 rounded-full border border-zinc-900 bg-gradient-to-br from-emerald-400 to-teal-500" />
    <div className="h-8 w-8 rounded-full border border-zinc-900 bg-gradient-to-br from-amber-300 to-orange-400" />
  </div>
  <span className="ms-3 text-sm text-zinc-300">+ 12 contributeurs</span>
</div>`,
  },
  {
    id: "breadcrumbs-basic",
    title: "Breadcrumbs Basic",
    slug: "breadcrumbs-basic",
    description: "Fil d’Ariane minimal accessible.",
    tags: ["navigation", "breadcrumbs", "a11y"],
    Preview: PreviewBreadcrumbs,
    code: `<nav aria-label="breadcrumbs" className="text-sm">
  <ol className="flex flex-wrap items-center gap-1 text-zinc-400">
    <li><a className="rounded px-1 hover:bg-zinc-900 hover:text-zinc-200" href="#">Accueil</a></li>
    <li>›</li>
    <li><a className="rounded px-1 hover:bg-zinc-900 hover:text-zinc-200" href="#">Projets</a></li>
    <li>›</li>
    <li className="text-zinc-200">SwamiVerse</li>
  </ol>
</nav>`,
  },
];

// ---------------------------------------------
// Page
// ---------------------------------------------
export default function GaragePage() {
  const [filter, setFilter] = useState<string | null>(null);

  const models = useMemo(
    () => MODELS.filter((m) => (filter ? m.tags.includes(filter) : true)),
    [filter]
  );

  const allTags = useMemo(() => {
    const s = new Set<string>();
    MODELS.forEach((m) => m.tags.forEach((t) => s.add(t)));
    return Array.from(s).sort();
  }, []);

  const lastUpdated = useMemo(
    () =>
      new Date().toLocaleString("fr-FR", {
        dateStyle: "medium",
        timeStyle: "short",
      }),
    []
  );

  return (
    <>
      {/* Badge DB */}
      <div className="mt-6 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, y: -6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="inline-flex items-center gap-2 rounded-full border border-zinc-800 bg-zinc-900/50 px-3 py-1 text-xs text-zinc-300 shadow-inner ring-1 ring-white/5"
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

      {/* Hero + filtres */}
      <section className="relative mt-10 grid gap-6 lg:mt-14 lg:grid-cols-12">
        <div className="lg:col-span-7">
          <motion.h1
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-4xl font-bold leading-tight tracking-tight sm:text-5xl"
          >
            Garage
          </motion.h1>
          <p className="mt-4 max-w-2xl text-lg text-zinc-300">
            Showroom d’interfaces. On essaie un modèle ?
          </p>

          <div className="mt-5 flex flex-wrap gap-2">
            <button
              onClick={() => setFilter(null)}
              className={`inline-flex items-center gap-2 rounded-full border px-3 py-1 text-sm transition ${
                filter === null
                  ? "border-yellow-400/40 bg-yellow-300 text-black"
                  : "border-zinc-800 bg-zinc-900 text-zinc-200 hover:bg-zinc-900/80"
              }`}
            >
              <LayoutGrid className="h-3.5 w-3.5" /> Tout
            </button>
            {allTags.map((t) => (
              <button
                key={t}
                onClick={() => setFilter(t)}
                className={`rounded-full border px-3 py-1 text-sm transition ${
                  filter === t
                    ? "border-yellow-400/40 bg-yellow-300 text-black"
                    : "border-zinc-800 bg-zinc-900 text-zinc-200 hover:bg-zinc-900/80"
                }`}
              >
                {t}
              </button>
            ))}
          </div>
        </div>

        {/* Aside fun */}
        <motion.aside
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.05 }}
          className="lg:col-span-5"
          aria-label="Annonce"
        >
          <div className="relative overflow-hidden rounded-3xl border border-zinc-800 bg-gradient-to-b from-zinc-900 to-black p-5 shadow-xl ring-1 ring-white/10">
            <div className="pointer-events-none absolute -right-10 -top-10 h-40 w-40 rounded-full bg-yellow-300/10 blur-3xl" />
            <div className="flex items-start gap-3">
              <Wrench className="mt-0.5 h-5 w-5 text-yellow-300" />
              <div>
                <div className="text-sm font-semibold text-yellow-300">
                  Promo atelier
                </div>
                <p className="mt-1 text-sm text-zinc-200">
                  ⚠️ 1 bug acheté = 2 offerts. Graissage UI inclus.
                </p>
              </div>
            </div>
            <Link
              href="/blog"
              className="mt-4 inline-block rounded-xl bg-zinc-800/80 px-3 py-1.5 text-sm text-zinc-200 ring-1 ring-white/10 transition hover:bg-zinc-800"
            >
              Lire le devlog
            </Link>
          </div>
        </motion.aside>
      </section>

      {/* Grid */}
      <section className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {models.map((m, i) => (
          <ModelCard key={m.id} model={m} index={i} />
        ))}
      </section>
    </>
  );
}

// ---------------------------------------------
// Card
// ---------------------------------------------
function ModelCard({ model, index }: { model: Model; index: number }) {
  const { title, description, Preview, code, tags, slug } = model;
  const [copied, setCopied] = useState(false);
  const [showCode, setShowCode] = useState(false);

  const onCopy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 1200);
    } catch {
      // ignore
    }
  };

  return (
    <motion.article
      id={slug}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay: index * 0.05 }}
      className="group relative overflow-hidden rounded-3xl border border-zinc-800 bg-gradient-to-b from-zinc-900 to-black p-5 shadow-xl ring-1 ring-white/5"
    >
      <div className="flex items-start gap-3">
        <div className="rounded-2xl bg-black/20 p-3 ring-1 ring-white/10">
          <Palette className="h-6 w-6 text-yellow-300" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-white">{title}</h3>
          <p className="mt-1 text-sm text-zinc-300">{description}</p>
        </div>
      </div>

      <div className="mt-4">
        <Preview />
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-2 text-[11px] text-zinc-400">
        {tags.map((t) => (
          <span
            key={t}
            className="rounded-full border border-zinc-800 bg-zinc-900 px-2 py-0.5"
          >
            {t}
          </span>
        ))}
      </div>

      <div className="mt-4 flex items-center gap-2">
        <button
          onClick={onCopy}
          className="inline-flex items-center gap-2 rounded-xl border border-yellow-400/40 bg-zinc-900 px-3 py-1.5 text-sm text-zinc-100 transition hover:bg-zinc-900/80 focus:outline-none focus-visible:ring-4 focus-visible:ring-yellow-400/40"
        >
          {copied ? (
            <Check className="h-4 w-4 text-emerald-400" />
          ) : (
            <Copy className="h-4 w-4 text-yellow-300" />
          )}
          {copied ? "Copié !" : "Copier le code"}
        </button>
        <button
          onClick={() => setShowCode((s) => !s)}
          className="inline-flex items-center gap-2 rounded-xl border border-zinc-800 bg-zinc-900 px-3 py-1.5 text-sm text-zinc-100 transition hover:bg-zinc-900/80 focus:outline-none focus-visible:ring-4 focus-visible:ring-white/10"
          aria-expanded={showCode}
          aria-controls={`code-${slug}`}
        >
          {showCode ? "Masquer le code" : "Afficher le code"}
          <ArrowRight
            className={`h-4 w-4 transition-transform ${
              showCode ? "rotate-90" : ""
            }`}
          />
        </button>
      </div>

      {showCode && (
        <pre
          id={`code-${slug}`}
          className="mt-3 max-h-64 overflow-auto rounded-xl border border-zinc-800 bg-zinc-950 p-3 text-xs text-zinc-200"
        >
          {code}
        </pre>
      )}

      {/* focusable overlay for anchor linking without stealing clicks */}
      <a href={`#${slug}`} className="absolute inset-0 -z-10" aria-hidden />
    </motion.article>
  );
}
