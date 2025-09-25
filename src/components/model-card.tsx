"use client";
import { useState } from "react";
import { Copy, Check, ArrowRight } from "lucide-react";
import { previewComponents } from "@/components/previews";

export default function ModelCard({
  project,
  index,
}: {
  project: any;
  index: number;
}) {
  const [copied, setCopied] = useState(false);
  const [showCode, setShowCode] = useState(false);

  const Preview = previewComponents[project.slug];

  const onCopy = async () => {
    await navigator.clipboard.writeText(project.code_snippet || "");
    setCopied(true);
    setTimeout(() => setCopied(false), 1200);
  };

  return (
    <article className="group relative rounded-3xl border border-zinc-800 bg-gradient-to-b from-zinc-900 to-black p-5 shadow-xl ring-1 ring-white/5">
      <h3 className="text-lg font-semibold text-white">{project.title}</h3>
      <p className="mt-1 text-sm text-zinc-300">{project.description}</p>

      <div className="mt-4">
        {Preview ? (
          <Preview />
        ) : (
          <div dangerouslySetInnerHTML={{ __html: project.preview || "" }} />
        )}
      </div>

      <div className="mt-4 flex flex-wrap gap-2 text-xs text-zinc-400">
        {project.tags?.map((t: string) => (
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
          className="inline-flex items-center gap-2 rounded-xl border border-yellow-400/40 bg-zinc-900 px-3 py-1.5 text-sm text-zinc-100"
        >
          {copied ? (
            <Check className="h-4 w-4 text-emerald-400" />
          ) : (
            <Copy className="h-4 w-4 text-yellow-300" />
          )}
          {copied ? "Copié !" : "Copier le code"}
        </button>
        <button
          onClick={() => setShowCode(!showCode)}
          className="inline-flex items-center gap-2 rounded-xl border border-zinc-800 bg-zinc-900 px-3 py-1.5 text-sm text-zinc-100"
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
        <pre className="mt-3 max-h-64 overflow-auto rounded-xl border border-zinc-800 bg-zinc-950 p-3 text-xs text-zinc-200">
          {project.code_snippet}
        </pre>
      )}
    </article>
  );
}
