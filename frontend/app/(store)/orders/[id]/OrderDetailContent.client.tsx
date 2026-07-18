"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useParams, useSearchParams } from "next/navigation";
import { ExternalLink, CheckCircle } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { apiClient } from "@/lib/api";
import { ApiResponse, Order } from "@/lib/types";
import { formatPrice } from "@/lib/utils";
import {
  OrderStatusBadge,
  ORDER_STATUS_STEPS,
} from "@/features/orders/components/OrderStatusBadge";

export function OrderDetailContent() {
  const params = useParams();
  const searchParams = useSearchParams();
  const success = searchParams.get("success") === "1";
  const isCod = searchParams.get("cod") === "1";
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    apiClient
      .get<ApiResponse<Order>>(`/api/orders/${params.id}`)
      .then((res) => setOrder(res.data))
      .catch((err) => {
        if (err.message.includes("401")) {
          window.location.href = `/login?next=/orders/${params.id}`;
        } else {
          setError(err.message);
        }
      })
      .finally(() => setLoading(false));
  }, [params.id]);

  if (loading) {
    return <Container className="py-20 text-center text-text-muted">Loading order...</Container>;
  }

  if (error || !order) {
    return <Container className="py-20 text-center text-error">{error || "Order not found"}</Container>;
  }

  const currentStepIndex = ORDER_STATUS_STEPS.indexOf(
    ORDER_STATUS_STEPS.includes(order.status as (typeof ORDER_STATUS_STEPS)[number])
      ? (order.status as (typeof ORDER_STATUS_STEPS)[number])
      : "paid"
  );

  return (
    <Container className="py-10 md:py-16">
      {success && (
        <div className="mb-6 flex items-center gap-2 rounded border border-green-200 bg-green-50 px-4 py-3 text-small text-green-800">
          <CheckCircle className="h-5 w-5 shrink-0" />
          <span>
            Thank you! Your order has been placed successfully.
            {isCod && order.paymentMethod === "cod" && (
              <> Pay {formatPrice(order.amounts.total)} in cash when your order is delivered.</>
            )}
          </span>
        </div>
      )}

      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-chapter text-ink">Order {order.orderNumber}</h1>
          <p className="text-small mt-1 text-text-muted">
            Placed on{" "}
            {new Date(order.createdAt).toLocaleDateString("en-IN", {
              day: "numeric",
              month: "long",
              year: "numeric",
            })}
          </p>
        </div>
        <OrderStatusBadge status={order.status} />
      </div>

      {!["pending_payment", "cancelled"].includes(order.status) && (
        <div className="mt-8">
          <h2 className="text-title">Order Status</h2>
          <div className="mt-4 flex flex-wrap gap-2">
            {ORDER_STATUS_STEPS.map((step, i) => (
              <div
                key={step}
                className={`flex items-center gap-2 rounded-full px-3 py-1 text-small ${
                  i <= currentStepIndex ? "bg-secondary/20 text-ink" : "bg-background-alt text-text-muted"
                }`}
              >
                {step.charAt(0).toUpperCase() + step.slice(1)}
              </div>
            ))}
          </div>
        </div>
      )}

      {order.trackingUrl && order.awb && (
        <div className="mt-6 rounded border border-border bg-surface p-4">
          <p className="text-small font-medium">Tracking</p>
          <p className="mt-1 text-small text-text-muted">AWB: {order.awb}</p>
          <a
            href={order.trackingUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-2 inline-flex items-center gap-1 text-small text-secondary hover:underline"
          >
            Track shipment <ExternalLink className="h-3 w-3" />
          </a>
        </div>
      )}

      <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_360px]">
        <div>
          <h2 className="text-title">Items</h2>
          <ul className="mt-4 space-y-4">
            {order.items.map((item) => (
              <li key={item.sareeId} className="flex gap-4 border-b border-border pb-4">
                <div className="relative h-24 w-20 shrink-0 bg-background-alt">
                  {item.image && (
                    <Image src={item.image} alt={item.name} fill className="object-cover" sizes="80px" />
                  )}
                </div>
                <div className="flex-1">
                  <Link href={`/sarees/${item.slug}`} className="text-card-title-sm hover:text-primary">
                    {item.name}
                  </Link>
                  <p className="mt-1 text-small text-text-muted">Qty: {item.qty}</p>
                  <p className="mt-1 tabular-nums">{formatPrice(item.price * item.qty)}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>

        <div className="space-y-6">
          <div className="border border-border bg-surface p-5">
            <h2 className="text-title">Shipping Address</h2>
            <div className="mt-3 text-small text-text-muted">
              <p className="font-medium text-ink">{order.shippingAddress.name}</p>
              <p>{order.shippingAddress.line1}</p>
              {order.shippingAddress.line2 && <p>{order.shippingAddress.line2}</p>}
              <p>
                {order.shippingAddress.city}, {order.shippingAddress.state} —{" "}
                {order.shippingAddress.pincode}
              </p>
              <p>{order.shippingAddress.phone}</p>
            </div>
          </div>

          <div className="border border-border bg-surface p-5">
            <h2 className="text-title">Payment Summary</h2>
            <div className="mt-3 space-y-2 text-small">
              <div className="flex justify-between">
                <span className="text-text-muted">Subtotal</span>
                <span className="tabular-nums">{formatPrice(order.amounts.subtotal)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-text-muted">Shipping</span>
                <span className="tabular-nums">
                  {order.amounts.shipping === 0 ? "Free" : formatPrice(order.amounts.shipping)}
                </span>
              </div>
              <div className="flex justify-between border-t border-border pt-2 font-medium">
                <span>Total</span>
                <span className="text-primary tabular-nums">{formatPrice(order.amounts.total)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Link href="/orders" className="mt-8 inline-block">
        <Button variant="outline">Back to Orders</Button>
      </Link>
    </Container>
  );
}
