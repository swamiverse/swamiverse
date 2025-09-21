"use client";
import Link from "next/link";

const spots = [
  { id: "garage", label: "Garage", href: "/garage", color: "bg-yellow-500" },
  {
    id: "bibliotheque",
    label: "Bibliothèque",
    href: "/bibliotheque",
    color: "bg-pink-500",
  },
  { id: "flix", label: "Flix", href: "/flix", color: "bg-cyan-500" },
  { id: "beats", label: "Beats", href: "/beats", color: "bg-green-500" },
  { id: "store", label: "Store", href: "/store", color: "bg-purple-500" },
  {
    id: "acces",
    label: "Accès Interdit",
    href: "/acces-interdit",
    color: "bg-red-500",
  },
  { id: "blog", label: "Blog", href: "/blog", color: "bg-slate-500" },
  { id: "about", label: "About", href: "/about", color: "bg-slate-500" },
  {
    id: "worldmap",
    label: "WorldMap",
    href: "/worldmap",
    color: "bg-slate-500",
  },
  { id: "contact", label: "Contact", href: "/contact", color: "bg-slate-500" },
];

export default function PlanGrid() {
  return (
    <div className="p-6">
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 bg-neutral-900 p-4 rounded-xl">
        {spots.map((s) => (
          <Link
            key={s.id}
            href={s.href}
            className={`
              flex items-center justify-center h-28 sm:h-32 lg:h-36
              text-white font-bold text-lg uppercase
              rounded-xl shadow-md hover:shadow-xl transition
              ${s.color}
            `}
          >
            {s.label}
          </Link>
        ))}
      </div>
    </div>
  );
}
