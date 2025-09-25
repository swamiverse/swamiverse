"use client";

import { useEffect, useState, useMemo } from "react";
import { supabase } from "@/lib/supabaseClient";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  Wrench,
  Palette,
  LayoutGrid,
  Copy,
  Check,
  ArrowRight,
} from "lucide-react";

// 👉 ajoute ton composant carte
import ModelCard from "@/components/model-card";

type Project = {
  id: number;
  title: string;
  slug: string;
  description: string;
  tags: string[];
  preview: string;
  code_snippet: string;
};

export default function GaragePage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [filter, setFilter] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const { data: univers } = await supabase
        .from("univers")
        .select("id")
        .eq("slug", "garage")
        .single();

      if (!univers) {
        setLoading(false);
        return;
      }

      const { data: projets } = await supabase
        .from("projets")
        .select("*")
        .eq("universe_id", univers.id)
        .eq("is_published", true);

      setProjects((projets as Project[]) || []);
      setLoading(false);
    }

    load();
  }, []);

  const filtered = useMemo(
    () => projects.filter((p) => (filter ? p.tags?.includes(filter) : true)),
    [projects, filter]
  );

  const allTags = useMemo(() => {
    const s = new Set<string>();
    projects.forEach((p) => p.tags?.forEach((t) => s.add(t)));
    return Array.from(s).sort();
  }, [projects]);

  const lastUpdated = useMemo(
    () =>
      new Date().toLocaleString("fr-FR", {
        dateStyle: "medium",
        timeStyle: "short",
      }),
    []
  );

  if (loading) {
    return <p className="p-8 text-zinc-500">Chargement…</p>;
  }

  return (
    <>
      {/* Badge DB */}
      <div className="mt-6 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, y: -6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="inline-flex items-center gap-2 rounded-full border border-zinc-800 bg-zinc-900/50 px-3 py-1 text-xs text-zinc-300 shadow-inner ring-1 ring-white/5"
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

        {/* Aside */}
        <motion.aside
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.05 }}
          className="lg:col-span-5"
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
        {filtered.map((p, i) => (
          <ModelCard key={p.id} project={p} index={i} />
        ))}
      </section>
    </>
  );
}
