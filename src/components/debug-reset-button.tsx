"use client";
import { usePixels } from "@/components/pixels-provider";

export default function DebugResetButton() {
  const { resetPixels } = usePixels();

  const handleReset = () => {
    localStorage.clear(); // efface le bonusClaimed et autres clés
    resetPixels(); // remet tes PX à 100
    location.reload(); // recharge la page
  };

  return (
    <button
      onClick={handleReset}
      className="fixed bottom-4 right-4 z-50 rounded-lg bg-red-600 px-3 py-2 text-white shadow-lg"
    >
      🔄 Reset All
    </button>
  );
}
