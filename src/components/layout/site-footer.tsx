"use client";

export default function SiteFooter() {
  return (
    <footer
      className="mt-10 border-t px-6 py-4 text-center text-sm"
      style={{
        background: "var(--background)",
        color: "var(--muted-foreground)",
        borderColor: "var(--border)",
        borderRadius: "0 var(--t-radius-md) 0 0", // petit arrondi haut si tu veux un effet plus doux
      }}
    >
      <p>
        © {new Date().getFullYear()} SwamiVerse — Fabriqué avec ❤️ et un peu de
        café.
      </p>
    </footer>
  );
}
