"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";
import { previewComponents } from "@/components/previews";
import { Copy, Check } from "lucide-react";

export default function ProjectPage() {
  const { slug } = useParams();
  const [project, setProject] = useState<any>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    async function load() {
      const { data } = await supabase
        .from("projets")
        .select("*")
        .eq("slug", slug)
        .eq("is_published", true)
        .single();

      setProject(data);
    }
    load();
  }, [slug]);

  if (!project) return <p className="p-8">Chargement...</p>;

  const Preview = previewComponents[project.slug];

  return (
    <main className="p-8">
      <h1 className="text-3xl font-bold">{project.title}</h1>
      <p className="text-zinc-400">{project.description}</p>

      {/* Preview dynamique */}
      <div className="mt-6 border rounded-xl bg-zinc-900 p-4">
        {Preview ? (
          <Preview />
        ) : (
          <div dangerouslySetInnerHTML={{ __html: project.preview }} />
        )}
      </div>

      {/* Bouton copier */}
      <div className="mt-4">
        <button
          onClick={async () => {
            await navigator.clipboard.writeText(project.code_snippet);
            setCopied(true);
            setTimeout(() => setCopied(false), 1200);
          }}
          className="inline-flex items-center gap-2 rounded-xl border border-yellow-400/40 bg-zinc-900 px-3 py-1.5 text-sm text-zinc-100"
        >
          {copied ? (
            <Check className="h-4 w-4 text-emerald-400" />
          ) : (
            <Copy className="h-4 w-4 text-yellow-300" />
          )}
          {copied ? "Copié !" : "Copier le code"}
        </button>
      </div>
    </main>
  );
}
