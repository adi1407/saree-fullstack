"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { useToast } from "@/components/ui/ToastProvider.client";
import { apiClient } from "@/lib/api";

interface AddToCartProps {
  sareeId: string;
  inventory: number;
}

export function AddToCart({ sareeId, inventory }: AddToCartProps) {
  const router = useRouter();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleAdd() {
    setLoading(true);
    setError("");
    try {
      await apiClient.post("/api/cart/items", { sareeId, qty: 1 });
      router.refresh();
      toast("Added to your bag", {
        label: "View bag",
        onClick: () => router.push("/cart"),
      });
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to add";
      if (message.includes("Authentication") || message.includes("401")) {
        router.push(`/login?next=/sarees`);
      } else {
        setError(message);
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      {inventory <= 3 && inventory > 0 && (
        <p className="mb-2 text-small text-accent-vibrant">Only {inventory} left</p>
      )}
      {inventory === 0 ? (
        <Button disabled className="w-full" size="lg">
          Out of Stock
        </Button>
      ) : (
        <Button onClick={handleAdd} loading={loading} className="w-full" size="lg">
          Add to Bag
        </Button>
      )}
      {error && <p className="mt-2 text-small text-error">{error}</p>}
    </div>
  );
}
