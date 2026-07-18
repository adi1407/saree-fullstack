"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import { Minus, Plus, Trash2 } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { apiClient } from "@/lib/api";
import { ApiResponse, CartItem } from "@/lib/types";
import { formatPrice } from "@/lib/utils";

const FREE_SHIPPING_THRESHOLD = 10000;
const SHIPPING_FLAT = 199;

function calcShipping(subtotal: number) {
  return subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : SHIPPING_FLAT;
}

export default function CartPage() {
  const [items, setItems] = useState<CartItem[]>([]);
  const [subtotal, setSubtotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState<string | null>(null);
  const [error, setError] = useState("");

  const loadCart = useCallback(async () => {
    const res = await apiClient.get<ApiResponse<{ items: CartItem[]; subtotal: number }>>("/api/cart");
    setItems(res.data.items);
    setSubtotal(res.data.subtotal);
  }, []);

  useEffect(() => {
    loadCart()
      .catch((err) => {
        if (err.message.includes("Authentication") || err.message.includes("401")) {
          window.location.href = "/login?next=/cart";
        } else {
          setError(err.message);
        }
      })
      .finally(() => setLoading(false));
  }, [loadCart]);

  async function updateQty(sareeId: string, qty: number) {
    setUpdating(sareeId);
    setError("");
    try {
      await apiClient.patch(`/api/cart/items/${sareeId}`, { qty });
      await loadCart();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update cart");
    } finally {
      setUpdating(null);
    }
  }

  if (loading) {
    return (
      <Container className="py-20 text-center text-text-muted">Loading cart...</Container>
    );
  }

  if (error && items.length === 0) {
    return (
      <Container className="py-20 text-center text-error">{error}</Container>
    );
  }

  if (items.length === 0) {
    return (
      <Container className="py-20 text-center">
        <h1 className="text-chapter text-ink">Your bag is empty</h1>
        <p className="mt-2 text-text-muted">Discover our curated collection of handwoven sarees.</p>
        <Link href="/sarees" className="mt-6 inline-block">
          <Button>Shop Sarees</Button>
        </Link>
      </Container>
    );
  }

  const shipping = calcShipping(subtotal);
  const total = subtotal + shipping;

  return (
    <Container className="py-10 md:py-16">
      <h1 className="text-chapter text-ink">Shopping Bag</h1>
      {error && <p className="mt-2 text-small text-error">{error}</p>}

      <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_360px]">
        <div className="space-y-6">
          {items.map((item) => (
            <div key={item.sareeId} className="flex gap-4 border-b border-border pb-6">
              <div className="relative h-40 w-28 shrink-0 overflow-hidden bg-background-alt">
                {item.image && (
                  <Image src={item.image} alt={item.name} fill className="object-cover" sizes="112px" />
                )}
              </div>
              <div className="flex flex-1 flex-col justify-between">
                <div>
                  <Link href={`/sarees/${item.slug}`} className="text-title hover:text-primary">
                    {item.name}
                  </Link>
                  <p className="mt-1 text-small tabular-nums text-text-muted">{formatPrice(item.price)} each</p>
                </div>
                <div className="mt-3 flex items-center justify-between">
                  <div className="flex items-center border border-border">
                    <button
                      type="button"
                      disabled={updating === item.sareeId || item.qty <= 1}
                      onClick={() => updateQty(item.sareeId, item.qty - 1)}
                      className="touch-target px-3 text-text-muted hover:text-primary disabled:opacity-40"
                      aria-label="Decrease quantity"
                    >
                      <Minus className="h-4 w-4" />
                    </button>
                    <span className="min-w-[2.5rem] px-2 text-center text-small tabular-nums">{item.qty}</span>
                    <button
                      type="button"
                      disabled={updating === item.sareeId || item.qty >= item.inventory}
                      onClick={() => updateQty(item.sareeId, item.qty + 1)}
                      className="touch-target px-3 text-text-muted hover:text-primary disabled:opacity-40"
                      aria-label="Increase quantity"
                    >
                      <Plus className="h-4 w-4" />
                    </button>
                  </div>
                  <div className="flex items-center gap-4">
                    <p className="font-medium text-primary tabular-nums">
                      {formatPrice(item.price * item.qty)}
                    </p>
                    <button
                      type="button"
                      disabled={updating === item.sareeId}
                      onClick={() => updateQty(item.sareeId, 0)}
                      className="text-text-muted hover:text-error disabled:opacity-40"
                      aria-label="Remove item"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="h-fit border border-border bg-surface p-6 lg:sticky lg:top-24">
          <h2 className="text-title">Order Summary</h2>
          <div className="mt-4 space-y-2 text-small">
            <div className="flex justify-between">
              <span className="text-text-muted">Subtotal</span>
              <span className="tabular-nums">{formatPrice(subtotal)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-text-muted">Shipping</span>
              <span className="tabular-nums">
                {shipping === 0 ? "Free" : formatPrice(shipping)}
              </span>
            </div>
            {shipping > 0 && (
              <p className="text-small text-text-muted">
                Free shipping on orders above {formatPrice(FREE_SHIPPING_THRESHOLD)}
              </p>
            )}
          </div>
          <div className="mt-4 flex justify-between border-t border-border pt-4 font-medium">
            <span>Total</span>
            <span className="text-primary tabular-nums">{formatPrice(total)}</span>
          </div>
          <Link href="/checkout" className="mt-6 block">
            <Button className="w-full" size="lg">
              Proceed to Checkout
            </Button>
          </Link>
        </div>
      </div>
    </Container>
  );
}
