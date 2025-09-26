"use client";

export const previewComponents: Record<string, React.FC> = {
  demo: () => (
    <div
      className="rounded-xl border p-4 shadow"
      style={{
        background: "var(--card)",
        color: "var(--card-foreground)",
        borderColor: "var(--border)",
      }}
    >
      <p className="text-sm">
        Ceci est un aperçu de démo stylisé par tokens 🎨
      </p>
    </div>
  ),
};
