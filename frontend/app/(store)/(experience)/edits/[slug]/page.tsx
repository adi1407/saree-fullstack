import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getEditorialEdit, getEditorialEditSlugs } from "@/content/edits";
import { EditorialCampaignPage } from "@/features/experience/components/EditorialCampaignPage.client";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return getEditorialEditSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const edit = getEditorialEdit(slug);
  if (!edit) return { title: "Edit Not Found" };
  return {
    title: edit.title,
    description: edit.intro,
  };
}

export default async function EditorialEditPage({ params }: Props) {
  const { slug } = await params;
  const edit = getEditorialEdit(slug);
  if (!edit) notFound();

  return (
    <EditorialCampaignPage
      season={edit.season}
      title={edit.title}
      subtitle={edit.subtitle}
      intro={edit.intro}
      quote={edit.quote}
      chapters={edit.chapters}
      cta={edit.cta}
      palette={edit.palette}
    />
  );
}
