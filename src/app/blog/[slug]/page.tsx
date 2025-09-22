import { notFound } from "next/navigation";
import Image from "next/image";
import { ARTICLES } from "@/content/articles";
import { Tag, Calendar } from "lucide-react";
import type { Metadata } from "next";
import ArticleBody from "./article-body";

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  const article = ARTICLES.find((a) => a.slug === params.slug);

  if (!article) {
    return {
      title: "Article introuvable | SwamiBlog",
      description: "Cet article n'existe pas ou a été supprimé.",
    };
  }

  return {
    title: `${article.title} | SwamiBlog`,
    description: article.excerpt,
    openGraph: {
      title: article.title,
      description: article.excerpt,
      images: [article.cover],
    },
    twitter: {
      card: "summary_large_image",
      title: article.title,
      description: article.excerpt,
      images: [article.cover],
    },
  };
}

export default function ArticlePage({ params }: { params: { slug: string } }) {
  const article = ARTICLES.find((a) => a.slug === params.slug);

  if (!article) return notFound();

  return (
    <div className="max-w-3xl mx-auto p-6">
      {/* Cover */}
      <div className="relative w-full h-72 mb-6 rounded-2xl overflow-hidden">
        <Image
          src={article.cover}
          alt={article.title}
          fill
          className="object-cover"
        />
      </div>

      {/* Title + meta */}
      <h1 className="text-3xl font-bold mb-2">{article.title}</h1>
      <div className="flex items-center gap-4 text-sm text-gray-500 mb-6">
        <div className="flex items-center gap-1">
          <Calendar size={16} /> {article.date}
        </div>
        <div className="flex gap-2">
          {article.tags.map((tag) => (
            <span
              key={tag}
              className="bg-gray-100 text-gray-700 px-2 py-1 rounded-full text-xs flex items-center gap-1"
            >
              <Tag size={12} /> {tag}
            </span>
          ))}
        </div>
      </div>

      {/* Client component for blur effect */}
      <ArticleBody content={article.content} />
    </div>
  );
}
