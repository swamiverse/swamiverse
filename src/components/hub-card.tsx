"use client";

import { motion } from "framer-motion";

export default function HubCard({
  title,
  description,
  image,
  onClick,
}: {
  title: string;
  description: string;
  image: string;
  onClick: () => void;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4 }}
      className="relative flex h-64 flex-col justify-end overflow-hidden rounded-2xl shadow-lg group"
    >
      <img
        src={image}
        alt={title}
        className="absolute inset-0 h-full w-full object-cover"
      />
      <div className="absolute inset-0 bg-black/50" />

      <div className="relative z-10 p-4">
        <button onClick={onClick} className="btn-secondary w-full text-left">
          <h3 className="text-base font-bold leading-tight">{title}</h3>
          <p className="text-sm opacity-90">{description}</p>
        </button>
      </div>
    </motion.div>
  );
}
