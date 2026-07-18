import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getOccasionPage, getOccasionPageSlugs } from "@/content/occasions";
import { OccasionPageTemplate } from "@/features/experience/components/OccasionPageTemplate.client";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return getOccasionPageSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const page = getOccasionPage(slug);
  if (!page) return { title: "Occasion Not Found" };
  return {
    title: `${page.label} | Shop by Occasion`,
    description: page.description,
  };
}

export default async function OccasionPage({ params }: Props) {
  const { slug } = await params;
  const page = getOccasionPage(slug);
  if (!page) notFound();
  return <OccasionPageTemplate page={page} />;
}
