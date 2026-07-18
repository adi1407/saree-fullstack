import Image from "next/image";
import type { Artisan } from "@/content/editorial";

interface ArtisanCardProps {
  artisan: Artisan;
}

export function ArtisanCard({ artisan }: ArtisanCardProps) {
  return (
    <article className="group border border-border bg-surface transition-shadow duration-[600ms] hover:shadow-[var(--shadow-soft)]">
      <div className="relative aspect-[4/5] overflow-hidden bg-background-alt">
        <Image
          src={artisan.image}
          alt={artisan.name}
          fill
          className="object-cover transition-transform duration-[800ms] ease-[var(--ease-luxury)] group-hover:scale-[1.03]"
          sizes="(max-width: 768px) 100vw, 33vw"
        />
      </div>
      <div className="border-t border-secondary/30 p-5">
        <p className="text-card-label text-secondary">{artisan.craft}</p>
        <h3 className="text-card-title mt-1 text-ink">{artisan.name}</h3>
        <p className="text-small mt-1 text-text-muted">{artisan.cluster}</p>
        <p className="text-card-body mt-3 text-text-muted">{artisan.bio}</p>
      </div>
    </article>
  );
}
