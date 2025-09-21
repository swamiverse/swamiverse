"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Rss, Tag, ArrowRight, Calendar } from "lucide-react";

export type Post = {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  cover?: string;
  tags: string[];
  date: string;
  status: "published" | "draft";
};

const POSTS: Post[] = [
  {
    id: "p1",
    title: "Pourquoi un portfolio data-driven ?",
    slug: "portfolio-data-driven",
    excerpt:
      "Centraliser les contenus et itérer vite : la base de mon SwamiVerse.",
    tags: ["roadmap", "data", "portfolio"],
    date: "2025-09-14",
    status: "published",
  },
  {
    id: "p2",
    title: "Garage : 6 modèles d’UI à essayer",
    slug: "garage-modeles-ui",
    excerpt:
      "Showroom d’interfaces : buttons, skeleton, stats, modal, tabs, plus…",
    tags: ["garage", "ui", "design"],
    date: "2025-09-12",
    status: "published",
  },
  {
    id: "p3",
    title: "WIP assumé : publier court, publier souvent",
    slug: "wip-assume",
    excerpt: "Rituel hebdo : un livrable, un screenshot, un devlog.",
    tags: ["productivité", "wip"],
    date: "2025-09-10",
    status: "published",
  },

  // --- 6 articles ajoutés ---
  {
    id: "p4",
    title: "SwamiCasino : de l’idée au prototype",
    slug: "swamicasino-prototype",
    excerpt:
      "Slots côté client, RNG maison, animations Framer Motion : carnet de bord.",
    tags: ["casino", "jeu", "frontend"],
    date: "2025-09-16",
    status: "published",
  },
  {
    id: "p5",
    title: "Design tokens : thème clair/nuit en 10 min",
    slug: "design-tokens-dark-mode",
    excerpt:
      "Approche pragmatique avec Tailwind v4 + classe .dark pilotée au runtime.",
    tags: ["design", "theming", "tailwind"],
    date: "2025-09-17",
    status: "published",
  },
  {
    id: "p6",
    title: "SwamiBot : le widget volant",
    slug: "swamibot-widget-volant",
    excerpt:
      "Bouton fixe bas-droite, panneau léger, état local : le guide express.",
    tags: ["bot", "ux", "react"],
    date: "2025-09-18",
    status: "published",
  },
  {
    id: "p7",
    title: "SEO vite fait bien fait pour un portfolio",
    slug: "seo-portfolio-express",
    excerpt:
      "Titres propres, OG, liens internes : le minimum vital pour être trouvé.",
    tags: ["seo", "blog"],
    date: "2025-09-11",
    status: "published",
  },
  {
    id: "p8",
    title: "Intégrer Notion/Airtable avant Supabase ?",
    slug: "notion-airtable-ou-supabase",
    excerpt:
      "Démarrer avec du no-code pour prototyper vite, migrer ensuite si besoin.",
    tags: ["data", "notion", "airtable", "supabase"],
    date: "2025-09-09",
    status: "published",
  },
  {
    id: "p9",
    title: "Roadmap v1 → v2 : quoi après ?",
    slug: "roadmap-v1-vers-v2",
    excerpt:
      "Après Home/Blog/Garage : Bibliothèque, Flix, puis Beats et WorldMap.",
    tags: ["roadmap", "planning"],
    date: "2025-09-05",
    status: "published",
  },
];

export default function BlogPage() {
  const [activeTag, setActiveTag] = useState<string | null>(null);

  const posts = useMemo(
    () =>
      POSTS.filter((p) => p.status === "published").filter((p) =>
        activeTag ? p.tags.includes(activeTag) : true
      ),
    [activeTag]
  );

  const allTags = useMemo(() => {
    const s = new Set<string>();
    POSTS.filter((p) => p.status === "published").forEach((p) =>
      p.tags.forEach((t) => s.add(t))
    );
    return Array.from(s).sort((a, b) => a.localeCompare(b));
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

      {/* Hero + filtres */}
      <section className="mt-10 flex flex-col items-start gap-4 lg:mt-14">
        <motion.h1
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="text-3xl font-bold tracking-tight sm:text-4xl"
        >
          SwamiBlog
        </motion.h1>
        <p className="max-w-2xl text-zinc-700 dark:text-zinc-300">
          Articles courts sur les univers, la fabrication et les démos.
        </p>

        <div className="mt-2 flex flex-wrap gap-2">
          <button
            onClick={() => setActiveTag(null)}
            className={`rounded-full border px-3 py-1 text-sm transition ${
              activeTag === null
                ? "border-yellow-400/40 bg-yellow-300 text-black"
                : "border-zinc-300 bg-white text-zinc-800 hover:bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-200"
            }`}
          >
            <span className="inline-flex items-center gap-1">
              <Rss className="h-3.5 w-3.5" /> Tout
            </span>
          </button>
          {allTags.map((t) => (
            <button
              key={t}
              onClick={() => setActiveTag(t)}
              className={`rounded-full border px-3 py-1 text-sm transition ${
                activeTag === t
                  ? "border-yellow-400/40 bg-yellow-300 text-black"
                  : "border-zinc-300 bg-white text-zinc-800 hover:bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-200"
              }`}
            >
              <span className="inline-flex items-center gap-1">
                <Tag className="h-3.5 w-3.5" /> {t}
              </span>
            </button>
          ))}
        </div>
      </section>

      {/* Grid */}
      <section className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {posts.map((p, i) => (
          <PostCard key={p.id} post={p} index={i} />
        ))}
      </section>
    </>
  );
}

function PostCard({ post, index }: { post: Post; index: number }) {
  const dt = new Date(post.date);
  const dateFmt = dt.toLocaleDateString("fr-FR", {
    year: "numeric",
    month: "short",
    day: "2-digit",
  });
  return (
    <motion.article
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay: index * 0.05 }}
      className="group relative overflow-hidden rounded-3xl
                 border border-zinc-200 bg-black p-5 text-white shadow-xl ring-1 ring-white/5
                 dark:border-zinc-800 dark:bg-gradient-to-b dark:from-zinc-900 dark:to-black dark:text-zinc-50"
    >
      <div className="flex items-start justify-between gap-3">
        <h3 className="text-lg font-semibold">
          <Link href={`/blog/${post.slug}`} className="hover:underline">
            {post.title}
          </Link>
        </h3>
        <time
          dateTime={post.date}
          className="flex items-center gap-1 text-xs text-zinc-300 dark:text-zinc-400"
        >
          <Calendar className="h-3.5 w-3.5" /> {dateFmt}
        </time>
      </div>
      <p className="mt-2 text-sm text-zinc-200 dark:text-zinc-300">
        {post.excerpt}
      </p>

      <div className="mt-3 flex flex-wrap items-center gap-2">
        {post.tags.map((t) => (
          <span
            key={t}
            className="inline-flex items-center gap-1 rounded-full border border-zinc-300 bg-white px-2 py-0.5 text-[11px] text-zinc-700 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-300"
          >
            <Tag className="h-3 w-3" /> {t}
          </span>
        ))}
      </div>

      <Link
        href={`/blog/${post.slug}`}
        className="mt-4 inline-flex items-center gap-2 text-sm text-yellow-300"
      >
        Lire{" "}
        <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
      </Link>

      <Link
        href={`/blog/${post.slug}`}
        className="absolute inset-0"
        aria-label={`Lire: ${post.title}`}
      />
    </motion.article>
  );
}
