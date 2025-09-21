"use client";

export default function Loading() {
  return (
    <div className="fixed inset-0 z-[60] grid place-items-center bg-black">
      <div className="relative flex flex-col items-center">
        {/* === Film reel === */}
        <div className="relative h-16 w-16">
          {/* outer ring spin */}
          <div
            className="absolute inset-0 rounded-full border-2 border-yellow-300/80 border-t-transparent animate-[spin_1.2s_linear_infinite] motion-reduce:animate-none"
            aria-hidden
          />
          {/* inner ring */}
          <div
            className="absolute inset-[10px] rounded-full border border-yellow-300/40"
            aria-hidden
          />
          {/* reel holes spinning slowly */}
          <div
            className="absolute inset-0 animate-[spin_3s_linear_infinite] motion-reduce:animate-none"
            aria-hidden
          >
            <span className="absolute left-1/2 top-1 h-1.5 w-1.5 -translate-x-1/2 rounded-full bg-black shadow-[0_0_0_1px_rgba(253,224,71,0.6)]" />
            <span className="absolute right-1 top-1/2 h-1.5 w-1.5 -translate-y-1/2 rounded-full bg-black shadow-[0_0_0_1px_rgba(253,224,71,0.6)]" />
            <span className="absolute left-1/2 bottom-1 h-1.5 w-1.5 -translate-x-1/2 rounded-full bg-black shadow-[0_0_0_1px_rgba(253,224,71,0.6)]" />
            <span className="absolute left-1 top-1/2 h-1.5 w-1.5 -translate-y-1/2 rounded-full bg-black shadow-[0_0_0_1px_rgba(253,224,71,0.6)]" />
            <span className="absolute left-2 top-2 h-1.5 w-1.5 rounded-full bg-black shadow-[0_0_0_1px_rgba(253,224,71,0.6)]" />
            <span className="absolute right-2 bottom-2 h-1.5 w-1.5 rounded-full bg-black shadow-[0_0_0_1px_rgba(253,224,71,0.6)]" />
          </div>
          {/* soft halo */}
          <div className="pointer-events-none absolute -inset-4 rounded-2xl bg-yellow-300/10 blur-md" />
        </div>

        {/* === Ticket / logotype === */}
        <div className="relative mt-5 overflow-hidden rounded-xl border border-yellow-300/20 bg-zinc-950 px-4 py-2 shadow-[0_0_0_1px_rgba(253,224,71,0.08)_inset]">
          <span className="bg-gradient-to-r from-yellow-200 via-yellow-300 to-amber-400 bg-clip-text text-base font-semibold tracking-wide text-transparent">
            SwamiFlix
          </span>
          {/* diagonal sweep */}
          <div className="pointer-events-none absolute inset-0 [mask-image:linear-gradient(transparent,black,transparent)]">
            <div className="absolute -left-1/3 top-0 h-full w-1/3 bg-gradient-to-r from-transparent via-white/15 to-transparent animate-[sweep_1.6s_linear_infinite] motion-reduce:hidden" />
          </div>
          {/* perforated ticket edges */}
          <div className="absolute -left-2 top-1/2 h-6 w-6 -translate-y-1/2 rounded-full border border-yellow-300/20 bg-black" />
          <div className="absolute -right-2 top-1/2 h-6 w-6 -translate-y-1/2 rounded-full border border-yellow-300/20 bg-black" />
        </div>

        <p className="mt-3 text-xs text-zinc-400">Chargement SwamiFlix…</p>
        <span className="sr-only">Chargement en cours</span>
      </div>

      {/* keyframes locales pour l'effet de balayage */}
      <style jsx>{`
        @keyframes sweep {
          0% {
            transform: translateX(-100%);
          }
          100% {
            transform: translateX(300%);
          }
        }
      `}</style>
    </div>
  );
}

/*
🎛️ Personnalisation rapide
- Couleurs : change les classes "yellow-300/amber-400".
- Taille du reel : remplace h-16 w-16.
- Réduction des animations : respect de prefers-reduced-motion via classes motion-reduce:animate-none.
📌 À utiliser avec l'attente contrôlée dans src/app/flix/page.tsx (await sleep(2200)).
*/
