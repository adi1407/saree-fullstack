"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { apiClient } from "@/lib/api";
import { ApiResponse, Order } from "@/lib/types";
import { formatPrice } from "@/lib/utils";
import { OrderStatusBadge } from "@/features/orders/components/OrderStatusBadge";

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    apiClient
      .get<ApiResponse<Order[]>>("/api/orders")
      .then((res) => setOrders(res.data))
      .catch((err) => {
        if (err.message.includes("401")) {
          window.location.href = "/login?next=/orders";
        } else {
          setError(err.message);
        }
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return <Container className="py-20 text-center text-text-muted">Loading orders...</Container>;
  }

  if (error) {
    return <Container className="py-20 text-center text-error">{error}</Container>;
  }

  if (orders.length === 0) {
    return (
      <Container className="py-20 text-center">
        <h1 className="text-chapter text-ink">Your Orders</h1>
        <p className="mt-2 text-text-muted">You haven&apos;t placed any orders yet.</p>
        <Link href="/sarees" className="mt-6 inline-block">
          <Button>Shop Sarees</Button>
        </Link>
      </Container>
    );
  }

  return (
    <Container className="py-10 md:py-16">
      <h1 className="text-chapter text-ink">Your Orders</h1>
      <div className="mt-8 space-y-4">
        {orders.map((order) => (
          <Link
            key={order._id}
            href={`/orders/${order._id}`}
            className="block border border-border bg-surface p-5 transition-colors hover:border-secondary"
          >
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <p className="font-medium text-ink">{order.orderNumber}</p>
                <p className="mt-1 text-small text-text-muted">
                  {new Date(order.createdAt).toLocaleDateString("en-IN", {
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                  })}
                  {" · "}
                  {order.items.length} item{order.items.length !== 1 ? "s" : ""}
                </p>
              </div>
              <div className="text-right">
                <OrderStatusBadge status={order.status} />
                <p className="mt-2 font-medium text-primary tabular-nums">
                  {formatPrice(order.amounts.total)}
                </p>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </Container>
  );
}
