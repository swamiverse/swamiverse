// src/app/blog/page.tsx
"use client";

import Link from "next/link";
import Image from "next/image";
import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Rss, Tag, ArrowRight, Calendar } from "lucide-react";
import { ARTICLES } from "@/content/articles";

export default function BlogPage() {
  const [activeTag, setActiveTag] = useState<string | null>(null);

  const posts = useMemo(
    () =>
      ARTICLES.filter((p) => p).filter((p) =>
        activeTag ? p.tags.includes(activeTag) : true
      ),
    [activeTag]
  );

  const allTags = useMemo(() => {
    const s = new Set<string>();
    ARTICLES.forEach((p) => p.tags.forEach((t) => s.add(t)));
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
    <div className="max-w-6xl mx-auto p-6">
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
          <FilterButton
            label="Tout"
            icon={<Rss className="h-3.5 w-3.5" />}
            active={activeTag === null}
            onClick={() => setActiveTag(null)}
          />
          {allTags.map((t) => (
            <FilterButton
              key={t}
              label={t}
              icon={<Tag className="h-3.5 w-3.5" />}
              active={activeTag === t}
              onClick={() => setActiveTag(t)}
            />
          ))}
        </div>
      </section>

      {/* Grid */}
      <section className="mt-10 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
        {posts.map((p, i) => (
          <PostCard key={p.id} post={p} index={i} />
        ))}
      </section>

      {/* Pub humoristique (placeholder) */}
      <div className="mt-16 text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4 }}
          className="rounded-2xl border border-yellow-300 bg-yellow-100 px-6 py-4 text-yellow-900 shadow-md inline-block"
        >
          ⚠️ Promo spéciale : <strong>1 bug acheté = 2 offerts</strong>
        </motion.div>
      </div>
    </div>
  );
}

function FilterButton({
  label,
  icon,
  active,
  onClick,
}: {
  label: string;
  icon: React.ReactNode;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={`rounded-full border px-3 py-1 text-sm transition flex items-center gap-1 ${
        active
          ? "border-yellow-400/40 bg-yellow-300 text-black"
          : "border-zinc-300 bg-white text-zinc-800 hover:bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-200"
      }`}
    >
      {icon} {label}
    </button>
  );
}

function PostCard({ post, index }: { post: any; index: number }) {
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
      className="group relative overflow-hidden rounded-3xl border border-zinc-200 bg-white shadow-lg ring-1 ring-black/5 dark:border-zinc-800 dark:bg-zinc-900"
    >
      {/* Cover */}
      {post.cover && (
        <div className="relative w-full h-40">
          <Image
            src={post.cover}
            alt={post.title}
            fill
            className="object-cover"
          />
        </div>
      )}

      {/* Content */}
      <div className="p-5">
        <div className="flex items-start justify-between gap-3">
          <h3 className="text-lg font-semibold">
            <Link href={`/blog/${post.slug}`} className="hover:underline">
              {post.title}
            </Link>
          </h3>
          <time
            dateTime={post.date}
            className="flex items-center gap-1 text-xs text-zinc-500 dark:text-zinc-400"
          >
            <Calendar className="h-3.5 w-3.5" /> {dateFmt}
          </time>
        </div>

        <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-300">
          {post.excerpt}
        </p>

        <div className="mt-3 flex flex-wrap items-center gap-2">
          {post.tags.map((t: string) => (
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
          className="mt-4 inline-flex items-center gap-2 text-sm text-yellow-600 font-semibold hover:underline"
        >
          Explorer l’article
          <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
        </Link>
      </div>

      <Link
        href={`/blog/${post.slug}`}
        className="absolute inset-0"
        aria-label={`Lire: ${post.title}`}
      />
    </motion.article>
  );
}
