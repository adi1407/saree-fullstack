"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { AddToCart } from "./AddToCart.client";
import { StickyBuyBar } from "./StickyBuyBar.client";
import { useToast } from "@/components/ui/ToastProvider.client";
import { apiClient } from "@/lib/api";

interface ProductBuySectionProps {
  sareeId: string;
  name: string;
  price: number;
  image: string;
  inventory: number;
}

export function ProductBuySection({
  sareeId,
  name,
  price,
  image,
  inventory,
}: ProductBuySectionProps) {
  const router = useRouter();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);

  async function quickAdd() {
    setLoading(true);
    try {
      await apiClient.post("/api/cart/items", { sareeId, qty: 1 });
      router.refresh();
      toast("Added to your bag", { label: "View bag", onClick: () => router.push("/cart") });
    } catch {
      router.push("/login");
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <AddToCart sareeId={sareeId} inventory={inventory} />
      <StickyBuyBar
        name={name}
        price={price}
        image={image}
        inventory={inventory}
        onAddToCart={quickAdd}
        loading={loading}
      />
    </>
  );
}
