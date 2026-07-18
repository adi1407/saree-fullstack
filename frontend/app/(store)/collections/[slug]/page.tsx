import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { Container } from "@/components/ui/Container";
import { CatalogShell } from "@/features/catalog/components/CatalogShell.client";
import { CollectionHero } from "@/features/editorial/components/CollectionHero";
import { CraftStoryPanel } from "@/features/editorial/components/CraftStoryPanel";
import { Accordion } from "@/components/ui/Accordion.client";
import { WEAVE_STORIES } from "@/content/editorial";
import { apiClient } from "@/lib/api";
import {
  catalogParamsToApi,
  CatalogFacets,
  parseCatalogParams,
} from "@/lib/catalog-params";
import { PaginatedResponse, Saree, WEAVE_LABELS, WeaveType } from "@/lib/types";

interface PageProps {
  params: Promise<{ slug: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const story = WEAVE_STORIES[slug];
  if (!story) return { title: "Collection Not Found" };

  const label = WEAVE_LABELS[slug as WeaveType] || story.title;
  const title = `${label} Sarees`;
  const description = story.intro;

  return {
    title,
    description,
    alternates: { canonical: `/collections/${slug}` },
    openGraph: { type: "website", title, description, url: `/collections/${slug}` },
  };
}

async function getSarees(
  apiParams: ReturnType<typeof catalogParamsToApi>
): Promise<PaginatedResponse<Saree[]> | null> {
  try {
    return await apiClient.get<PaginatedResponse<Saree[]>>("/api/sarees", apiParams);
  } catch {
    return null;
  }
}

const EMPTY_PAGINATION = { page: 1, limit: 12, total: 0, pages: 0 };

async function getFacets(apiParams: ReturnType<typeof catalogParamsToApi>) {
  try {
    const res = await apiClient.get<{ success: boolean; data: CatalogFacets }>(
      "/api/sarees/facets",
      {
        search: apiParams.search as string | undefined,
        weave: apiParams.weave as string | undefined,
        occasion: apiParams.occasion as string | undefined,
        minPrice: apiParams.minPrice as string | undefined,
        maxPrice: apiParams.maxPrice as string | undefined,
        color: apiParams.color as string | undefined,
        fabric: apiParams.fabric as string | undefined,
        newArrival: apiParams.newArrival as string | undefined,
        inStock: apiParams.inStock as string | undefined,
        blouseIncluded: apiParams.blouseIncluded as string | undefined,
      }
    );
    return res.data;
  } catch {
    return {
      weaves: [],
      occasions: [],
      colors: [],
      fabrics: [],
      priceRange: { min: 0, max: 0 },
    };
  }
}

export default async function CollectionPage({ params, searchParams }: PageProps) {
  const { slug } = await params;
  const story = WEAVE_STORIES[slug];

  if (!story) {
    notFound();
  }

  const raw = await searchParams;
  const params_parsed = parseCatalogParams(raw);
  const lockedWeave = slug as WeaveType;
  const catalogParams = { ...params_parsed, weave: lockedWeave };
  const apiParams = catalogParamsToApi(catalogParams);

  const [result, facets] = await Promise.all([getSarees(apiParams), getFacets(apiParams)]);
  const loadError = result === null;
  const sarees = result?.data ?? [];
  const pagination = result?.pagination ?? EMPTY_PAGINATION;
  const weaveLabel = WEAVE_LABELS[lockedWeave] || story.title;
  const basePath = `/collections/${slug}`;

  return (
    <>
      <CollectionHero story={story} />

      <CraftStoryPanel story={story.intro} origin={story.origin} title={`The ${weaveLabel} Weave`} />

      <Container className="py-12 md:py-16">
        <CatalogShell
            sarees={sarees}
            params={catalogParams}
            facets={facets}
            basePath={basePath}
            lockedWeave={lockedWeave}
            pagination={pagination}
            title={`Curated ${weaveLabel} Sarees`}
            subtitle={loadError ? undefined : `${pagination.total} pieces`}
            loadError={loadError}
            showHeader
          />
      </Container>

      <Container className="pb-16 md:pb-20">
        <h2 className="text-title mb-6 text-ink">About the weave</h2>
        <Accordion
          items={[
            { id: "history", title: "History", content: <p>{story.history}</p> },
            { id: "technique", title: "Technique", content: <p>{story.technique}</p> },
            { id: "care", title: "Care guide", content: <p>{story.care}</p> },
          ]}
        />
      </Container>
    </>
  );
}
