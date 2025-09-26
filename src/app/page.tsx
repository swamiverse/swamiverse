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
          className="inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs shadow-inner"
          style={{
            borderColor: "var(--border)",
            background: "var(--muted)",
            color: "var(--muted-foreground)",
          }}
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
            style={{ color: "var(--foreground)" }}
          >
            Salut, je suis Swami.{" "}
            <span style={{ color: "var(--primary)" }}>
              Je fabrique des mondes jouables.
            </span>
          </motion.h1>

          <p
            className="mt-4 max-w-2xl text-lg"
            style={{ color: "var(--muted-foreground)" }}
          >
            SwamiVerse est mon portfolio expérimental. Chaque page est alimentée
            par une base de contenus. J’y montre mon côté créatif, mon design,
            mon frontend et un peu de backend — avec humour.
          </p>

          <div className="mt-6 flex flex-wrap items-center gap-3">
            {/* CTA principal */}
            <a
              href="#portes"
              className="group inline-flex items-center gap-2 rounded-xl px-4 py-2 font-medium shadow-md transition focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring)]"
              style={{
                background: "var(--primary)",
                color: "var(--primary-foreground)",
              }}
            >
              Entrer dans le SwamiVerse
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
            </a>

            {/* Blog */}
            <Link
              href="/blog"
              className="btn-secondary inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-medium transition focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring)]"
            >
              <Rss className="h-4 w-4" />
              SwamiBlog
            </Link>

            {/* Casino */}
            <Link
              href="/casino"
              className="btn-secondary inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-medium transition focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring)]"
            >
              <Dice6 className="h-4 w-4" />
              SwamiCasino
            </Link>
          </div>
        </div>

        {/* Aside droite */}
        <motion.aside
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.05 }}
          className="lg:col-span-5"
        >
          <div
            className="relative overflow-hidden rounded-3xl border p-5 shadow-xl"
            style={{
              background: "var(--card)",
              color: "var(--card-foreground)",
              borderColor: "var(--border)",
            }}
          >
            <div className="flex items-start gap-3">
              <Wrench
                className="mt-0.5 h-5 w-5"
                style={{ color: "var(--primary)" }}
              />
              <div>
                <div
                  className="text-sm font-semibold"
                  style={{ color: "var(--primary)" }}
                >
                  Promo laboratoire
                </div>
                <p
                  className="mt-1 text-sm"
                  style={{ color: "var(--muted-foreground)" }}
                >
                  1 bug acheté = 2 offerts. Pixel premium : brille mieux la
                  nuit.
                </p>
              </div>
            </div>
            <Link
              href="/blog"
              className="btn-secondary mt-4 inline-block rounded-xl px-3 py-1.5 text-sm font-medium transition focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring)]"
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
          {/* contenu modaux déjà tokenisé */}
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
      {/* masque léger */}
      <div className="absolute inset-0 bg-black/15" />

      <div className="relative z-10 p-4">
        <button
          onClick={onClick}
          className="btn-secondary w-full rounded-xl px-4 py-3 text-left shadow-md backdrop-blur-sm transition focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring)]"
        >
          <h3 className="text-base font-bold leading-tight">{title}</h3>
          <p className="text-sm opacity-90">{description}</p>
        </button>
      </div>
    </motion.div>
  );
}

/* Modal générique corrigé */
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
      <div
        className="relative w-full max-w-lg rounded-xl border p-6 shadow-xl"
        style={{
          background: "var(--background)",
          color: "var(--foreground)",
          borderColor: "var(--border)",
        }}
      >
        <button
          onClick={onClose}
          className="absolute top-2 right-2 rounded-md p-1 opacity-70 hover:opacity-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring)]"
          style={{ color: "var(--muted-foreground)" }}
        >
          <X className="h-5 w-5" />
        </button>
        {children}
      </div>
    </div>
  );
}
