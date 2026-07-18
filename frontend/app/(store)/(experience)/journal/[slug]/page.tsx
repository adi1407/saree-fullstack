import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getJournalArticle, getJournalSlugs } from "@/content/journal";
import { JournalArticleClient } from "./JournalArticle.client";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return getJournalSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const article = getJournalArticle(slug);
  if (!article) return { title: "Article Not Found" };
  return {
    title: article.title,
    description: article.excerpt,
  };
}

export default async function JournalArticlePage({ params }: Props) {
  const { slug } = await params;
  const article = getJournalArticle(slug);
  if (!article) notFound();
  return <JournalArticleClient article={article} />;
}
