import type { Metadata } from "next";
import { Container } from "@/components/ui/Container";
import { CatalogShell } from "@/features/catalog/components/CatalogShell.client";
import { apiClient } from "@/lib/api";
import {
  catalogParamsToApi,
  CatalogFacets,
  parseCatalogParams,
} from "@/lib/catalog-params";
import { PaginatedResponse, Saree, WEAVE_LABELS, WeaveType } from "@/lib/types";

interface PageProps {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

export const metadata: Metadata = {
  title: "All Sarees",
  description:
    "Explore our full collection of handwoven sarees — Banarasi, Kanjeevaram, Chanderi, Maheshwari, Bandhani and Patola, curated for every occasion.",
  alternates: { canonical: "/sarees" },
};

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

function getTitle(params: ReturnType<typeof parseCatalogParams>): string {
  if (params.search) return `Results for "${params.search}"`;
  if (params.weave) return `${WEAVE_LABELS[params.weave as WeaveType] || params.weave} Sarees`;
  return "All Sarees";
}

export default async function SareesPage({ searchParams }: PageProps) {
  const raw = await searchParams;
  const params = parseCatalogParams(raw);
  const apiParams = catalogParamsToApi(params);

  const [result, facets] = await Promise.all([getSarees(apiParams), getFacets(apiParams)]);
  const loadError = result === null;
  const sarees = result?.data ?? [];
  const pagination = result?.pagination ?? EMPTY_PAGINATION;

  return (
    <Container className="py-10 md:py-16">
      <CatalogShell
        sarees={sarees}
        params={params}
        facets={facets}
        basePath="/sarees"
        pagination={pagination}
        title={getTitle(params)}
        subtitle={loadError ? undefined : `${pagination.total} sarees`}
        loadError={loadError}
      />
    </Container>
  );
}
