import { cache } from "react";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { Container } from "@/components/ui/Container";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { Badge } from "@/components/ui/Badge";
import { WeaveChip } from "@/components/ui/WeaveChip";
import { PriceDisplay } from "@/components/ui/PriceDisplay";
import { ProductCard } from "@/features/catalog/components/ProductCard";
import { ProductGallery } from "@/features/product/components/ProductGallery.client";
import { ProductBuySection } from "@/features/product/components/ProductBuySection.client";
import { ProductDetailsAccordion } from "@/features/product/components/ProductDetailsAccordion.client";
import { CraftStoryPanel } from "@/features/editorial/components/CraftStoryPanel";
import { Carousel, CarouselItem } from "@/components/ui/Carousel.client";
import { apiClient } from "@/lib/api";
import { ApiResponse, Saree, OCCASION_LABELS, WEAVE_LABELS } from "@/lib/types";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export const dynamic = "force-dynamic";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

// Cached per-request so generateMetadata and the page share a single fetch.
const getSaree = cache(async (slug: string) => {
  try {
    const res = await apiClient.get<ApiResponse<{ saree: Saree; similar: Saree[] }>>(
      `/api/sarees/${slug}`
    );
    return res.data;
  } catch {
    return null;
  }
});

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const data = await getSaree(slug);
  if (!data) return { title: "Saree Not Found" };

  const { saree } = data;
  const title = saree.seoTitle || saree.name;
  const description = saree.seoDescription || saree.description;
  const image = saree.images.gallery[0];
  const url = `${SITE_URL}/sarees/${saree.slug}`;

  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: {
      type: "website",
      title,
      description,
      url,
      images: image ? [{ url: image }] : [],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: image ? [image] : [],
    },
  };
}

export default async function SareeDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const data = await getSaree(slug);
  if (!data) notFound();

  const { saree, similar } = data;
  const url = `${SITE_URL}/sarees/${saree.slug}`;

  const productLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: saree.name,
    description: saree.seoDescription || saree.description,
    image: saree.images.gallery,
    sku: saree.sku,
    category: WEAVE_LABELS[saree.weave],
    brand: { "@type": "Brand", name: "AADIORA" },
    offers: {
      "@type": "Offer",
      url,
      priceCurrency: "INR",
      price: saree.price,
      availability:
        saree.inventory > 0
          ? "https://schema.org/InStock"
          : "https://schema.org/OutOfStock",
    },
  };

  const breadcrumbLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL },
      { "@type": "ListItem", position: 2, name: "Sarees", item: `${SITE_URL}/sarees` },
      { "@type": "ListItem", position: 3, name: saree.name, item: url },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }}
      />
      <Container className="py-8 md:py-12">
        <Breadcrumb
          className="mb-6"
          items={[
            { label: "Home", href: "/" },
            { label: "Sarees", href: "/sarees" },
            { label: saree.name },
          ]}
        />

        <div className="grid gap-10 lg:grid-cols-[58%_42%] lg:gap-12">
          <ProductGallery images={saree.images} name={saree.name} />

          <div className="lg:sticky lg:top-28 lg:self-start">
            <WeaveChip weave={saree.weave} className="mb-3" />
            <h1 className="text-chapter text-ink">{saree.name}</h1>

            <div className="mt-3 flex flex-wrap gap-2">
              {saree.occasion.map((o) => (
                <Badge key={o} variant="muted">
                  {OCCASION_LABELS[o]}
                </Badge>
              ))}
            </div>

            <PriceDisplay
              price={saree.price}
              compareAtPrice={saree.compareAtPrice}
              className="text-title mt-4"
            />

            {saree.blouseIncluded && (
              <p className="mt-2 text-small text-accent">Blouse piece included</p>
            )}

            <p className="mt-4 text-small leading-relaxed text-text-muted">{saree.description}</p>

            <div className="mt-6">
              <ProductBuySection
                sareeId={saree._id}
                name={saree.name}
                price={saree.price}
                image={saree.images.gallery[0] || ""}
                inventory={saree.inventory}
              />
            </div>

            <div className="mt-6 flex flex-wrap gap-x-4 gap-y-1 border-t border-border pt-4 text-eyebrow text-text-muted">
              <span>Authentic handloom</span>
              <span className="text-secondary">·</span>
              <span>Secure checkout</span>
              <span className="text-secondary">·</span>
              <span>Easy returns</span>
            </div>

            <ProductDetailsAccordion saree={saree} />
          </div>
        </div>

        {similar.length > 0 && (
          <section className="mt-16 border-t border-border pt-12">
            <h2 className="text-title mb-6 text-ink">You may also love</h2>
            <div className="hidden grid-cols-2 gap-4 md:grid md:grid-cols-4 md:gap-6">
              {similar.map((s) => (
                <ProductCard key={s._id} saree={s} />
              ))}
            </div>
            <Carousel className="md:hidden">
              {similar.map((s) => (
                <CarouselItem key={s._id} className="w-[72vw]">
                  <ProductCard saree={s} />
                </CarouselItem>
              ))}
            </Carousel>
          </section>
        )}
      </Container>

      {saree.craftStory && (
        <CraftStoryPanel
          title="Craft Heritage"
          story={saree.craftStory}
          origin={WEAVE_LABELS[saree.weave]}
        />
      )}
    </>
  );
}
