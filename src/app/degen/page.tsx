"use client";

import React, { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  Filter,
  Flame,
  Sparkles,
  ExternalLink,
  Eye,
  BadgeCheck,
  Info,
  Image as ImageIcon,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Toggle } from "@/components/ui/toggle";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

/**
 * SWAMIVERSE — LE DEGEN COIN MUSÉE (/degen)
 *
 * Page musée pour exposer tes travaux de memecoins & crypto design.
 * React + Tailwind + framer-motion + shadcn/ui + lucide-react
 */

// ————————————————————————————
// 1) Data model
// ————————————————————————————
export type DegenCoin = {
  id: string;
  title: string;
  slug: string;
  tagline: string;
  description?: string;
  logo: string;
  status: "dead" | "moon" | "rug" | "wip";
  year?: number;
  link?: string;
  gallery?: string[];
  tags?: string[];
};

// ————————————————————————————
// 2) Mock data
// ————————————————————————————
const MOCK_DEGENS: DegenCoin[] = [
  {
    id: "duckdao",
    title: "DuckDAO",
    slug: "duckdao",
    tagline: "Quand un canard découvre la DeFi.",
    description:
      "Exploration parodique d'un DAO où ça cancane plus vite que la TVL.",
    logo: "/images/degen/duckdao.png",
    status: "moon",
    year: 2021,
    link: "https://example.com/duckdao",
    gallery: ["/images/degen/duckdao-1.png", "/images/degen/duckdao-2.png"],
    tags: ["meme", "dao", "defi"],
  },
  {
    id: "bugtoken",
    title: "BUG Token",
    slug: "bug",
    tagline: "1 bug acheté = 2 offerts.",
    description: "Token utilitaire douteux, rendement en sueur garanti.",
    logo: "/images/degen/bugtoken.png",
    status: "rug",
    year: 2020,
    gallery: ["/images/degen/bugtoken-1.png"],
    tags: ["humour", "utilitaire"],
  },
  {
    id: "swami-420",
    title: "SWAMI 420",
    slug: "swami-420",
    tagline: "↑ 420% de style, 0% de sens.",
    description: "Expérience graphique avec tickers absurdes.",
    logo: "/images/degen/swami420.png",
    status: "wip",
    year: 2024,
    link: "https://example.com/swami420",
    tags: ["ticker", "art"],
  },
  {
    id: "pixel-premium",
    title: "Pixel Premium",
    slug: "pixel-premium",
    tagline: "Brille mieux la nuit.",
    description: "Un coin pour financer des pixels qui brillent inutilement.",
    logo: "/images/degen/pixel-premium.png",
    status: "dead",
    year: 2019,
    tags: ["retro", "design"],
  },
];

// ————————————————————————————
// 3) Status map
// ————————————————————————————
const statusMap: Record<
  DegenCoin["status"],
  { label: string; chip: string; glow: string }
> = {
  moon: {
    label: "MOON",
    chip: "bg-emerald-500/15 text-emerald-300",
    glow: "shadow-[0_0_25px] shadow-emerald-600/40",
  },
  rug: {
    label: "RUG",
    chip: "bg-red-500/15 text-red-300",
    glow: "shadow-[0_0_25px] shadow-red-600/40",
  },
  dead: {
    label: "DEAD",
    chip: "bg-zinc-500/15 text-zinc-300",
    glow: "shadow-[0_0_25px] shadow-zinc-600/40",
  },
  wip: {
    label: "WIP",
    chip: "bg-yellow-500/15 text-yellow-300",
    glow: "shadow-[0_0_25px] shadow-yellow-600/40",
  },
};

