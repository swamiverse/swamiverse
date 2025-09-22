"use client";

import React, { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { Trophy, Mail } from "lucide-react";
import { usePixels } from "@/components/pixels-provider";

type User = {
  id: number;
  email: string;
  pixels: number;
};

export default function LeaderboardPage() {
  const { pixels } = usePixels(); // ton compteur local
  const [email, setEmail] = useState("");
  const [users, setUsers] = useState<User[]>([
    { id: 2, email: "alice@example.com", pixels: 800 },
    { id: 3, email: "bob@example.com", pixels: 500 },
  ]);

  // Ajout de l’utilisateur local
  const allUsers = useMemo(
    () =>
      [{ id: 1, email: "toi@swamiverse", pixels }, ...users].sort(
        (a, b) => b.pixels - a.pixels
      ),
    [users, pixels]
  );

  const lastUpdated = useMemo(
    () =>
      new Date().toLocaleString("fr-FR", {
        dateStyle: "medium",
        timeStyle: "short",
      }),
    []
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    const newUser = { id: Date.now(), email, pixels: 0 };
    setUsers((prev) => [...prev, newUser]);
    setEmail("");
    alert(`Bienvenue ${email} ! Tu es inscrit au leaderboard 🚀`);
  };

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
          💾 Page générée depuis <strong>SwamiVerse DB</strong> — MAJ :{" "}
          {lastUpdated}
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
            Leaderboard
          </motion.h1>
          <p className="mt-4 max-w-2xl text-lg text-zinc-300">
            Classement en direct des joueurs SwamiVerse. Plus tu as de pixels,
            plus tu montes 🚀
          </p>
        </div>
      </section>

      {/* Grid joueurs */}
      <section className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {allUsers.map((u, i) => (
          <motion.article
            key={u.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, delay: i * 0.05 }}
            className="group relative overflow-hidden rounded-3xl border border-zinc-800 bg-gradient-to-b from-zinc-900 to-black p-5 shadow-xl ring-1 ring-white/5"
          >
            <div className="flex items-center gap-3">
              <div className="rounded-2xl bg-black/20 p-3 ring-1 ring-white/10">
                <Trophy className="h-6 w-6 text-yellow-300" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-white">
                  {u.email.split("@")[0]}
                </h3>
                <p className="text-sm text-zinc-400">{u.email}</p>
              </div>
            </div>
            <div className="mt-4 text-2xl font-bold text-yellow-300">
              {u.pixels} px
            </div>
          </motion.article>
        ))}
      </section>

      {/* Formulaire d’inscription */}
      <section className="mt-10">
        <motion.form
          onSubmit={handleSubmit}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="mx-auto max-w-md rounded-3xl border border-zinc-800 bg-gradient-to-b from-zinc-900 to-black p-6 shadow-xl ring-1 ring-white/5"
        >
          <h2 className="flex items-center gap-2 text-lg font-semibold text-white">
            <Mail className="h-5 w-5 text-yellow-300" />
            Rejoins le leaderboard
          </h2>
          <p className="mt-1 text-sm text-zinc-400">
            Inscris ton email pour apparaître dans le classement et recevoir la
            newsletter SwamiVerse.
          </p>
          <div className="mt-4 flex gap-2">
            <input
              type="email"
              required
              placeholder="ton@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="flex-1 rounded-xl border border-zinc-700 bg-zinc-800/70 px-3 py-2 text-sm text-white placeholder-zinc-500 focus:outline-none focus-visible:ring-2 focus-visible:ring-yellow-400/40"
            />
            <button
              type="submit"
              className="rounded-xl bg-yellow-300 px-4 py-2 text-sm font-semibold text-black shadow-sm transition hover:shadow-yellow-300/30 focus:outline-none focus-visible:ring-4 focus-visible:ring-yellow-400/60"
            >
              Rejoindre
            </button>
          </div>
        </motion.form>
      </section>
    </>
  );
}
