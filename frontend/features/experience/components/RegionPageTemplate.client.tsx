"use client";

import Link from "next/link";
import type { CraftRegion } from "@/content/regions";
import { EditorialCampaignPage } from "@/features/experience/components/EditorialCampaignPage.client";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";

interface RegionPageTemplateProps {
  region: CraftRegion;
}

export function RegionPageTemplate({ region }: RegionPageTemplateProps) {
  return (
    <EditorialCampaignPage
      season={`${region.weave} · ${region.state}`}
      title={region.headline}
      subtitle={region.name}
      intro={region.intro}
      chapters={[
        { title: "History", body: region.history },
        {
          title: "Techniques",
          body: region.techniques.join(" · "),
        },
        { title: "Artisans", body: region.artisans },
      ]}
      cta={{ label: `Shop ${region.weave}`, href: region.catalogHref }}
      palette={region.palette}
    >
      <Container className="border-t border-border py-12 md:py-16">
        <p className="text-eyebrow text-text-muted">Explore the cluster</p>
        <div className="mt-6 flex flex-wrap gap-4">
          <Link href={region.catalogHref}>
            <Button>{region.weave} collection</Button>
          </Link>
          <Link href="/our-craft">
            <Button variant="outline">Our craft journey</Button>
          </Link>
        </div>
      </Container>
    </EditorialCampaignPage>
  );
}
