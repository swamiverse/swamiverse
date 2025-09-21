// src/app/layout.tsx
import type { Metadata } from "next";
import "./globals.css";
import { SiteHeader } from "../components/site-header";
import { SiteFooter } from "../components/site-footer";
import { ThemeProvider } from "../components/theme-provider";
import { SwamiBotFloating } from "../components/swami-bot";
import { PixelsProvider } from "../components/pixels-provider"; // 👈 ajout

export const metadata: Metadata = {
  title: "SwamiVerse — Je fabrique des mondes jouables",
  description:
    "Portfolio expérimental de Swami. Univers, Garage, Blog, Casino — data-driven avec humour.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr" className="h-full" suppressHydrationWarning>
      <body className="min-h-full bg-white text-zinc-900 selection:bg-yellow-300 selection:text-black antialiased dark:bg-black dark:text-zinc-50">
        <ThemeProvider>
          <PixelsProvider>
            <SiteHeader />
            <main className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
              {children}
            </main>
            <SiteFooter />
            <SwamiBotFloating />
          </PixelsProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
