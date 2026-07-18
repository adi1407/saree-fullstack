"use client";

import Link from "next/link";
import type { OccasionPage } from "@/content/occasions";
import { EditorialCampaignPage } from "@/features/experience/components/EditorialCampaignPage.client";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";

interface OccasionPageTemplateProps {
  page: OccasionPage;
}

export function OccasionPageTemplate({ page }: OccasionPageTemplateProps) {
  return (
    <EditorialCampaignPage
      season={page.label}
      title={page.tagline}
      subtitle={page.description}
      intro={page.description}
      chapters={page.stylingTips.map((tip, i) => ({
        title: i === 0 ? "Curator's note" : `Styling tip ${i}`,
        body: tip,
      }))}
      cta={{ label: `Shop ${page.label.toLowerCase()}`, href: page.catalogHref }}
      palette={{ primary: page.palette.to, secondary: page.palette.accent }}
    >
      <Container className="border-t border-border py-12 md:py-16">
        <p className="text-eyebrow text-text-muted">Recommended weaves</p>
        <ul className="mt-4 flex flex-wrap gap-3">
          {page.recommendedWeaves.map((weave) => (
            <li key={weave.slug}>
              <Link
                href={`/collections/${weave.slug}`}
                className="text-micro border border-border px-4 py-2 transition-colors hover:border-secondary hover:text-primary"
              >
                {weave.label}
              </Link>
            </li>
          ))}
        </ul>
        <div className="mt-8">
          <Link href={page.catalogHref}>
            <Button variant="outline">View all {page.label.toLowerCase()} sarees</Button>
          </Link>
        </div>
      </Container>
    </EditorialCampaignPage>
  );
}
