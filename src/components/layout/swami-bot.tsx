"use client";
import { useState } from "react";
import { MessageCircle, X } from "lucide-react";

export default function SwamiBot() {
  const [open, setOpen] = useState(false);

  return (
    <div className="fixed bottom-4 right-4 z-50">
      {!open ? (
        <button
          onClick={() => setOpen(true)}
          className="rounded-full p-3 shadow-md transition focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring)]"
          style={{
            background: "var(--primary)",
            color: "var(--primary-foreground)",
          }}
        >
          <MessageCircle className="h-6 w-6" />
        </button>
      ) : (
        <div
          className="w-72 rounded-xl border p-4 shadow-lg"
          style={{
            background: "var(--background)",
            color: "var(--foreground)",
            borderColor: "var(--border)",
          }}
        >
          <div className="flex justify-between items-center mb-3">
            <h3 className="font-bold">SwamiBot</h3>
            <button
              onClick={() => setOpen(false)}
              className="p-1 rounded focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring)]"
              style={{ color: "var(--muted-foreground)" }}
            >
              <X className="h-4 w-4" />
            </button>
          </div>
          <p className="text-sm text-[var(--muted-foreground)]">
            Je suis ton guide. Pose-moi une question !
          </p>
        </div>
      )}
    </div>
  );
}
