"use client";

export function SiteFooter() {
  return (
    <footer className="mt-16 border-t border-zinc-900/60 bg-black text-zinc-400">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-4 py-6 text-sm sm:flex-row sm:px-6 lg:px-8">
        <div className="flex items-center gap-3">
          <span>© {new Date().getFullYear()} Swami</span>
          <span className="hidden sm:inline">•</span>
          <span className="rounded-md bg-zinc-900 px-2 py-0.5 text-xs text-zinc-300 ring-1 ring-white/10">
            Badge WIP
          </span>
        </div>
        <div className="flex items-center gap-3">
          <a
            href="https://github.com/"
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1 rounded-md px-2 py-1 hover:bg-zinc-900 focus:outline-none focus-visible:ring-4 focus-visible:ring-white/10"
          >
            GitHub
          </a>
          <a
            href="/rss.xml"
            className="inline-flex items-center gap-1 rounded-md px-2 py-1 hover:bg-zinc-900 focus:outline-none focus-visible:ring-4 focus-visible:ring-white/10"
          >
            RSS
          </a>
        </div>
      </div>
    </footer>
  );
}
