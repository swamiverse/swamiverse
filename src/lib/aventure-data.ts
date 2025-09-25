// src/lib/aventure-data.ts

export type Choice = {
  text: string; // texte affiché au joueur
  next: string; // id de la scène suivante
  item?: string; // objet gagné (optionnel)
};

export type Scene = {
  id: string; // identifiant unique de la scène
  text: string; // description narrative
  choices: Choice[]; // choix proposés
};

export const scenes: Scene[] = [
  {
    id: "start",
    text: "Tu te réveilles au bord d'une forêt mystérieuse. Devant toi, un chemin sombre s'enfonce entre les arbres.",
    choices: [
      { text: "Entrer dans la forêt", next: "wolf" },
      { text: "Faire demi-tour", next: "village" },
    ],
  },
  {
    id: "wolf",
    text: "Dans l’ombre, un loup apparaît, ses yeux brillants fixés sur toi.",
    choices: [
      { text: "Te défendre à mains nues", next: "defeat" },
      { text: "Fuir en courant", next: "village" },
      {
        text: "Tenter d’apprivoiser le loup",
        next: "companion",
        item: "ami_loup",
      },
    ],
  },
  {
    id: "village",
    text: "Tu arrives dans un petit village abandonné, les maisons sont désertes.",
    choices: [
      { text: "Fouiller une maison", next: "house", item: "clé_rouillée" },
      { text: "Revenir sur tes pas", next: "wolf" },
    ],
  },
  {
    id: "house",
    text: "Dans une maison, tu trouves un coffre poussiéreux verrouillé.",
    choices: [
      { text: "Essayer d’ouvrir avec la clé rouillée", next: "treasure" },
      { text: "Laisser tomber", next: "village" },
    ],
  },
  {
    id: "treasure",
    text: "Le coffre s’ouvre et révèle une épée scintillante !",
    choices: [{ text: "Prendre l’épée", next: "wolf", item: "épée" }],
  },
  {
    id: "defeat",
    text: "Le loup est trop fort... tu t’effondres.",
    choices: [],
  },
  {
    id: "companion",
    text: "Incroyable ! Le loup accepte de t’accompagner comme compagnon fidèle.",
    choices: [{ text: "Retourner au village", next: "village" }],
  },
];
