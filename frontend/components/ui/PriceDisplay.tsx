import { formatPrice } from "@/lib/utils";
import { cn } from "@/lib/utils";

interface PriceDisplayProps {
  price: number;
  compareAtPrice?: number;
  className?: string;
}

export function PriceDisplay({ price, compareAtPrice, className }: PriceDisplayProps) {
  return (
    <div className={cn("flex items-baseline gap-2 tabular-nums", className)}>
      <span className="font-medium text-body text-primary">{formatPrice(price)}</span>
      {compareAtPrice && compareAtPrice > price && (
        <span className="text-small text-text-muted line-through">
          {formatPrice(compareAtPrice)}
        </span>
      )}
    </div>
  );
}
