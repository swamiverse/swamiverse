"use client";

import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import {
  Send,
  Mail,
  User,
  MessageSquare,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";

export default function ContactPage() {
  const lastUpdated = useMemo(
    () =>
      new Date().toLocaleString("fr-FR", {
        dateStyle: "medium",
        timeStyle: "short",
      }),
    []
  );

  const [sending, setSending] = useState(false);
  const [ok, setOk] = useState<null | boolean>(null);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setOk(null);
    setSending(true);
    // Faux envoi : simule un POST (à remplacer par une vraie API route si besoin)
    await new Promise((r) => setTimeout(r, 800));
    setSending(false);
    setOk(true);
    (e.currentTarget as HTMLFormElement).reset();
  }

  return (
    <>
      {/* Badge DB */}
      <div className="mt-6 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, y: -6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="inline-flex items-center gap-2 rounded-full border border-zinc-200 bg-black px-3 py-1 text-xs text-zinc-100 shadow-inner ring-1 ring-white/5 dark:border-zinc-800 dark:bg-zinc-900/50 dark:text-zinc-300"
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
      <section className="mt-10 lg:mt-14">
        <motion.h1
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-4xl font-bold leading-tight tracking-tight sm:text-5xl"
        >
          Contact
        </motion.h1>
        <p className="mt-4 max-w-2xl text-lg text-zinc-700 dark:text-zinc-300">
          Un projet, une idée, une vanne ? Envoie-moi un message.
        </p>
      </section>

      {/* Form */}
      <section className="mt-8">
        <div className="rounded-3xl border border-zinc-200 bg-black p-6 text-white ring-1 ring-white/5 dark:border-zinc-800 dark:bg-gradient-to-b dark:from-zinc-900 dark:to-black">
          <form onSubmit={onSubmit} className="grid gap-4" noValidate>
            <div className="grid gap-2 sm:grid-cols-2">
              <label className="grid gap-1 text-sm" htmlFor="name">
                <span className="inline-flex items-center gap-2">
                  <User className="h-4 w-4 text-yellow-300" /> Nom
                </span>
                <input
                  id="name"
                  name="name"
                  type="text"
                  required
                  placeholder="Ton nom"
                  className="rounded-xl border border-zinc-300 bg-white px-3 py-2 text-zinc-900 placeholder-zinc-400 outline-none ring-0 transition focus:border-yellow-300 focus:outline-none dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-100"
                />
              </label>

              <label className="grid gap-1 text-sm" htmlFor="email">
                <span className="inline-flex items-center gap-2">
                  <Mail className="h-4 w-4 text-yellow-300" /> Email
                </span>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  placeholder="ton@email.com"
                  className="rounded-xl border border-zinc-300 bg-white px-3 py-2 text-zinc-900 placeholder-zinc-400 outline-none ring-0 transition focus:border-yellow-300 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-100"
                />
              </label>
            </div>

            <label className="grid gap-1 text-sm" htmlFor="message">
              <span className="inline-flex items-center gap-2">
                <MessageSquare className="h-4 w-4 text-yellow-300" /> Message
              </span>
              <textarea
                id="message"
                name="message"
                required
                rows={5}
                placeholder="Dis m’en plus…"
                className="rounded-xl border border-zinc-300 bg-white px-3 py-2 text-zinc-900 placeholder-zinc-400 outline-none ring-0 transition focus:border-yellow-300 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-100"
              />
            </label>

            <div className="flex items-center justify-between gap-3">
              <button
                type="submit"
                disabled={sending}
                className="inline-flex items-center gap-2 rounded-2xl bg-yellow-300 px-4 py-2 font-semibold text-black shadow-md ring-2 ring-yellow-200 transition hover:shadow-yellow-300/30 disabled:cursor-not-allowed disabled:opacity-60"
              >
                <Send className="h-4 w-4" />
                {sending ? "Envoi…" : "Envoyer"}
              </button>

              <a
                href="mailto:hello@example.com?subject=Contact%20SwamiVerse"
                className="text-sm text-yellow-300 underline-offset-2 hover:underline"
              >
                Ou m’écrire via email
              </a>
            </div>

            {ok === true && (
              <p className="mt-2 inline-flex items-center gap-2 text-sm text-emerald-400">
                <CheckCircle2 className="h-4 w-4" /> Message envoyé (simulé).
                Merci !
              </p>
            )}
            {ok === false && (
              <p className="mt-2 inline-flex items-center gap-2 text-sm text-red-400">
                <AlertCircle className="h-4 w-4" /> Oups, un souci est survenu.
              </p>
            )}
          </form>

          <p className="mt-5 text-xs text-zinc-400">
            Tes infos ne sont pas stockées ici (pas de base branchée pour
            l’instant). En prod, ce formulaire pointera vers une API route ou un
            service d’email (Resend, Postmark, etc.).
          </p>
        </div>
      </section>
    </>
  );
}
