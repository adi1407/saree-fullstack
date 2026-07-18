import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getCraftRegion, getCraftRegionSlugs } from "@/content/regions";
import { RegionPageTemplate } from "@/features/experience/components/RegionPageTemplate.client";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return getCraftRegionSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const region = getCraftRegion(slug);
  if (!region) return { title: "Region Not Found" };
  return {
    title: `${region.name} | ${region.weave} Craft`,
    description: region.intro,
  };
}

export default async function RegionPage({ params }: Props) {
  const { slug } = await params;
  const region = getCraftRegion(slug);
  if (!region) notFound();
  return <RegionPageTemplate region={region} />;
}
