"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { apiClient } from "@/lib/api";
import { ApiResponse, Order, OrderStatus, PaginatedResponse } from "@/lib/types";
import { formatPrice } from "@/lib/utils";
import { OrderStatusBadge } from "@/features/orders/components/OrderStatusBadge";

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<OrderStatus | "">("");

  function load() {
    setLoading(true);
    apiClient
      .get<PaginatedResponse<Order[]>>("/api/admin/orders", {
        limit: 50,
        ...(statusFilter ? { status: statusFilter } : {}),
      })
      .then((res) => setOrders(res.data))
      .finally(() => setLoading(false));
  }

  useEffect(() => {
    load();
  }, [statusFilter]);

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-chapter text-ink">Orders</h1>
          <p className="text-text-muted">{orders.length} orders</p>
        </div>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value as OrderStatus | "")}
          className="border border-border bg-background px-3 py-2 text-small"
        >
          <option value="">All statuses</option>
          <option value="pending_payment">Pending Payment</option>
          <option value="paid">Paid</option>
          <option value="processing">Processing</option>
          <option value="shipped">Shipped</option>
          <option value="delivered">Delivered</option>
          <option value="cancelled">Cancelled</option>
        </select>
      </div>

      {loading ? (
        <p className="mt-6 text-text-muted">Loading orders...</p>
      ) : (
        <>
          <div className="mt-6 space-y-4 md:hidden">
            {orders.map((order) => {
              const customer =
                typeof order.userId === "object" && order.userId !== null ? order.userId : null;
              return (
                <article key={order._id} className="border border-border bg-surface p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="font-medium text-ink">{order.orderNumber}</p>
                      <p className="mt-1 text-small text-text-muted">
                        {new Date(order.createdAt).toLocaleDateString("en-IN")}
                      </p>
                    </div>
                    <OrderStatusBadge status={order.status} />
                  </div>
                  {customer && (
                    <p className="mt-3 text-small text-text-muted">
                      {customer.name} · {customer.email}
                    </p>
                  )}
                  <p className="mt-2 text-small tabular-nums text-ink">{formatPrice(order.amounts.total)}</p>
                  <Link
                    href={`/admin/orders/${order._id}`}
                    className="mt-4 inline-block text-small text-secondary hover:underline"
                  >
                    View order →
                  </Link>
                </article>
              );
            })}
            {orders.length === 0 && (
              <p className="text-center text-text-muted">No orders found.</p>
            )}
          </div>

          <div className="mt-6 hidden overflow-x-auto md:block">
          <table className="w-full min-w-[800px] border-collapse text-small">
            <thead>
              <tr className="border-b border-border text-left text-eyebrow text-text-muted">
                <th className="pb-3 pr-4">Order</th>
                <th className="pb-3 pr-4">Customer</th>
                <th className="pb-3 pr-4">Total</th>
                <th className="pb-3 pr-4">Status</th>
                <th className="pb-3 pr-4">Date</th>
                <th className="pb-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => {
                const customer =
                  typeof order.userId === "object" && order.userId !== null
                    ? order.userId
                    : null;
                return (
                  <tr key={order._id} className="border-b border-border/60">
                    <td className="py-3 pr-4 font-medium">{order.orderNumber}</td>
                    <td className="py-3 pr-4">
                      {customer ? (
                        <div>
                          <p>{customer.name}</p>
                          <p className="text-small text-text-muted">{customer.email}</p>
                        </div>
                      ) : (
                        "—"
                      )}
                    </td>
                    <td className="py-3 pr-4 tabular-nums">{formatPrice(order.amounts.total)}</td>
                    <td className="py-3 pr-4">
                      <OrderStatusBadge status={order.status} />
                    </td>
                    <td className="py-3 pr-4 text-text-muted">
                      {new Date(order.createdAt).toLocaleDateString("en-IN")}
                    </td>
                    <td className="py-3">
                      <Link
                        href={`/admin/orders/${order._id}`}
                        className="text-secondary hover:underline"
                      >
                        View
                      </Link>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          {orders.length === 0 && (
            <p className="mt-6 text-center text-text-muted">No orders found.</p>
          )}
        </div>
        </>
      )}
    </div>
  );
}
