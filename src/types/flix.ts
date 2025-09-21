// src/types/flix.ts
export type Poster = {
  id: string;
  title: string;
  category: string;
  image: string; // ex: /images/flix/xxx.jpg
  synopsis?: string;
  year?: number;
  rating?: number; // 0–10
};
