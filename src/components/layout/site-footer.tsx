"use client";

export default function SiteFooter() {
  return (
    <footer
      className="mt-10 border-t px-6 py-4 text-center text-sm"
      style={{
        background: "var(--background)",
        color: "var(--muted-foreground)",
        borderColor: "var(--border)",
      }}
    >
      <p>
        © {new Date().getFullYear()} SwamiVerse — Fabriqué avec ❤️ et un peu de
        café.
      </p>
    </footer>
  );
}
