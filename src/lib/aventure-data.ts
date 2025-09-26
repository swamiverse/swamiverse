export const aventures = [
  {
    id: "1",
    titre: "La Quête du Sandwich Sacré",
    intro:
      "Un bruit court : un sandwich légendaire serait caché dans les plaines de SwamiVerse...",
    steps: [
      {
        id: "step1",
        texte:
          "Tu pars de ton garage. Devant toi, deux chemins : à gauche une forêt sombre, à droite une taverne animée.",
        choices: [
          { label: "Aller dans la forêt", next: "step2" },
          { label: "Entrer dans la taverne", next: "step3" },
        ],
      },
      {
        id: "step2",
        texte:
          "La forêt grouille de moustiques pixels. Ils veulent te piquer ton solde.",
        choices: [
          { label: "Les affronter", next: "end_bad" },
          { label: "Fuir en criant 'CROISSANT !'", next: "end_funny" },
        ],
      },
      {
        id: "step3",
        texte:
          "À la taverne, un vieux sage propose de vendre une carte contre 10 pixels.",
        choices: [
          { label: "Payer 10 pixels", next: "end_good", costPixels: 10 },
          { label: "Refuser et partir", next: "end_funny" },
        ],
      },
    ],
    endings: {
      end_bad: {
        texte:
          "Tu as été vidé de tes pixels par les moustiques. Tu récupères un objet : 'Canard en plastique inutile'.",
        reward: { objetId: "canard_plastique", pixels: 0 },
      },
      end_funny: {
        texte:
          "Tu cries 'CROISSANT !' si fort que les moustiques explosent. Tu gagnes 5 pixels et une 'Baguette friable'.",
        reward: { objetId: "baguette_friable", pixels: 5 },
      },
      end_good: {
        texte:
          "La carte menait au Sandwich Sacré. Tu le manges. Il était épique. Tu gagnes 20 pixels et un 'Sandwich sacré'.",
        reward: { objetId: "sandwich_sacre", pixels: 20 },
      },
    },
  },
];

export const objetsMock = {
  canard_plastique: {
    id: "canard_plastique",
    nom: "Canard en plastique inutile",
    rarete: "Commun",
    description: "Il ne flotte même pas. Bravo.",
    image_url: "/images/objets/canard.png",
    stackable: false,
  },
  baguette_friable: {
    id: "baguette_friable",
    nom: "Baguette friable",
    rarete: "Rare",
    description: "S'effrite à chaque coup. Mais sent bon.",
    image_url: "/images/objets/baguette.png",
    stackable: false,
  },
  sandwich_sacre: {
    id: "sandwich_sacre",
    nom: "Sandwich Sacré",
    rarete: "Épique",
    description:
      "On dirait qu'il contient de la lumière divine et du thon mayo.",
    image_url: "/images/objets/sandwich.png",
    stackable: false,
  },
};
