"use client";
import { useState } from "react";
import { Copy, Check, ArrowRight } from "lucide-react";
import { previewComponents } from "@/components/previews";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";

export default function ProjectCard({ project }: { project: any }) {
  const [copied, setCopied] = useState(false);
  const [showCode, setShowCode] = useState(false);

  const Preview = previewComponents[project.slug];

  const onCopy = async () => {
    await navigator.clipboard.writeText(project.code_snippet || "");
    setCopied(true);
    setTimeout(() => setCopied(false), 1200);
  };

  return (
    <Card glow="yellow" className="relative overflow-hidden">
      <CardHeader>
        <CardTitle>{project.title}</CardTitle>
        <CardDescription>{project.description}</CardDescription>
      </CardHeader>

      <CardContent>
        {Preview ? (
          <Preview />
        ) : (
          <div dangerouslySetInnerHTML={{ __html: project.preview || "" }} />
        )}
        <div className="mt-4 flex flex-wrap gap-2 text-xs text-muted-foreground">
          {project.tags?.map((t: string) => (
            <span key={t} className="rounded-full border px-2 py-0.5">
              {t}
            </span>
          ))}
        </div>

        <div className="mt-4 flex items-center gap-2">
          <button
            onClick={onCopy}
            className="inline-flex items-center gap-2 rounded-xl border px-3 py-1.5 text-sm"
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
            className="inline-flex items-center gap-2 rounded-xl border px-3 py-1.5 text-sm"
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
          <pre className="mt-3 max-h-64 overflow-auto rounded-xl border p-3 text-xs">
            {project.code_snippet}
          </pre>
        )}
      </CardContent>
    </Card>
  );
}
