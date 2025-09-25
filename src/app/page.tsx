"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { useState, useRef } from "react";
import { ArrowRight, Rss, Dice6, Wrench, X } from "lucide-react";
import React from "react";

export default function HomePage() {
  const [openModal, setOpenModal] = useState<string | null>(null);

  const lastUpdated = new Date().toLocaleString("fr-FR", {
    dateStyle: "medium",
    timeStyle: "short",
  });

  return (
    <>
      {/* Badge DB */}
      <div className="mt-6 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, y: -6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="inline-flex items-center gap-2 rounded-full border border-zinc-800 bg-zinc-900/50 px-3 py-1 text-xs text-zinc-300 shadow-inner ring-1 ring-white/5"
        >
          <span role="img" aria-label="disquette">
            💾
          </span>
          <span>
            Page générée depuis <strong>SwamiVerse DB</strong> — MAJ :{" "}
            {lastUpdated}
          </span>
        </motion.div>
      </div>

      {/* Hero */}
      <section className="relative mt-10 grid gap-6 lg:mt-14 lg:grid-cols-12">
        <div className="lg:col-span-7">
          <motion.h1
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-4xl font-bold leading-tight tracking-tight sm:text-5xl"
          >
            Salut, je suis Swami.{" "}
            <span className="text-yellow-400">
              Je fabrique des mondes jouables.
            </span>
          </motion.h1>

          <p className="mt-4 max-w-2xl text-lg text-zinc-300">
            SwamiVerse est mon portfolio expérimental. Chaque page est alimentée
            par une base de contenus. J’y montre mon côté créatif, mon design,
            mon frontend et un peu de backend — avec humour.
          </p>

          <div className="mt-6 flex flex-wrap items-center gap-3">
            <a
              href="#portes"
              className="group inline-flex items-center gap-2 px-4 py-2 font-medium rounded-xl bg-yellow-400 text-black shadow-md transition hover:bg-yellow-300"
            >
              Entrer dans le SwamiVerse
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
            </a>

            <Link
              href="/blog"
              className="inline-flex items-center gap-2 rounded-xl border border-zinc-800 bg-zinc-900 px-4 py-2 text-zinc-200 hover:bg-zinc-800 transition"
            >
              <Rss className="h-4 w-4" />
              SwamiBlog
            </Link>

            <Link
              href="/casino"
              className="inline-flex items-center gap-2 rounded-xl border border-zinc-800 bg-zinc-900 px-4 py-2 text-zinc-200 hover:bg-zinc-800 transition"
            >
              <Dice6 className="h-4 w-4" />
              SwamiCasino
            </Link>
          </div>

          <div className="mt-4 text-sm text-zinc-400">
            v1 focus : Home + Blog + Garage ·{" "}
            <span className="uppercase tracking-wide text-zinc-200">WIP</span>
          </div>
        </div>

        {/* Aside droite */}
        <motion.aside
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.05 }}
          className="lg:col-span-5"
        >
          <div className="relative overflow-hidden rounded-3xl border border-zinc-800 bg-gradient-to-b from-zinc-900 to-black p-5 shadow-xl ring-1 ring-white/10">
            <div className="pointer-events-none absolute -right-10 -top-10 h-40 w-40 rounded-full bg-yellow-300/10 blur-3xl" />
            <div className="flex items-start gap-3">
              <Wrench className="mt-0.5 h-5 w-5 text-yellow-300" />
              <div>
                <div className="text-sm font-semibold text-yellow-300">
                  Promo laboratoire
                </div>
                <p className="mt-1 text-sm text-zinc-200">
                  1 bug acheté = 2 offerts. Pixel premium : brille mieux la
                  nuit.
                </p>
              </div>
            </div>
            <Link
              href="/blog"
              className="mt-4 inline-block rounded-xl bg-zinc-800/80 px-3 py-1.5 text-sm text-zinc-200 ring-1 ring-white/10 transition hover:bg-zinc-800"
            >
              Voir la zone expérimentale
            </Link>
          </div>
        </motion.aside>
      </section>

      {/* Hubs */}
      <section
        id="portes"
        className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
      >
        <HubCard
          title="Le Studio"
          description="Création artistique : Bibliothèque, Flix, Beats"
          image="/images/home/studio.webp"
          onClick={() => setOpenModal("studio")}
        />
        <HubCard
          title="Le Labo"
          description="Expérimentation : Garage, Lab, Prototypes"
          image="/images/home/labo.webp"
          onClick={() => setOpenModal("labo")}
        />
        <HubCard
          title="L’Arcade"
          description="Jeux & amusement : Casino, Donjon, Aventure"
          image="/images/home/arcade.webp"
          onClick={() => setOpenModal("arcade")}
        />
      </section>

      {/* Modal */}
      {openModal && (
        <Modal onClose={() => setOpenModal(null)}>
          {openModal === "studio" && (
            <>
              <h2 className="text-xl font-bold mb-2">🎬 Le Studio</h2>
              <p className="mb-4 text-zinc-400">Création artistique</p>
              <div className="flex flex-col gap-2">
                <Link href="/bibliotheque" className="btn-modal">
                  📚 Bibliothèque
                </Link>
                <Link href="/flix" className="btn-modal">
                  🎬 Flix
                </Link>
                <Link href="/beats" className="btn-modal">
                  🎵 Beats
                </Link>
              </div>
            </>
          )}

          {openModal === "labo" && (
            <>
              <h2 className="text-xl font-bold mb-2">🧪 Le Labo</h2>
              <p className="mb-4 text-zinc-400">Expérimentation</p>
              <div className="flex flex-col gap-2">
                <Link href="/garage" className="btn-modal">
                  🛠 Garage
                </Link>
                <Link href="/lab" className="btn-modal">
                  🧪 Lab
                </Link>
              </div>
            </>
          )}

          {openModal === "arcade" && (
            <>
              <h2 className="text-xl font-bold mb-4">🕹 L’Arcade</h2>
              <p className="mb-6 text-zinc-400">Jeux & amusement</p>

              <div className="grid gap-6">
                {/* Carte Casino */}
                <div className="rounded-2xl overflow-hidden border border-zinc-700 bg-zinc-800/50 shadow-md">
                  <img
                    src="/images/home/casino.webp"
                    alt="Casino"
                    className="h-40 w-full object-cover"
                  />
                  <div className="p-4">
                    <Link
                      href="/casino"
                      className="block w-full rounded-xl border border-zinc-700 bg-zinc-900/80 px-4 py-3 text-center text-zinc-100 shadow-md transition hover:bg-yellow-400 hover:text-black"
                    >
                      🎰 Casino
                    </Link>
                  </div>
                </div>

                {/* Carte Aventure */}
                <div className="rounded-2xl overflow-hidden border border-zinc-700 bg-zinc-800/50 shadow-md">
                  <img
                    src="/images/home/aventure.webp"
                    alt="Aventure"
                    className="h-40 w-full object-cover"
                  />
                  <div className="p-4">
                    <Link
                      href="/aventure"
                      className="block w-full rounded-xl border border-zinc-700 bg-zinc-900/80 px-4 py-3 text-center text-zinc-100 shadow-md transition hover:bg-yellow-400 hover:text-black"
                    >
                      🗺 Aventure
                    </Link>
                  </div>
                </div>
              </div>
            </>
          )}
        </Modal>
      )}
    </>
  );
}

