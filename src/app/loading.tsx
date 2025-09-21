"use client";

export default function GlobalLoading() {
  return (
    <div className="fixed inset-0 z-[60] grid place-items-center bg-black/80 backdrop-blur-sm">
      <div
        className="h-8 w-8 animate-[spin_1s_linear_infinite] rounded-full border-2 border-zinc-200 border-t-transparent"
        aria-hidden
      />
      <span className="sr-only">Chargement…</span>
    </div>
  );
}
