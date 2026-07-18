import { OccasionCurator } from "@/features/home/components/OccasionCurator";
import { apiClient } from "@/lib/api";
import { CatalogFacets } from "@/lib/catalog-params";

async function getOccasionCounts(): Promise<Record<string, number>> {
  try {
    const res = await apiClient.get<{ success: boolean; data: CatalogFacets }>("/api/sarees/facets");
    return Object.fromEntries(res.data.occasions.map((o) => [o.value, o.count]));
  } catch {
    return {};
  }
}

export async function OccasionCuratorSection() {
  const counts = await getOccasionCounts();
  return <OccasionCurator counts={counts} />;
}
