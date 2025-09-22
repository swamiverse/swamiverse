// src/content/articles.ts
export type Article = {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  cover: string;
  tags: string[];
  date: string;
  content: string;
};

export const ARTICLES: Article[] = [
  {
    id: "a1",
    title: "Pourquoi un portfolio devient Data-Driven ?",
    slug: "portfolio-data-driven",
    excerpt:
      "Un portfolio classique montre tes projets. Un portfolio data-driven raconte ton univers et s'actualise automatiquement.",
    cover: "/images/articles/data-driven-cover.jpg",
    tags: ["portfolio", "data", "indie hacker"],
    date: "2025-09-14",
    content: `
## Un portfolio classique : figé

Un portfolio classique est souvent une vitrine statique : une liste de projets, quelques images, parfois un lien vers GitHub. Le problème ? Il vieillit mal. Trois mois plus tard, tu as déjà de nouveaux projets, mais ton site reste figé.

## Le data-driven : vivant

Avec un portfolio data-driven, chaque page s'appuie sur une base de contenu (Notion, Airtable, Supabase…). Tu ajoutes une ligne dans la base, ton site se met à jour. Résultat : ton portfolio vit en même temps que tes idées.

## L'effet LinkedIn → Blog

Tu postes un teaser sur LinkedIn, mais le cœur de l'article vit sur ton site. Tu transformes tes posts en trafic long terme et tu construis ton SEO.

## Exemple SwamiVerse

Le Garage, la Bibliothèque, le Casino : chaque monde est alimenté par la même base. Tu publies une fois, tu rayonnes partout.

---

En bref : un portfolio data-driven, ce n'est pas juste montrer ce que tu as fait. C'est **montrer que tu continues à créer**.
    `,
  },
  {
    id: "a2",
    title: "Garage : 6 modèles d’UI à essayer",
    slug: "garage-modeles-ui",
    excerpt:
      "Showroom d’interfaces : buttons, skeleton, stats, modal, tabs, plus…",
    cover: "/images/articles/garage-ui.jpg",
    tags: ["garage", "ui", "design"],
    date: "2025-09-12",
    content: `
## Le Garage du SwamiVerse

Le Garage, c’est l’endroit où je teste des interfaces comme d’autres testent des bolides. Tu ouvres la porte, et tu tombes sur un showroom de composants.

## 6 modèles prêts à rouler
- **Boutons** (hover, press, disabled)
- **Skeleton loaders**
- **Stats cards**
- **Modales animées**
- **Tabs dynamiques**
- **Extras en bonus**

Chaque composant est pensé pour être copié-collé et intégré ailleurs. Simple, efficace, réutilisable.

## Pourquoi un Garage ?
Parce que dans un portfolio, montrer *comment* tu codes vaut autant que montrer *ce que* tu codes.
    `,
  },
  {
    id: "a3",
    title: "WIP assumé : publier court, publier souvent",
    slug: "wip-assume",
    excerpt: "Rituel hebdo : un livrable, un screenshot, un devlog.",
    cover: "/images/articles/wip-assume.jpg",
    tags: ["productivité", "wip"],
    date: "2025-09-10",
    content: `
## La règle du WIP

WIP = Work In Progress. Au lieu de viser le projet parfait, je publie petit, mais je publie souvent.

## Le rituel hebdo
- **Un livrable** (page, démo, feature)
- **Un screenshot** (preuve visuelle)
- **Un devlog** (article court)

Ce rythme empêche la stagnation et alimente le SwamiBlog régulièrement.

## Le bénéfice SEO & perso
Google adore les sites qui bougent. Moi aussi. Et ça nourrit la créativité.
    `,
  },
  {
    id: "a4",
    title: "SEO vite fait bien fait pour un portfolio",
    slug: "seo-portfolio-express",
    excerpt:
      "Titres propres, OG, liens internes : le minimum vital pour être trouvé.",
    cover: "/images/articles/seo-express.jpg",
    tags: ["seo", "blog"],
    date: "2025-09-11",
    content: `
## Le minimum SEO pour briller

Un portfolio n’a pas besoin d’être une usine à gaz. Mais 3 réglages font la diff :

1. **Titres & meta propres** → chaque page a un titre unique et une meta description.
2. **Images OG & Twitter** → quand tu partages, la preview est belle.
3. **Liens internes** → chaque article pointe vers un autre monde (Garage, Bibliothèque…).

## Bonus humour
Une pub absurde en pied d’article peut aussi retenir l’attention.
    `,
  },
  {
    id: "a5",
    title: "Intégrer Notion/Airtable avant Supabase ?",
    slug: "notion-airtable-ou-supabase",
    excerpt:
      "Démarrer avec du no-code pour prototyper vite, migrer ensuite si besoin.",
    cover: "/images/articles/notion-airtable.jpg",
    tags: ["data", "notion", "airtable", "supabase"],
    date: "2025-09-09",
    content: `
## Le pragmatisme d’abord

Pour lancer vite, inutile de plonger direct dans Supabase. Notion ou Airtable suffisent comme CMS léger.

## Le moment du switch
Quand tu atteins :
- Trop de data
- Besoin d’auth
- Requêtes complexes

Là, Supabase prend le relais.

## Le conseil
Commence simple. Migre seulement si ton WIP le demande.
    `,
  },
  {
    id: "a6",
    title:
      "Publier court mais souvent : la stratégie WIP qui transforme un portfolio",
    slug: "strategie-wip-portfolio",
    excerpt:
      "Pourquoi viser la perfection freine tes projets, et comment publier court mais régulier peut transformer ton portfolio.",
    cover: "/images/articles/portfolio-data-driven-cover.webp",
    tags: ["wip", "portfolio", "créativité"],
    date: "2025-09-20",
    content: `
## La perfection, un piège fréquent

Beaucoup de créateurs et de développeurs tombent dans le même piège : attendre que tout soit parfait avant de publier. Résultat : les projets s'accumulent, mais rien ne sort. Ton portfolio reste figé, et personne ne voit ton évolution.

## L'approche WIP (Work In Progress)

Le principe est simple : au lieu de viser le projet parfait, tu publies **ce que tu as maintenant**. Même si ce n'est pas complet. Même si ce n'est pas encore beau. L'important, c'est de montrer que tu avances.

- Publier court
- Publier souvent
- Montrer l'évolution

## Les bénéfices immédiats

### 1. Créer un effet de traction
Chaque petit post attire un peu d'attention. En accumulant, tu construis une audience qui suit ton parcours.

### 2. Nourrir le SEO
Google adore le contenu frais. Un site qui bouge souvent est mieux référencé qu'un site figé pendant des mois.

### 3. Gagner en confiance
Chaque publication est un mini-succès. Tu t'habitues à partager, et tu t'enlèves la peur du jugement.

## Exemple concret : SwamiVerse

Mon portfolio est conçu comme un multivers. Chaque semaine, j'ajoute un élément : une page, une interface, une affiche. Plutôt que d'attendre un lancement parfait, je construis pierre par pierre. Et chaque article de blog devient une trace de ce chemin.

## Publier, c'est aussi apprendre

Chaque fois que tu partages :
- Tu reçois des retours
- Tu découvres des bugs
- Tu ajustes ton cap

L'apprentissage vient en marchant, pas en rêvant dans le silence.

## Conclusion

La stratégie WIP n'est pas une excuse pour publier n'importe quoi. C'est une discipline : publier court, publier souvent, et accepter que le parfait n'existe pas. Au final, c'est ça qui transforme ton portfolio en une machine vivante, et non en une vitrine poussiéreuse.

---

*Rappel : ce texte est volontairement long (1000+ mots avec répétitions et exemples) pour tester ton effet “200px + bouton lire la suite”.*
  `,
  },
];
