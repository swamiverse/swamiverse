import type { Metadata } from "next";
import FlixClient from "@/components/flix/flix-client";
import type { Poster } from "@/types/flix";

export const metadata: Metadata = {
  title: "SwamiFlix — Affiches IA & faux films",
  description:
    "SwamiFlix : un mur d'affiches IA classés par catégorie. Découvre des films qui n'existent pas (encore).",
  openGraph: {
    title: "SwamiFlix — Affiches IA & faux films",
    description:
      "SwamiFlix : un mur d'affiches IA classés par catégorie. Découvre des films qui n'existent pas (encore).",
    type: "website",
    url: "/flix",
  },
};

// ✅ toutes les affiches dans /images/flix/posters
const POSTER_BASE = "/images/flix/posters";
const posters: Poster[] = [
  {
    id: "p-neon-rider",
    title: "Neon Rider",
    category: "Action",
    image: `${POSTER_BASE}/neon-rider.jpg`,
    synopsis:
      "Un coursier traverse une mégalopole où les panneaux publicitaires sont vivants.",
    year: 2025,
    rating: 7.6,
  },
  {
    id: "p-quantum-noodle",
    title: "Quantum Noodle",
    category: "Comédie",
    image: `${POSTER_BASE}/quantum-noodle.jpg`,
    synopsis:
      "Un chef ramène des recettes d'univers parallèles. Les pâtes le ramènent aussi.",
    year: 2024,
    rating: 7.1,
  },
  {
    id: "p-silent-libraries",
    title: "Silent Libraries",
    category: "Aventure",
    image: `${POSTER_BASE}/silent-libraries.jpg`,
    synopsis:
      "Explorer une bibliothèque infinie où chaque livre modifie le monde réel.",
    year: 2023,
    rating: 8.2,
  },
  {
    id: "p-protocol-void",
    title: "Protocol: VOID",
    category: "Sci-Fi",
    image: `${POSTER_BASE}/protocol-void.jpg`,
    synopsis:
      "Des ingénieurs patchent le vide comme un bug cosmique. Les logs deviennent prophéties.",
    year: 2026,
    rating: 7.9,
  },
  {
    id: "p-cosmic-baguette",
    title: "Cosmic Baguette",
    category: "Comédie",
    image: "/images/flix/posters/cosmic-baguette.jpg",
    synopsis:
      "Un boulanger parisien découvre que sa baguette fraîche ouvre des portails cosmiques.",
    year: 2025,
    rating: 7.3,
  },
  {
    id: "p-laser-duck",
    title: "Laser Duck",
    category: "Comédie",
    image: "/images/flix/posters/laser-duck.jpg",
    synopsis:
      "Un canard équipé d’un rayon laser tente de s’intégrer dans une petite ville tranquille.",
    year: 2024,
    rating: 6.9,
  },
  {
    id: "p-bureaucracy-club",
    title: "The Bureaucracy Club",
    category: "Comédie",
    image: "/images/flix/posters/bureaucracy-club.jpg",
    synopsis:
      "Des fonctionnaires découvrent que leurs réunions sont en fait des tournois d’impro.",
    year: 2023,
    rating: 7.5,
  },
  {
    id: "p-analog-heart",
    title: "Analog Heart",
    category: "Drame",
    image: `${POSTER_BASE}/analog-heart.jpg`,
    synopsis:
      "Un horloger tente de réparer le cœur mécanique de sa ville natale.",
    year: 2022,
    rating: 7.4,
  },
  {
    id: "p-kite-of-icarus",
    title: "Kite of Icarus",
    category: "Aventure",
    image: `${POSTER_BASE}/kite-of-icarus.jpg`,
    synopsis: "Une course de cerfs-volants géants au-dessus d’îles flottantes.",
    year: 2025,
    rating: 7.0,
  },
  {
    id: "p-midnight-prototype",
    title: "Midnight Prototype",
    category: "Thriller",
    image: `${POSTER_BASE}/midnight-prototype.jpg`,
    synopsis:
      "Un développeur teste un build qui réécrit sa vie à chaque commit.",
    year: 2024,
    rating: 8.0,
  },
  {
    id: "p-echo-museum",
    title: "Echo Museum",
    category: "Documentaire",
    image: `${POSTER_BASE}/echo-museum.jpg`,
    synopsis:
      "Un musée collecte les échos sonores du passé pour rejouer l’Histoire.",
    year: 2021,
    rating: 7.2,
  },
  {
    id: "p-mecha-metro",
    title: "Mecha Metro",
    category: "Action",
    image: "/images/flix/posters/mecha-metro.jpg",
    synopsis:
      "Le métro parisien se transforme en robot géant pour défendre la ville.",
    year: 2026,
    rating: 7.8,
  },
  {
    id: "p-samurai-scooter",
    title: "Samurai Scooter",
    category: "Action",
    image: "/images/flix/posters/samurai-scooter.jpg",
    synopsis:
      "Un livreur à scooter se bat avec un katana contre les embouteillages éternels.",
    year: 2025,
    rating: 7.0,
  },
  {
    id: "p-volcano-wrestlers",
    title: "Volcano Wrestlers",
    category: "Action",
    image: "/images/flix/posters/volcano-wrestlers.jpg",
    synopsis:
      "Des catcheurs affrontent des volcans vivants lors de combats titanesques.",
    year: 2024,
    rating: 7.2,
  },
  {
    id: "p-cactus-cowboy",
    title: "Cactus Cowboy",
    category: "Western",
    image: "/images/flix/posters/cactus-cowboy.jpg",
    synopsis:
      "Un cow-boy transformé en cactus lutte pour garder son ranch arrosé… et sa dignité.",
    year: 2025,
    rating: 6.8,
  },
  {
    id: "p-disco-kraken",
    title: "Disco Kraken",
    category: "Comédie",
    image: "/images/flix/posters/disco-kraken.jpg",
    synopsis:
      "Un kraken surgit des abysses pour devenir star du disco new-yorkais.",
    year: 2024,
    rating: 7.2,
  },
  {
    id: "p-cyborg-grandma",
    title: "Cyborg Grandma",
    category: "Action",
    image: "/images/flix/posters/cyborg-grandma.jpg",
    synopsis:
      "Une grand-mère robotisée reprend du service pour sauver sa maison de retraite.",
    year: 2026,
    rating: 7.5,
  },
  {
    id: "p-pizza-werewolf",
    title: "Pizza Werewolf",
    category: "Horreur",
    image: "/images/flix/posters/pizza-werewolf.jpg",
    synopsis:
      "Un livreur de pizzas se transforme en loup-garou chaque pleine lune… sauf s’il est en retard.",
    year: 2023,
    rating: 6.9,
  },
  {
    id: "p-surfing-astronauts",
    title: "Surfing Astronauts",
    category: "Sci-Fi",
    image: "/images/flix/posters/surfing-astronauts.jpg",
    synopsis:
      "Une bande d’astronautes surfe sur des vagues de plasma à la surface du Soleil.",
    year: 2025,
    rating: 7.7,
  },
  {
    id: "p-haunted-toaster",
    title: "Haunted Toaster",
    category: "Horreur",
    image: "/images/flix/posters/haunted-toaster.jpg",
    synopsis:
      "Un grille-pain possédé condamne ses propriétaires à revivre leur petit-déjeuner… pour l’éternité.",
    year: 2023,
    rating: 6.7,
  },
  {
    id: "p-marionette-hospital",
    title: "Marionette Hospital",
    category: "Horreur",
    image: "/images/flix/posters/marionette-hospital.jpg",
    synopsis:
      "Dans un hôpital abandonné, les patients reviennent sous forme de marionnettes à fils.",
    year: 2024,
    rating: 7.1,
  },
  {
    id: "p-lantern-smiles",
    title: "Lantern Smiles",
    category: "Horreur",
    image: "/images/flix/posters/lantern-smiles.jpg",
    synopsis:
      "Un village se réunit chaque nuit autour de lanternes sculptées… mais ce sont les lanternes qui rient.",
    year: 2025,
    rating: 7.4,
  },
  {
    id: "p-solar-guardian",
    title: "Solar Guardian",
    category: "Sci-Fi",
    image: "/images/flix/posters/solar-guardian.jpg",
    synopsis:
      "Un astronaute absorbé par une tempête solaire revient sur Terre avec le pouvoir de contrôler la lumière… mais pas ses propres ombres.",
    year: 2026,
    rating: 7.8,
  },
  {
    id: "p-vinyl-vengeance",
    title: "Vinyl Vengeance",
    category: "Comédie",
    image: "/images/flix/posters/vinyl-vengeance.jpg",
    synopsis:
      "Un disquaire underground devient justicier grâce à ses vinyles maudits qui libèrent des ondes sonores dévastatrices.",
    year: 2025,
    rating: 7.2,
  },
  {
    id: "p-iron-orchid",
    title: "Iron Orchid",
    category: "Drame",
    image: "/images/flix/posters/iron-orchid.jpg",
    synopsis:
      "Un botaniste fusionne avec une fleur métallique extraterrestre et doit choisir entre sauver la planète ou ses racines humaines.",
    year: 2024,
    rating: 7.5,
  },
];

export default function FlixPage() {
  return <FlixClient posters={posters} />;
}
