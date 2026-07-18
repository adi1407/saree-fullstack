"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useParams } from "next/navigation";
import { ExternalLink } from "lucide-react";
import { apiClient } from "@/lib/api";
import { ApiResponse, Order, OrderStatus } from "@/lib/types";
import { formatPrice } from "@/lib/utils";
import { OrderStatusBadge } from "@/features/orders/components/OrderStatusBadge";
import { Button } from "@/components/ui/Button";

export default function AdminOrderDetailPage() {
  const params = useParams();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [error, setError] = useState("");

  function load() {
    return apiClient
      .get<ApiResponse<Order>>(`/api/admin/orders/${params.id}`)
      .then((res) => setOrder(res.data));
  }

  useEffect(() => {
    load()
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [params.id]);

  async function updateStatus(status: OrderStatus) {
    setUpdating(true);
    setError("");
    try {
      const res = await apiClient.patch<ApiResponse<Order>>(`/api/admin/orders/${params.id}/status`, {
        status,
      });
      setOrder(res.data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Update failed");
    } finally {
      setUpdating(false);
    }
  }

  async function createShipment() {
    setUpdating(true);
    setError("");
    try {
      const res = await apiClient.post<ApiResponse<Order>>(`/api/admin/orders/${params.id}/ship`);
      setOrder(res.data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Shipment failed");
    } finally {
      setUpdating(false);
    }
  }

  if (loading) return <p className="text-text-muted">Loading order...</p>;
  if (error && !order) return <p className="text-error">{error}</p>;
  if (!order) return <p className="text-error">Order not found</p>;

  const customer =
    typeof order.userId === "object" && order.userId !== null ? order.userId : null;

  return (
    <div>
      <Link href="/admin/orders" className="text-small text-secondary hover:underline">
        ← Back to orders
      </Link>

      <div className="mt-4 flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-chapter text-ink">{order.orderNumber}</h1>
          <p className="mt-1 text-small text-text-muted">
            {new Date(order.createdAt).toLocaleString("en-IN")}
          </p>
        </div>
        <OrderStatusBadge status={order.status} />
      </div>

      {error && <p className="mt-2 text-small text-error">{error}</p>}

      <div className="mt-6 flex flex-wrap gap-2">
        {(["paid", "processing", "shipped", "delivered", "cancelled"] as OrderStatus[]).map(
          (s) => (
            <Button
              key={s}
              size="sm"
              variant={order.status === s ? "primary" : "outline"}
              disabled={updating}
              onClick={() => updateStatus(s)}
            >
              {s}
            </Button>
          )
        )}
        {!order.awb && order.status !== "cancelled" && order.status !== "pending_payment" && (
          <Button size="sm" variant="outline" disabled={updating} onClick={createShipment}>
            Create Shipment
          </Button>
        )}
      </div>

      {order.awb && (
        <div className="mt-6 rounded border border-border bg-surface p-4 text-small">
          <p className="font-medium">Shipment</p>
          <p className="mt-1 text-text-muted">AWB: {order.awb}</p>
          {order.trackingUrl && (
            <a
              href={order.trackingUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-2 inline-flex items-center gap-1 text-secondary hover:underline"
            >
              Tracking link <ExternalLink className="h-3 w-3" />
            </a>
          )}
        </div>
      )}

      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        <div className="border border-border bg-surface p-5">
          <h2 className="text-title">Customer</h2>
          {customer ? (
            <dl className="mt-3 space-y-1 text-small">
              <dd className="font-medium">{customer.name}</dd>
              <dd className="text-text-muted">{customer.email}</dd>
              <dd className="text-text-muted">{customer.phone}</dd>
            </dl>
          ) : (
            <p className="mt-2 text-small text-text-muted">—</p>
          )}
        </div>

        <div className="border border-border bg-surface p-5">
          <h2 className="text-title">Shipping Address</h2>
          <div className="mt-3 text-small text-text-muted">
            <p className="font-medium text-ink">{order.shippingAddress.name}</p>
            <p>{order.shippingAddress.line1}</p>
            <p>
              {order.shippingAddress.city}, {order.shippingAddress.state} —{" "}
              {order.shippingAddress.pincode}
            </p>
            <p>{order.shippingAddress.phone}</p>
          </div>
        </div>
      </div>

      <div className="mt-6 border border-border bg-surface p-5">
        <h2 className="text-title">Items</h2>
        <ul className="mt-4 space-y-3">
          {order.items.map((item) => (
            <li key={item.sareeId} className="flex gap-3 text-small">
              <div className="relative h-16 w-12 bg-background-alt">
                {item.image && (
                  <Image src={item.image} alt="" fill className="object-cover" sizes="48px" />
                )}
              </div>
              <div className="flex-1">
                <p className="font-medium">{item.name}</p>
                <p className="text-text-muted">
                  Qty {item.qty} · {formatPrice(item.price * item.qty)}
                </p>
              </div>
            </li>
          ))}
        </ul>
        <div className="mt-4 border-t border-border pt-4 text-small">
          <div className="flex justify-between">
            <span>Subtotal</span>
            <span className="tabular-nums">{formatPrice(order.amounts.subtotal)}</span>
          </div>
          <div className="flex justify-between">
            <span>Shipping</span>
            <span className="tabular-nums">
              {order.amounts.shipping === 0 ? "Free" : formatPrice(order.amounts.shipping)}
            </span>
          </div>
          <div className="mt-2 flex justify-between font-medium">
            <span>Total</span>
            <span className="text-primary tabular-nums">{formatPrice(order.amounts.total)}</span>
          </div>
        </div>
      </div>

      {(order.razorpayOrderId || order.razorpayPaymentId) && (
        <div className="mt-6 border border-border bg-surface p-5 text-small">
          <h2 className="text-title">Payment</h2>
          {order.razorpayOrderId && (
            <p className="mt-2 text-text-muted">Razorpay Order: {order.razorpayOrderId}</p>
          )}
          {order.razorpayPaymentId && (
            <p className="text-text-muted">Payment ID: {order.razorpayPaymentId}</p>
          )}
        </div>
      )}
    </div>
  );
}