/* HubCard corrigée */
function HubCard({
  title,
  description,
  image,
  onClick,
}: {
  title: string;
  description: string;
  image: string;
  onClick: () => void;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4 }}
      className="relative overflow-hidden rounded-2xl shadow-lg group h-64 flex flex-col justify-end"
    >
      <img
        src={image}
        alt={title}
        className="absolute inset-0 h-full w-full object-cover"
      />
      <div className="absolute inset-0 bg-black/50" />

      {/* Bouton séparé avec marge */}
      <div className="relative z-10 p-4">
        <button
          onClick={onClick}
          className="w-full rounded-xl border border-zinc-700 bg-zinc-900/80 px-4 py-3 text-left text-zinc-100 shadow-md backdrop-blur-sm transition hover:bg-yellow-400 hover:text-black"
        >
          <h3 className="text-base font-bold leading-tight">{title}</h3>
          <p className="text-sm opacity-90">{description}</p>
        </button>
      </div>
    </motion.div>
  );
}

/* Modal générique corrigé → clic extérieur ferme */
function Modal({
  children,
  onClose,
}: {
  children: React.ReactNode;
  onClose: () => void;
}) {
  const overlayRef = useRef<HTMLDivElement>(null);

  const handleClickOutside = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === overlayRef.current) {
      onClose();
    }
  };

  return (
    <div
      ref={overlayRef}
      onClick={handleClickOutside}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4"
    >
      <div className="relative bg-zinc-900 border border-zinc-700 rounded-xl p-6 shadow-xl w-full max-w-lg">
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-zinc-400 hover:text-white"
        >
          <X className="h-5 w-5" />
        </button>
        {children}
      </div>
    </div>
  );
}
