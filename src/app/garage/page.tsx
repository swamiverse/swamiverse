"use client";

import { useEffect, useState, useMemo } from "react";
import { supabase } from "@/lib/supabaseClient";
import Link from "next/link";
import { motion } from "framer-motion";
import { Wrench, LayoutGrid } from "lucide-react";

// 👉 carte projet
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
    return <p className="p-8 text-[var(--muted-foreground)]">Chargement…</p>;
  }

  return (
    <>
      {/* Badge DB */}
      <div className="mt-6 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, y: -6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs shadow-inner"
          style={{
            borderColor: "var(--border)",
            background: "var(--muted)",
            color: "var(--muted-foreground)",
          }}
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
            style={{ color: "var(--foreground)" }}
          >
            Garage
          </motion.h1>
          <p
            className="mt-4 max-w-2xl text-lg"
            style={{ color: "var(--muted-foreground)" }}
          >
            Showroom d’interfaces. On essaie un modèle ?
          </p>

          <div className="mt-5 flex flex-wrap gap-2">
            <button
              onClick={() => setFilter(null)}
              className={`btn-secondary inline-flex items-center gap-2 ${
                filter === null ? "active" : ""
              }`}
            >
              <LayoutGrid className="h-3.5 w-3.5" /> Tout
            </button>
            {allTags.map((t) => (
              <button
                key={t}
                onClick={() => setFilter(t)}
                className={`btn-secondary ${filter === t ? "active" : ""}`}
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
          <div
            className="relative overflow-hidden rounded-3xl border p-5 shadow-xl"
            style={{
              background: "var(--card)",
              color: "var(--card-foreground)",
              borderColor: "var(--border)",
            }}
          >
            <div className="flex items-start gap-3">
              <Wrench
                className="mt-0.5 h-5 w-5"
                style={{ color: "var(--primary)" }}
              />
              <div>
                <div
                  className="text-sm font-semibold"
                  style={{ color: "var(--primary)" }}
                >
                  Promo atelier
                </div>
                <p
                  className="mt-1 text-sm"
                  style={{ color: "var(--muted-foreground)" }}
                >
                  ⚠️ 1 bug acheté = 2 offerts. Graissage UI inclus.
                </p>
              </div>
            </div>
            <Link
              href="/blog"
              className="btn-secondary mt-4 inline-block text-sm"
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
