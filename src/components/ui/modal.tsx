"use client";

import { X } from "lucide-react";
import React, { useRef } from "react";

export default function Modal({
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
        >
          <X className="h-5 w-5" />
        </button>
        {children}
      </div>
    </div>
  );
}
