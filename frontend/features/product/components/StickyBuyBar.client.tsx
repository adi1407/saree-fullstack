"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/Button";
import { formatPrice } from "@/lib/utils";

interface StickyBuyBarProps {
  name: string;
  price: number;
  image: string;
  inventory: number;
  onAddToCart: () => void;
  loading: boolean;
}

export function StickyBuyBar({
  name,
  price,
  image,
  inventory,
  onAddToCart,
  loading,
}: StickyBuyBarProps) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 480);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  if (!visible || inventory === 0) return null;

  return (
    <div className="safe-bottom fixed bottom-0 left-0 right-0 z-40 border-t border-border bg-surface/95 px-4 py-3 backdrop-blur-md lg:hidden">
      <div className="mx-auto flex max-w-lg items-center gap-3">
        <div className="relative h-12 w-10 shrink-0 overflow-hidden bg-background-alt">
          {image && (
            <Image src={image} alt="" fill className="object-cover" sizes="40px" />
          )}
        </div>
        <div className="min-w-0 flex-1">
          <p className="truncate text-small font-medium text-ink">{name}</p>
          <p className="text-small text-primary tabular-nums">{formatPrice(price)}</p>
        </div>
        <Button size="sm" loading={loading} onClick={onAddToCart} className="shrink-0">
          Add to Bag
        </Button>
      </div>
    </div>
  );
}
