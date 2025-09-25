// src/app/layout.tsx
import type { Metadata } from "next";
import "./globals.css";
import SiteHeader from "@/components/layout/site-header";
import { SiteFooter } from "../components/layout/site-footer";
import { ThemeProvider } from "../components/layout/theme-provider";
import { SwamiBotFloating } from "../components/layout/swami-bot";
import { PixelsProvider } from "../components/pixels-provider";
import DataThemeBridge from "../components/layout/data-theme-bridge";
import ThemeSwitcher from "../components/layout/theme-switcher";
import PXBubbles from "../components/layout/px-bubbles";

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
      <body className="flex min-h-screen flex-col bg-[var(--background)] text-[var(--foreground)] selection:bg-yellow-300 selection:text-black antialiased">
        <ThemeProvider>
          <DataThemeBridge initial="garage" />
          <PixelsProvider>
            <SiteHeader />

            {/* main prend toute la place dispo entre header et footer */}
            <main className="mx-auto flex-1 w-full max-w-6xl px-4 sm:px-6 lg:px-8">
              {children}
            </main>

            <SiteFooter />

            {/* chatbot avec wrapper pour l’ancrage */}
            <div data-swamibot>
              <SwamiBotFloating />
            </div>

            {/* ➜ Les bulles PX branchées sur usePixels */}
            <PXBubbles
              spawnEveryMs={60_000} // 1/minute
              travelDurationMs={9_000}
              reward={50}
              label="PX"
              maxConcurrent={2}
              waveRatio={0.6}
              sound={false}
            />
          </PixelsProvider>

          {/* nouveau ThemeSwitcher bouton flottant */}
          <ThemeSwitcher
            anchorSelector="[data-swamibot]"
            side="left"
            gap={12}
            size={56}
            zIndex={60}
          />
        </ThemeProvider>
      </body>
    </html>
  );
}
