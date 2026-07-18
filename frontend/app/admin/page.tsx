"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Package, Users, ShoppingBag, AlertTriangle } from "lucide-react";
import { apiClient } from "@/lib/api";
import { ApiResponse } from "@/lib/types";
import { Button } from "@/components/ui/Button";
import { formatPrice } from "@/lib/utils";

interface Stats {
  sareeCount: number;
  publishedCount: number;
  orderCount: number;
  customerCount: number;
  revenue: number;
  lowStock: { name: string; inventory: number; slug: string }[];
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<Stats | null>(null);

  useEffect(() => {
    apiClient.get<ApiResponse<Stats>>("/api/admin/stats").then((res) => setStats(res.data));
  }, []);

  return (
    <div>
      <h1 className="text-chapter text-ink">Dashboard</h1>
      <p className="mt-1 text-text-muted">Manage your saree collection</p>

      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        {[
          { label: "Total Sarees", value: stats?.sareeCount, icon: Package },
          { label: "Published", value: stats?.publishedCount, icon: ShoppingBag },
          { label: "Orders", value: stats?.orderCount, icon: ShoppingBag },
          { label: "Revenue", value: stats?.revenue != null ? formatPrice(stats.revenue) : undefined, icon: ShoppingBag },
          { label: "Customers", value: stats?.customerCount, icon: Users },
        ].map(({ label, value, icon: Icon }) => (
          <div key={label} className="border border-border bg-surface p-5">
            <Icon className="h-5 w-5 text-secondary" />
            <p className="mt-3 text-chapter text-ink">{value ?? "—"}</p>
            <p className="text-small text-text-muted">{label}</p>
          </div>
        ))}
      </div>

      <div className="mt-8 flex flex-wrap gap-3">
        <Link href="/admin/sarees/new">
          <Button size="lg">+ Add New Saree</Button>
        </Link>
        <Link href="/admin/sarees">
          <Button size="lg" variant="outline">View All Sarees</Button>
        </Link>
        <Link href="/admin/orders">
          <Button size="lg" variant="outline">Manage Orders</Button>
        </Link>
        <Link href="/">
          <Button size="lg" variant="ghost">Preview Store →</Button>
        </Link>
      </div>

      {stats && stats.lowStock.length > 0 && (
        <div className="mt-8 border border-accent-vibrant/30 bg-accent-vibrant/5 p-4">
          <div className="flex items-center gap-2 text-accent-vibrant">
            <AlertTriangle className="h-4 w-4" />
            <p className="text-small font-medium">Low stock alert</p>
          </div>
          <ul className="mt-2 space-y-1 text-small text-text-muted">
            {stats.lowStock.map((s) => (
              <li key={s.slug}>
                {s.name} — {s.inventory} left
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="mt-10 rounded border border-border bg-surface p-6">
        <h2 className="text-title">Quick start</h2>
        <ol className="mt-3 list-decimal space-y-2 pl-5 text-small text-text-muted">
          <li>Login as admin: <strong>admin@sareeshop.com</strong> / password123</li>
          <li>Click <strong>Add New Saree</strong> and fill the form</li>
          <li>Pick model images from presets or paste URLs</li>
          <li>Check <strong>Publish on store</strong> and save</li>
          <li>Open the store homepage — your saree appears instantly</li>
        </ol>
      </div>
    </div>
  );
}
