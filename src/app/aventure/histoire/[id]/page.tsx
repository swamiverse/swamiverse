"use client";

import { useParams } from "next/navigation";
import { useState } from "react";
import { aventures } from "@/lib/aventure-data";

export default function HistoirePage() {
  const { id } = useParams();
  const aventure = aventures.find((a) => a.id === id);

  const [stepId, setStepId] = useState("intro");
  const [ending, setEnding] = useState(null);

  if (!aventure) return <div>⚠️ Aventure introuvable</div>;

  // Fin de l'aventure
  if (ending) {
    return (
      <div className="p-6 max-w-xl mx-auto">
        <h1 className="text-2xl font-bold mb-4">{aventure.titre}</h1>
        <p className="mb-4">{ending.texte}</p>
        <div className="p-4 bg-gray-100 rounded">
          🎁 Récompense : {ending.reward.pixels} pixels + objet{" "}
          {ending.reward.objetId}
        </div>
        <a
          href="/aventure"
          className="mt-6 inline-block px-4 py-2 bg-yellow-500 text-white rounded-lg"
        >
          Retour au hub
        </a>
      </div>
    );
  }

  // Intro ou étape en cours
  let content;
  if (stepId === "intro") {
    content = (
      <div>
        <p className="mb-6">{aventure.intro}</p>
        <button
          onClick={() => setStepId("step1")}
          className="px-4 py-2 bg-blue-500 text-white rounded"
        >
          Commencer l'aventure
        </button>
      </div>
    );
  } else {
    const step = aventure.steps.find((s) => s.id === stepId);
    if (!step) return <div>⚠️ Étape introuvable</div>;

    content = (
      <div>
        <p className="mb-6">{step.texte}</p>
        <div className="space-y-2">
          {step.choices.map((choice, idx) => (
            <button
              key={idx}
              onClick={() => {
                if (choice.next.startsWith("end_")) {
                  setEnding(aventure.endings[choice.next]);
                } else {
                  setStepId(choice.next);
                }
              }}
              className="block w-full text-left px-4 py-2 bg-green-500 text-white rounded"
            >
              {choice.label}
            </button>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">{aventure.titre}</h1>
      {content}
    </div>
  );
}
