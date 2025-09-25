import React from "react";

// --- Tous les previews React ---
export const PreviewButtons = () => (
  <div className="flex flex-wrap gap-3">
    <button className="rounded-xl bg-yellow-300 px-4 py-2 font-semibold text-black">
      Primaire
    </button>
    <button className="rounded-xl border border-zinc-800 bg-zinc-900/70 px-4 py-2 text-zinc-200">
      Ghost
    </button>
    <button className="rounded-xl border border-yellow-400/40 px-4 py-2 text-yellow-300">
      Outline
    </button>
    <button className="rounded-xl bg-gradient-to-br from-zinc-800 to-zinc-900 px-4 py-2 text-zinc-200">
      Subtil
    </button>
  </div>
);

export const PreviewSkeleton = () => (
  <div className="max-w-sm rounded-2xl border border-zinc-800 p-4 bg-zinc-950">
    <div className="h-36 w-full animate-pulse rounded-xl bg-zinc-800/60" />
    <div className="mt-4 space-y-2">
      <div className="h-4 w-2/3 animate-pulse rounded bg-zinc-800/60" />
      <div className="h-3 w-full animate-pulse rounded bg-zinc-800/60" />
      <div className="h-3 w-5/6 animate-pulse rounded bg-zinc-800/60" />
    </div>
  </div>
);

export const PreviewStats = () => (
  <div className="max-w-sm p-4 rounded-2xl border border-zinc-800 bg-zinc-950">
    <div className="flex justify-between text-sm">
      <span>Progression</span>
      <span className="text-yellow-300">72%</span>
    </div>
    <div className="mt-2 h-3 w-full rounded-full bg-zinc-800">
      <div className="h-full w-[72%] rounded-full bg-gradient-to-r from-yellow-300 to-amber-400" />
    </div>
  </div>
);

export const PreviewModal = () => (
  <div className="relative max-w-sm rounded-2xl border border-zinc-800 bg-zinc-950 p-4">
    <div className="mb-2 font-semibold text-zinc-100">Titre de la modal</div>
    <p className="text-zinc-300">Petit contenu de démonstration.</p>
    <div className="mt-3 flex gap-2">
      <button className="rounded-lg bg-yellow-300 px-3 py-1.5 text-black">
        Valider
      </button>
      <button className="rounded-lg border border-zinc-700 px-3 py-1.5 text-zinc-200">
        Annuler
      </button>
    </div>
  </div>
);

export const PreviewToast = () => (
  <div className="fixed right-4 top-4 rounded-xl border border-emerald-400/30 bg-emerald-500/15 px-3 py-2 text-sm text-emerald-300 shadow">
    ✅ Sauvegardé !{" "}
    <span className="text-emerald-200/80">Tout est à jour.</span>
  </div>
);

export const PreviewTabs = () => (
  <div className="max-w-sm rounded-2xl border border-zinc-800 bg-zinc-950 p-4">
    <div className="flex gap-2">
      <button className="rounded-lg bg-zinc-800 px-3 py-1.5 text-sm text-white">
        Onglet A
      </button>
      <button className="rounded-lg px-3 py-1.5 text-sm text-zinc-300 hover:bg-zinc-900">
        Onglet B
      </button>
    </div>
    <div className="mt-3 rounded-xl border border-zinc-800 bg-zinc-900 p-3 text-sm text-zinc-200">
      Contenu onglet A
    </div>
  </div>
);

export const PreviewPricing = () => (
  <div className="max-w-sm rounded-2xl border border-zinc-800 bg-gradient-to-b from-zinc-900 to-black p-4">
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

export const PreviewAvatarStack = () => (
  <div className="flex items-center">
    <div className="flex -space-x-2">
      <div className="h-8 w-8 rounded-full border border-zinc-900 bg-gradient-to-br from-fuchsia-400 to-pink-500" />
      <div className="h-8 w-8 rounded-full border border-zinc-900 bg-gradient-to-br from-sky-400 to-blue-500" />
      <div className="h-8 w-8 rounded-full border border-zinc-900 bg-gradient-to-br from-emerald-400 to-teal-500" />
      <div className="h-8 w-8 rounded-full border border-zinc-900 bg-gradient-to-br from-amber-300 to-orange-400" />
    </div>
    <span className="ml-3 text-sm text-zinc-300">+ 12 contributeurs</span>
  </div>
);

export const PreviewBreadcrumbs = () => (
  <nav aria-label="breadcrumbs" className="text-sm">
    <ol className="flex gap-1 text-zinc-400">
      <li>
        <a href="#" className="hover:text-white">
          Accueil
        </a>
      </li>
      <li>›</li>
      <li>
        <a href="#" className="hover:text-white">
          Projets
        </a>
      </li>
      <li>›</li>
      <li className="text-zinc-200">SwamiVerse</li>
    </ol>
  </nav>
);

// --- Mapping slug → composant React
export const previewComponents: Record<string, React.FC> = {
  "btn-kit": PreviewButtons,
  "card-skeleton": PreviewSkeleton,
  "stats-bar": PreviewStats,
  "modal-basic": PreviewModal,
  "toast-notif": PreviewToast,
  "tabs-minimal": PreviewTabs,
  "pricing-card": PreviewPricing,
  "avatar-stack": PreviewAvatarStack,
  "breadcrumbs-basic": PreviewBreadcrumbs,
};
