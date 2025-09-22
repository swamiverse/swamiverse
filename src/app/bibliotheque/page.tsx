"use client";

import { motion, AnimatePresence } from "framer-motion";
import {
  BookOpen,
  Eye,
  X,
  ShoppingCart,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import React, { useEffect, useState, useRef } from "react";
import { usePixels } from "@/components/pixels-provider";

// ---------------------------------------------
// Types
// ---------------------------------------------
type Cover = {
  id: number;
  title: string;
  category: string;
  image: string;
  synopsis: string;
  summary: string;
  pages: string[];
  price: string;
  bonus: number;
};

type FX = { id: string; x: number; y: number; text: string };

// ---------------------------------------------
// Page
// ---------------------------------------------
export default function BibliothequePage() {
  const [covers, setCovers] = useState<Cover[]>([]);
  const [preview, setPreview] = useState<Cover | null>(null);
  const [claimedMap, setClaimedMap] = useState<Record<number, boolean>>({});
  const [fx, setFx] = useState<FX[]>([]);
  const { addPixels } = usePixels();
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const [indexMap, setIndexMap] = useState<Record<string, number>>({});

  useEffect(() => {
    audioRef.current = new Audio(
      "data:audio/wav;base64,UklGRiQAAABXQVZFZm10IBAAAAABAAEAESsAACJWAAACABYAAAACAAABAAgAZGF0YQAAAAA="
    );

    try {
      const raw = localStorage.getItem("pxBonusClaimedMap");
      if (raw) setClaimedMap(JSON.parse(raw));
    } catch {}

    setCovers([
      // ----------- Manga -----------
      {
        id: 1,
        title: "Le Dernier Pixel",
        category: "Manga",
        image: "/images/covers/pixel.webp",
        synopsis:
          "Un hacker découvre que son monde est en fait une démo jouable.",
        summary:
          "Dans un futur cyberpunk où la frontière entre le réel et le virtuel s’efface, un jeune hacker réalise que son existence entière n’est qu’un programme en test. Sa quête le mènera à affronter les architectes de la simulation.",
        pages: ["/images/pages/pixel-1.webp"],
        price: "12,90 €",
        bonus: 100,
      },
      {
        id: 2,
        title: "Samurai Code",
        category: "Manga",
        image: "/images/covers/samurai.webp",
        synopsis: "Un samouraï errant lutte entre honneur et destin.",
        summary:
          "Dans un Japon médiéval ravagé par les guerres de clans, un samouraï sans maître marche entre combats sanglants et quêtes spirituelles. Son serment oublié refait surface et l’entraîne vers un destin plus lourd que la vie elle-même.",
        pages: ["/images/pages/samurai-1.webp"],
        price: "10,90 €",
        bonus: 50,
      },
      {
        id: 3,
        title: "Neo Kyoto",
        category: "Manga",
        image: "/images/covers/kyoto.webp",
        synopsis: "Une archiviste découvre un rituel ancien à Kyoto.",
        summary:
          "Kyoto, 2088. Ses temples millénaires gardent un secret que les mégacorporations convoitent. Yuki, archiviste rebelle, devient la clé d’un rituel oublié qui pourrait réveiller des divinités anciennes.",
        pages: ["/images/pages/kyoto-1.webp"],
        price: "11,50 €",
        bonus: 70,
      },
      {
        id: 4,
        title: "Mecha Dreams",
        category: "Manga",
        image: "/images/covers/mecha.webp",
        synopsis: "Une pilote rêve dans les entrailles de son robot géant.",
        summary:
          "Kaori pilote un mecha gigantesque contre des créatures d’ailleurs. Mais ses rêves l’entraînent dans des paysages oniriques où ses souvenirs se mêlent à ceux de la machine.",
        pages: ["/images/pages/mecha-1.webp"],
        price: "13,20 €",
        bonus: 80,
      },

      // ----------- Comics -----------
      {
        id: 5,
        title: "Dark Neon",
        category: "Comics",
        image: "/images/covers/darkneon.webp",
        synopsis: "Un héros déchu éclaire la ville avec ses néons.",
        summary:
          "Dans la ville de Glasshaven, engloutie dans une nuit permanente, Marcus Kane doit rallumer ses flammes et affronter ses fantômes.",
        pages: ["/images/pages/neon-1.webp"],
        price: "14,50 €",
        bonus: 90,
      },
      {
        id: 6,
        title: "Steel Guardian",
        category: "Comics",
        image: "/images/covers/guardian.webp",
        synopsis: "Un protecteur d’acier se réveille dans une ville hostile.",
        summary:
          "Un colosse d’acier, forgé pendant une guerre oubliée, s’éveille des siècles plus tard. Les habitants le craignent autant qu’ils l’adorent.",
        pages: ["/images/pages/guardian-1.webp"],
        price: "12,40 €",
        bonus: 60,
      },
      {
        id: 7,
        title: "Cosmic Rift",
        category: "Comics",
        image: "/images/covers/cosmic.webp",
        synopsis: "Une brèche spatiale libère des entités inconnues.",
        summary:
          "Une faille s’ouvre dans l’univers, des entités inimaginables envahissent la réalité. Un groupe de héros doit contenir le chaos cosmique.",
        pages: ["/images/pages/cosmic-1.webp"],
        price: "16,90 €",
        bonus: 120,
      },
      {
        id: 8,
        title: "Shadow Pulse",
        category: "Comics",
        image: "/images/covers/shadow.webp",
        synopsis: "Un justicier manipule les ombres comme une arme.",
        summary:
          "Dans les bas-fonds de Nova City, un homme manipule les ténèbres. Protecteur ou menace ? Sa justice est faite de noir absolu.",
        pages: ["/images/pages/shadow-1.webp"],
        price: "13,70 €",
        bonus: 75,
      },

      // ----------- BD Historique -----------
      {
        id: 9,
        title: "Les Flammes de Carthage",
        category: "BD Historique",
        image: "/images/covers/carthage.jpg",
        synopsis: "La chute d’une cité qui défia Rome.",
        summary:
          "À travers les yeux d’un jeune soldat, revivez la chute de Carthage face à Rome. Entre stratégie, trahisons et courage, l’Histoire s’écrit dans le feu.",
        pages: ["/images/pages/carthage-1.webp"],
        price: "15,50 €",
        bonus: 70,
      },
      {
        id: 10,
        title: "Le Dernier Croisé",
        category: "BD Historique",
        image: "/images/covers/croise.jpg",
        synopsis: "Un chevalier cherche la rédemption en Terre sainte.",
        summary:
          "Écartelé entre foi et doute, un croisé doit choisir entre ses serments et sa conscience. Une fresque entre batailles et quête spirituelle.",
        pages: ["/images/pages/croise-1.webp"],
        price: "17,20 €",
        bonus: 110,
      },
      {
        id: 11,
        title: "Napoléon: Les Cendres de l’Aigle",
        category: "BD Historique",
        image: "/images/covers/napoleon.jpg",
        synopsis: "Les derniers jours d’un empereur déchu.",
        summary:
          "Exilé à Sainte-Hélène, Napoléon raconte ses campagnes à un jeune soldat. Un récit entre gloire passée et regrets éternels.",
        pages: ["/images/pages/napoleon-1.webp"],
        price: "9,99 €",
        bonus: 50,
      },
      {
        id: 12,
        title: "Les Vikings",
        category: "BD Historique",
        image: "/images/covers/vikings.jpg",
        synopsis: "Une saga de conquêtes et de légendes nordiques.",
        summary:
          "De la Norvège glaciale aux côtes anglaises, suivez une famille viking entre pillages, alliances et dieux capricieux.",
        pages: ["/images/pages/vikings-1.webp"],
        price: "19,00 €",
        bonus: 150,
      },
    ]);
  }, []);

  const handleAddToCart = (
    e: React.MouseEvent<HTMLButtonElement>,
    cover: Cover
  ) => {
    if (claimedMap[cover.id]) return;

    addPixels(cover.bonus, `Panier ${cover.title}`);
    const newMap = { ...claimedMap, [cover.id]: true };
    setClaimedMap(newMap);
    localStorage.setItem("pxBonusClaimedMap", JSON.stringify(newMap));

    if (audioRef.current) {
      audioRef.current.currentTime = 0;
      audioRef.current.play().catch(() => {});
    }

    const rect = (e.target as HTMLElement).getBoundingClientRect();
    const fxId = crypto.randomUUID();
    setFx((arr) => [
      ...arr,
      {
        id: fxId,
        x: rect.left + rect.width / 2,
        y: rect.top,
        text: `+${cover.bonus} PX`,
      },
    ]);
    setTimeout(() => setFx((arr) => arr.filter((f) => f.id !== fxId)), 700);
  };

  const grouped = covers.reduce<Record<string, Cover[]>>((acc, c) => {
    acc[c.category] = acc[c.category] || [];
    acc[c.category].push(c);
    return acc;
  }, {});

  const scroll = (category: string, dir: "left" | "right") => {
    const max = (grouped[category]?.length || 0) - 3;
    setIndexMap((prev) => {
      const current = prev[category] || 0;
      let next = dir === "left" ? current - 1 : current + 1;
      if (next < 0) next = 0;
      if (next > max) next = max;
      return { ...prev, [category]: next };
    });
  };

  return (
    <>
      {/* Hero */}
      <section className="relative mt-10 grid gap-6 lg:mt-14 lg:grid-cols-12">
        <div className="lg:col-span-7">
          <motion.h1
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-4xl font-bold leading-tight tracking-tight sm:text-5xl"
          >
            Bibliothèque
          </motion.h1>
          <p
            className="mt-4 max-w-2xl text-lg"
            style={{ color: "var(--muted-foreground)" }}
          >
            Covers IA d’univers qui n’existent pas encore.
          </p>
        </div>
        <motion.aside
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.05 }}
          className="lg:col-span-5"
          aria-label="Annonce"
        >
          <div
            className="relative overflow-hidden p-5 shadow-xl ring-1 rounded-xl"
            style={{
              background: "var(--card)",
              border: "1px solid var(--border)",
            }}
          >
            <div className="flex items-start gap-3">
              <BookOpen
                className="mt-0.5 h-5 w-5"
                style={{ color: "var(--primary)" }}
              />
              <div>
                <div
                  className="text-sm font-semibold"
                  style={{ color: "var(--primary)" }}
                >
                  📚 Promo édition limitée
                </div>
                <p
                  className="mt-1 text-sm"
                  style={{ color: "var(--muted-foreground)" }}
                >
                  1 synopsis acheté = 2 couvertures offertes.
                </p>
              </div>
            </div>
          </div>
        </motion.aside>
      </section>

      {Object.entries(grouped).map(([category, items]) => {
        const index = indexMap[category] || 0;
        const visible = items.slice(index, index + 3);

        return (
          <section key={category} className="mt-8">
            <h2 className="text-2xl font-bold mb-4">{category}</h2>

            <div className="relative flex items-center">
              {/* Flèche gauche */}
              <button
                onClick={() => scroll(category, "left")}
                className="absolute -left-10 z-10 rounded-full bg-black/60 p-2 text-white hover:bg-black/80"
              >
                <ChevronLeft className="h-6 w-6" />
              </button>

              {/* 3 cartes fixes */}
              <div className="grid grid-cols-3 gap-6 w-full">
                {visible.map((cover) => (
                  <motion.article
                    key={cover.id}
                    className="group relative overflow-hidden rounded-3xl border p-5 shadow-xl"
                    style={{
                      borderColor: "var(--border)",
                      background: "var(--card)",
                      color: "var(--card-foreground)",
                    }}
                  >
                    <h3 className="text-lg font-semibold mb-2">
                      {cover.title}
                    </h3>
                    <div className="relative mb-3 overflow-hidden rounded-xl">
                      <img
                        src={cover.image}
                        alt={cover.title}
                        className="w-full h-64 object-cover"
                      />
                      <button
                        onClick={() => setPreview(cover)}
                        className="absolute bottom-2 right-2 inline-flex items-center gap-1 rounded-lg bg-black/60 px-2 py-1 text-xs text-white backdrop-blur-sm hover:bg-black/80"
                      >
                        <Eye className="h-3.5 w-3.5" /> Aperçu
                      </button>
                    </div>
                    <p className="mt-1 text-sm italic">{cover.synopsis}</p>
                  </motion.article>
                ))}
              </div>

              {/* Flèche droite */}
              <button
                onClick={() => scroll(category, "right")}
                className="absolute -right-10 z-10 rounded-full bg-black/60 p-2 text-white hover:bg-black/80"
              >
                <ChevronRight className="h-6 w-6" />
              </button>
            </div>
          </section>
        );
      })}

      {/* Modal Preview */}
      {preview && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4"
          onClick={() => setPreview(null)}
        >
          <div
            className="relative w-full max-w-2xl max-h-[85vh] overflow-y-auto rounded-2xl bg-[var(--card)] p-6 shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setPreview(null)}
              className="absolute right-3 top-3 rounded-full bg-black/40 p-2 text-white hover:bg-black/70"
            >
              <X className="h-4 w-4" />
            </button>
            <h3 className="mb-4 text-xl font-semibold">{preview.title}</h3>
            <div className="relative mb-6">
              <img
                src={preview.image}
                alt={preview.title}
                className="w-full rounded-xl object-cover"
              />
              <div className="absolute bottom-4 left-4 right-4 rounded-xl bg-black/70 p-4 text-sm text-white shadow-lg line-clamp-3">
                {preview.summary}
              </div>
            </div>
            <div className="mb-6 rounded-xl border p-4 shadow-sm text-sm">
              <p>
                <strong>Auteur :</strong> Swami Arnaud
              </p>
              <p>
                <strong>Dessinateur :</strong> Swami Arnaud
              </p>
              <p>
                <strong>Éditeur :</strong> SwamiVerse
              </p>
            </div>
            <div className="grid gap-3 mb-6">
              {preview.pages.map((p, i) => (
                <img
                  key={i}
                  src={p}
                  alt={`Page ${i + 1}`}
                  className="rounded-lg"
                />
              ))}
            </div>
            <div className="flex items-center justify-between border-t pt-4 relative">
              <button
                onClick={(e) => handleAddToCart(e, preview)}
                disabled={claimedMap[preview.id]}
                className="inline-flex items-center gap-2 rounded-lg px-4 py-2 font-medium transition disabled:opacity-50"
                style={{
                  background: "var(--primary)",
                  color: "var(--primary-foreground)",
                }}
              >
                <ShoppingCart className="h-4 w-4" />{" "}
                {claimedMap[preview.id] ? "Déjà ajouté" : "Ajouter au panier"}
              </button>
              <span className="text-sm font-semibold text-[var(--primary)]">
                +{preview.bonus} PX
              </span>
            </div>
          </div>
        </div>
      )}

      {/* FX Overlay */}
      <AnimatePresence>
        {fx.map((f) => (
          <motion.div
            key={f.id}
            initial={{ opacity: 0, y: 0, scale: 0.9 }}
            animate={{ opacity: 1, y: -24, scale: 1 }}
            exit={{ opacity: 0, y: -40, scale: 1.05 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="pointer-events-none fixed z-[9999] select-none text-xs font-bold"
            style={{ left: f.x, top: f.y, transform: "translate(-50%, -50%)" }}
          >
            <div
              className="rounded-full px-2 py-1 shadow-lg"
              style={{
                background: "#FFD21E",
                color: "#000",
                border: "2px solid #000",
              }}
            >
              {f.text}
            </div>
          </motion.div>
        ))}
      </AnimatePresence>
    </>
  );
}
