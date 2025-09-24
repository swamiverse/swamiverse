"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Dice6, Ticket, Play, Disc, Flag } from "lucide-react";

export default function CasinoHubPage() {
  return (
    <section className="mx-auto max-w-5xl py-12">
      <motion.h1
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-4xl font-bold text-center"
      >
        SwamiCasino 🎰
      </motion.h1>
      <p className="mt-4 text-center text-zinc-600 dark:text-zinc-300">
        Choisis ton jeu de pixels fictifs :
      </p>

      <div className="mt-10 grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        <GameCard
          href="/casino/slots"
          title="Machine à sous"
          icon={<Play className="h-6 w-6 text-yellow-500" />}
        />
        <GameCard
          href="/casino/scratch"
          title="Carte à gratter"
          icon={<Ticket className="h-6 w-6 text-yellow-500" />}
        />
        <GameCard
          href="/casino/big-scratch"
          title="Méga carte"
          icon={<Dice6 className="h-6 w-6 text-yellow-500" />}
        />
        <GameCard
          href="/casino/roulette"
          title="Roulette"
          icon={<Disc className="h-6 w-6 text-yellow-500" />}
        />
        <GameCard
          href="/casino/barillet"
          title="Barillet"
          icon={<Disc className="h-6 w-6 text-yellow-500" />}
        />
        <GameCard
          href="/casino/pixelpop"
          title="PixelPop"
          icon={<Disc className="h-6 w-6 text-yellow-500" />}
        />
        <GameCard
          href="/casino/pixeldice"
          title="PixelDice"
          icon={<Dice6 className="h-6 w-6 text-yellow-500" />}
        />
        <GameCard
          href="/casino/pixelrace"
          title="PixelRace"
          icon={<Flag className="h-6 w-6 text-yellow-500" />}
        />
        <GameCard
          href="/casino/pixelmine"
          title="Pixelmine"
          icon={<Flag className="h-6 w-6 text-yellow-500" />}
        />
        <GameCard
          href="/casino/pixeltower"
          title="Pixeltower"
          icon={<Flag className="h-6 w-6 text-yellow-500" />}
        />
        <GameCard
          href="/casino/blackjackpixel"
          title="Blackjackpixel"
          icon={<Flag className="h-6 w-6 text-yellow-500" />}
        />
      </div>
    </section>
  );
}

function GameCard({
  href,
  title,
  icon,
}: {
  href: string;
  title: string;
  icon: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      className="group rounded-2xl border border-zinc-200 bg-white p-6 shadow-md transition hover:shadow-xl dark:border-zinc-800 dark:bg-zinc-900"
    >
      <div className="mb-3">{icon}</div>
      <h2 className="text-lg font-semibold group-hover:text-yellow-500">
        {title}
      </h2>
    </Link>
  );
}