// ————————————————————————————
// 4) Ticker
// ————————————————————————————
function Ticker() {
  const tape =
    "$SWAMI ↑ 420% • $BUG ↓ -99% • $MEME ↗ 1337% • $PIXEL ↘ 69% • $DAO ~ YOLO%";
  return (
    <div className="relative w-full overflow-hidden border-y border-violet-700/40 bg-violet-900/20">
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-violet-950 via-transparent to-violet-950" />
      <div className="animate-[ticker_20s_linear_infinite] whitespace-nowrap py-2 text-sm tracking-wide text-violet-200">
        {Array.from({ length: 4 }).map((_, i) => (
          <span key={i} className="mx-8 inline-flex items-center gap-2">
            <Sparkles className="h-4 w-4 opacity-70" /> {tape}
          </span>
        ))}
      </div>
      <style>{`
        @keyframes ticker { from { transform: translateX(0); } to { transform: translateX(-50%); } }
      `}</style>
    </div>
  );
}

// ————————————————————————————
// 5) Badge
// ————————————————————————————
function StatusBadge({ status }: { status: DegenCoin["status"] }) {
  const s = statusMap[status];
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full px-2 py-1 text-xs ${s.chip} ring-1 ring-white/10`}
    >
      <BadgeCheck className="h-3.5 w-3.5" /> {s.label}
    </span>
  );
}

// ————————————————————————————
// 6) Carte
// ————————————————————————————
function DegenCard({
  coin,
  onOpen,
}: {
  coin: DegenCoin;
  onOpen: (c: DegenCoin) => void;
}) {
  const s = statusMap[coin.status];
  return (
    <motion.div
      whileHover={{ y: -4, rotate: 0.2 }}
      transition={{ type: "spring", stiffness: 260, damping: 20 }}
    >
      <Card
        className={`group relative overflow-hidden rounded-2xl border-violet-700/30 bg-gradient-to-b from-zinc-900 to-zinc-950 ${s.glow}`}
      >
        <CardHeader className="flex flex-row items-center justify-between gap-3 p-4">
          <div className="flex items-center gap-3">
            <div className="grid h-12 w-12 place-items-center rounded-xl border border-violet-600/30 bg-black/60">
              <img
                src={coin.logo}
                alt={`${coin.title} logo`}
                className="h-8 w-8 object-contain"
                loading="lazy"
              />
            </div>
            <div>
              <CardTitle className="text-base text-violet-100">
                {coin.title}
              </CardTitle>
              <p className="text-xs text-violet-300/70">{coin.tagline}</p>
            </div>
          </div>
          <StatusBadge status={coin.status} />
        </CardHeader>
        <CardContent className="p-4 pt-0">
          <p className="line-clamp-3 text-sm text-zinc-300/90">
            {coin.description}
          </p>
          <div className="mt-3 flex items-center gap-2">
            {coin.tags?.slice(0, 3).map((t) => (
              <span
                key={t}
                className="rounded-md bg-violet-600/10 px-2 py-0.5 text-[10px] uppercase tracking-wider text-violet-300 ring-1 ring-violet-600/20"
              >
                {t}
              </span>
            ))}
          </div>
          <div className="mt-4 flex items-center gap-2">
            <Button
              size="sm"
              className="bg-violet-600 hover:bg-violet-500"
              onClick={() => onOpen(coin)}
            >
              <Eye className="mr-2 h-4 w-4" /> Voir
            </Button>
            {coin.link && (
              <Button
                size="sm"
                variant="outline"
                className="border-violet-700/40 text-violet-200 hover:bg-violet-900/30"
                asChild
              >
                <a href={coin.link} target="_blank" rel="noreferrer">
                  <ExternalLink className="mr-2 h-4 w-4" /> Lien
                </a>
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

// ————————————————————————————
// 7) Dialog
// ————————————————————————————
function DegenDialog({
  coin,
  open,
  onOpenChange,
}: {
  coin: DegenCoin | null;
  open: boolean;
  onOpenChange: (v: boolean) => void;
}) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl border-violet-700/30 bg-zinc-950/95 text-violet-50">
        {coin && (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-5">
            <div className="md:col-span-2">
              <div className="grid aspect-square place-items-center rounded-2xl border border-violet-700/30 bg-black/60">
                <img
                  src={coin.logo}
                  alt={`${coin.title} cover`}
                  className="h-40 w-40 object-contain"
                />
              </div>
              <div className="mt-3 flex flex-wrap items-center gap-2">
                <StatusBadge status={coin.status} />
                {coin.year && (
                  <span className="text-xs text-violet-300/80">
                    {coin.year}
                  </span>
                )}
              </div>
            </div>
            <div className="md:col-span-3">
              <h3 className="text-xl font-semibold text-violet-100">
                {coin.title}
              </h3>
              <p className="text-sm text-violet-300/80">{coin.tagline}</p>
              <p className="mt-3 text-sm leading-relaxed text-zinc-200/90">
                {coin.description}
              </p>
              {coin.gallery && coin.gallery.length > 0 && (
                <div className="mt-5">
                  <h4 className="mb-2 flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-violet-300/80">
                    <ImageIcon className="h-4 w-4" /> Galerie
                  </h4>
                  <div className="grid grid-cols-3 gap-2">
                    {coin.gallery.map((src) => (
                      <img
                        key={src}
                        src={src}
                        alt="gallery"
                        className="aspect-square w-full rounded-lg object-cover ring-1 ring-violet-700/30"
                        loading="lazy"
                      />
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}

// ————————————————————————————
// 8) Filters
// ————————————————————————————
const STATUS_FILTERS: DegenCoin["status"][] = ["moon", "rug", "dead", "wip"];

function Filters({
  active,
  onToggle,
}: {
  active: DegenCoin["status"][];
  onToggle: (s: DegenCoin["status"]) => void;
}) {
  return (
    <div className="flex flex-wrap items-center gap-2">
      <TooltipProvider>
        {STATUS_FILTERS.map((s) => (
          <Tooltip key={s}>
            <TooltipTrigger asChild>
              <Toggle
                pressed={active.includes(s)}
                onPressedChange={() => onToggle(s)}
                className={`rounded-full border border-violet-700/40 px-3 text-xs ${
                  active.includes(s) ? "bg-violet-700/40" : "bg-zinc-950"
                }`}
              >
                <span className="mr-2 inline-flex">{statusMap[s].label}</span>
              </Toggle>
            </TooltipTrigger>
            <TooltipContent className="border-violet-700/40 bg-zinc-900 text-violet-50">
              Afficher/masquer les pièces "{statusMap[s].label}".
            </TooltipContent>
          </Tooltip>
        ))}
      </TooltipProvider>
    </div>
  );
}

// ————————————————————————————
// 9) Fake pub
// ————————————————————————————
function FakeAd() {
  return (
    <div className="relative overflow-hidden rounded-2xl border border-violet-700/30 bg-gradient-to-r from-violet-900/30 via-fuchsia-900/20 to-indigo-900/20 p-5">
      <div className="flex items-center justify-between gap-4 max-md:flex-col">
        <div className="max-w-xl">
          <p className="text-sm uppercase tracking-widest text-violet-300/80">
            Annonce non-contractuelle
          </p>
          <h4 className="mt-1 text-2xl font-semibold text-violet-100">
            ⚠️ Token garanti 200%… d'humour.
          </h4>
          <p className="mt-2 text-sm text-violet-200/90">
            Déposez vos attentes ici → repartez avec un GIF. Les rendements
            passés ne préjugent que de nos blagues futures.
          </p>
        </div>
        <Button className="bg-violet-600 hover:bg-violet-500">
          <Flame className="mr-2 h-4 w-4" /> Minter un sourire
        </Button>
      </div>
    </div>
  );
}

// ————————————————————————————
// 10) Page principale
// ————————————————————————————

export default function DegenMuseum() {
  const [query, setQuery] = useState("");
  const [active, setActive] = useState<DegenCoin["status"][]>([
    "moon",
    "rug",
    "dead",
    "wip",
  ]);
  const [open, setOpen] = useState(false);
  const [current, setCurrent] = useState<DegenCoin | null>(null);

  const data = useMemo(() => {
    return MOCK_DEGENS.filter((c) => active.includes(c.status)).filter((c) => {
      const q = query.trim().toLowerCase();
      if (!q) return true;
      return (
        c.title.toLowerCase().includes(q) ||
        c.tagline.toLowerCase().includes(q) ||
        c.tags?.some((t) => t.toLowerCase().includes(q))
      );
    });
  }, [query, active]);

  function toggleFilter(s: DegenCoin["status"]) {
    setActive((prev) =>
      prev.includes(s) ? prev.filter((x) => x !== s) : [...prev, s]
    );
  }

  function openCoin(c: DegenCoin) {
    setCurrent(c);
    setOpen(true);
  }

  const lastUpdate = new Intl.DateTimeFormat("fr-FR", {
    dateStyle: "long",
  }).format(new Date());

  return (
    <main className="min-h-screen bg-[#0b0612] text-violet-50">
      {/* HERO */}
      <section className="relative mx-auto max-w-7xl px-4 pb-8 pt-16">
        <div className="flex items-start justify-between gap-6 max-md:flex-col">
          <div>
            <h1 className="text-4xl font-extrabold md:text-6xl">
              Le Degen Coin Musée
            </h1>
            <p className="mt-3 max-w-2xl text-lg text-violet-200/90">
              Ici, on expose mes expériences{" "}
              <span className="font-semibold">memecoin & crypto design</span>.
              Des logos, des univers, des blagues. Bref, les deg(e)ns du chaos
              on-chain.
            </p>
            <div className="mt-4 inline-flex items-center gap-3 rounded-full border border-violet-700/40 bg-black/40 px-3 py-1 text-xs text-violet-300">
              <span>
                💾 Page générée depuis SwamiVerse DB — MAJ : {lastUpdate}
              </span>
              <Info className="h-3.5 w-3.5 opacity-70" />
            </div>
          </div>
          <div className="w-full max-w-md">
            <div className="rounded-2xl border border-violet-700/40 bg-black/50 p-3">
              <div className="flex items-center gap-2 rounded-xl border border-violet-700/40 bg-zinc-950 p-2">
                <Search className="h-4 w-4 text-violet-300" />
                <Input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Rechercher un coin, un tag, une vanne…"
                  className="border-0 bg-transparent text-violet-100 placeholder:text-violet-400/50 focus-visible:ring-0"
                />
                <div className="ml-auto inline-flex items-center gap-2 rounded-lg border border-violet-700/40 px-2 py-1 text-[10px] uppercase tracking-wider text-violet-300">
                  <Filter className="h-3.5 w-3.5" /> Filtres
                </div>
              </div>
              <div className="mt-3">
                <Filters active={active} onToggle={toggleFilter} />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* TICKER */}
      <Ticker />

      {/* GRID */}
      <section className="mx-auto max-w-7xl px-4 py-10">
        {data.length === 0 ? (
          <div className="grid place-items-center rounded-2xl border border-violet-700/30 bg-zinc-950 p-12 text-center">
            <p className="text-violet-200/80">
              Aucun résultat. Essaie un autre filtre, ou tape « moon », « rug »,
              « canard »…
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            <AnimatePresence>
              {data.map((coin) => (
                <motion.div
                  key={coin.id}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                >
                  <DegenCard coin={coin} onOpen={openCoin} />
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}

        {/* Fausse pub */}
        <div className="mt-10">
          <FakeAd />
        </div>
      </section>

      {/* DIALOG */}
      <DegenDialog coin={current} open={open} onOpenChange={setOpen} />

      {/* FOOTER */}
      <footer className="mx-auto max-w-7xl px-4 pb-16 pt-6 text-sm text-violet-300/80">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <p>
            © {new Date().getFullYear()} Swami — Le Degen Coin Musée.
            <span className="ml-1">
              Pixel premium garanti : brille mieux la nuit ✨
            </span>
          </p>
          <div className="inline-flex items-center gap-2">
            <Sparkles className="h-4 w-4" />
            <span>
              Theme: violet-néon × noir, accessibilité: contrastes + focus
              visibles.
            </span>
          </div>
        </div>
      </footer>

      {/* Accessibilité */}
      <style>{`
        :root { color-scheme: dark; }
        *:focus-visible { outline: 2px dashed rgba(196,181,253,.8); outline-offset: 2px; }
      `}</style>
    </main>
  );
}
