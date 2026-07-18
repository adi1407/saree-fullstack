import { Container } from "@/components/ui/Container";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { HomeNewArrivalsGrid } from "@/features/home/components/HomeNewArrivalsGrid.client";
import { Saree } from "@/lib/types";

interface HomeNewArrivalsProps {
  sarees: Saree[];
}

export function HomeNewArrivals({ sarees }: HomeNewArrivalsProps) {
  if (sarees.length === 0) return null;

  return (
    <section className="relative overflow-hidden py-20 md:py-28">
      <div className="weave-grid pointer-events-none absolute inset-0 opacity-[0.04]" />
      <Container className="relative">
        <SectionHeader
          eyebrow="Just arrived"
          title="New Arrivals"
          subtitle="Fresh from the loom — the latest handwoven pieces, curated weekly from our artisan partners."
          href="/sarees?sort=newest"
          linkLabel="Shop new"
        />
        <HomeNewArrivalsGrid sarees={sarees} />
      </Container>
    </section>
  );
}
