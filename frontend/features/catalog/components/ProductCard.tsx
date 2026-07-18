"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { Saree } from "@/lib/types";
import { WeaveChip } from "@/components/ui/WeaveChip";
import { PriceDisplay } from "@/components/ui/PriceDisplay";
import { Badge } from "@/components/ui/Badge";

interface ProductCardProps {
  saree: Saree;
}

export function ProductCard({ saree }: ProductCardProps) {
  const primary = saree.images.gallery[0];
  const secondary = saree.images.gallery[1];
  const [hovered, setHovered] = useState(false);

  return (
    <Link
      href={`/sarees/${saree.slug}`}
      className="group block"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div className="relative aspect-[3/4] overflow-hidden bg-background-alt">
        {primary ? (
          <>
            <Image
              src={primary}
              alt={saree.name}
              fill
              className={`object-cover transition-all duration-[800ms] ease-[var(--ease-luxury)] ${
                hovered && secondary ? "opacity-0" : "opacity-100 group-hover:scale-[1.04]"
              }`}
              sizes="(max-width: 768px) 50vw, 25vw"
            />
            {secondary && (
              <Image
                src={secondary}
                alt=""
                fill
                aria-hidden
                className={`object-cover transition-all duration-[800ms] ease-[var(--ease-luxury)] ${
                  hovered ? "scale-[1.04] opacity-100" : "opacity-0"
                }`}
                sizes="(max-width: 768px) 50vw, 25vw"
              />
            )}
          </>
        ) : (
          <div className="flex h-full items-center justify-center text-text-muted">No image</div>
        )}

        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-ink/50 via-transparent to-transparent opacity-0 transition-opacity duration-[600ms] group-hover:opacity-100" />

        {saree.isNewArrival && (
          <Badge variant="new" className="absolute left-3 top-3">
            New
          </Badge>
        )}

        <span className="absolute bottom-3 left-3 translate-y-2 text-eyebrow text-secondary opacity-0 transition-all duration-[600ms] ease-[var(--ease-luxury)] group-hover:translate-y-0 group-hover:opacity-100">
          View →
        </span>
      </div>

      <div className="mt-3 border border-transparent p-1 transition-colors duration-300 group-hover:border-secondary/30">
        <WeaveChip weave={saree.weave} className="mb-2" />
        <h3 className="text-card-title-sm leading-snug text-ink line-clamp-2">{saree.name}</h3>
        <PriceDisplay price={saree.price} compareAtPrice={saree.compareAtPrice} className="mt-1 text-body" />
      </div>
    </Link>
  );
}
