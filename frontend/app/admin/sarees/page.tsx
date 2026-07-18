"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { ExternalLink, Eye, EyeOff, Trash2, Pencil } from "lucide-react";
import { apiClient } from "@/lib/api";
import { ApiResponse, PaginatedResponse, Saree } from "@/lib/types";
import { formatPrice } from "@/lib/utils";
import { Button } from "@/components/ui/Button";
import { WEAVE_LABELS } from "@/lib/types";

export default function AdminSareesPage() {
  const [sarees, setSarees] = useState<Saree[]>([]);
  const [loading, setLoading] = useState(true);

  function load() {
    apiClient
      .get<PaginatedResponse<Saree[]>>("/api/admin/sarees", { limit: 50 })
      .then((res) => setSarees(res.data))
      .finally(() => setLoading(false));
  }

  useEffect(() => {
    load();
  }, []);

  async function togglePublish(id: string) {
    await apiClient.patch(`/api/admin/sarees/${id}/toggle-publish`);
    load();
  }

  async function remove(id: string, name: string) {
    if (!confirm(`Delete "${name}"?`)) return;
    await apiClient.delete(`/api/admin/sarees/${id}`);
    load();
  }

  if (loading) return <p className="text-text-muted">Loading sarees...</p>;

  return (
    <div>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-chapter text-ink">Sarees</h1>
          <p className="text-text-muted">{sarees.length} in catalog</p>
        </div>
        <Link href="/admin/sarees/new" className="w-full sm:w-auto">
          <Button className="w-full sm:w-auto">+ Add Saree</Button>
        </Link>
      </div>

      <div className="mt-6 space-y-4 md:hidden">
        {sarees.map((s) => (
          <article key={s._id} className="border border-border bg-surface p-4">
            <div className="flex gap-3">
              <div className="relative h-20 w-16 shrink-0 overflow-hidden bg-background-alt">
                {s.images.gallery[0] && (
                  <Image src={s.images.gallery[0]} alt="" fill className="object-cover" sizes="64px" />
                )}
              </div>
              <div className="min-w-0 flex-1">
                <p className="font-medium text-ink line-clamp-2">{s.name}</p>
                <p className="text-small text-text-muted">{s.sku}</p>
                <div className="mt-2 flex flex-wrap gap-2 text-small">
                  <span className="capitalize">{WEAVE_LABELS[s.weave]}</span>
                  <span className="text-text-muted">·</span>
                  <span className="tabular-nums">{formatPrice(s.price)}</span>
                  <span className="text-text-muted">·</span>
                  <span>Stock {s.inventory}</span>
                </div>
                <span
                  className={`mt-2 inline-block px-2 py-0.5 text-eyebrow ${
                    s.isPublished ? "bg-accent/10 text-accent" : "bg-background-alt text-text-muted"
                  }`}
                >
                  {s.isPublished ? "Live" : "Draft"}
                </span>
              </div>
            </div>
            <div className="mt-4 flex flex-wrap gap-2">
              <Link href={`/admin/sarees/${s._id}/edit`}>
                <Button size="sm" variant="outline">
                  Edit
                </Button>
              </Link>
              <Button size="sm" variant="outline" onClick={() => togglePublish(s._id)}>
                {s.isPublished ? "Unpublish" : "Publish"}
              </Button>
              {s.isPublished && (
                <Link href={`/sarees/${s.slug}`} target="_blank">
                  <Button size="sm" variant="ghost">
                    View
                  </Button>
                </Link>
              )}
              <Button size="sm" variant="ghost" onClick={() => remove(s._id, s.name)}>
                Delete
              </Button>
            </div>
          </article>
        ))}
      </div>

      <div className="mt-6 hidden overflow-x-auto md:block">
        <table className="w-full min-w-[700px] border-collapse text-small">
          <thead>
            <tr className="border-b border-border text-left text-eyebrow text-text-muted">
              <th className="pb-3 pr-4">Product</th>
              <th className="pb-3 pr-4">Weave</th>
              <th className="pb-3 pr-4">Price</th>
              <th className="pb-3 pr-4">Stock</th>
              <th className="pb-3 pr-4">Status</th>
              <th className="pb-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {sarees.map((s) => (
              <tr key={s._id} className="border-b border-border/60">
                <td className="py-3 pr-4">
                  <div className="flex items-center gap-3">
                    <div className="relative h-14 w-11 overflow-hidden bg-background-alt">
                      {s.images.gallery[0] && (
                        <Image src={s.images.gallery[0]} alt="" fill className="object-cover" sizes="44px" />
                      )}
                    </div>
                    <div>
                      <p className="font-medium text-ink line-clamp-1">{s.name}</p>
                      <p className="text-small text-text-muted">{s.sku}</p>
                    </div>
                  </div>
                </td>
                <td className="py-3 pr-4 capitalize">{WEAVE_LABELS[s.weave]}</td>
                <td className="py-3 pr-4 tabular-nums">{formatPrice(s.price)}</td>
                <td className="py-3 pr-4">{s.inventory}</td>
                <td className="py-3 pr-4">
                  <span
                    className={`inline-block px-2 py-0.5 text-small uppercase ${
                      s.isPublished ? "bg-accent/10 text-accent" : "bg-background-alt text-text-muted"
                    }`}
                  >
                    {s.isPublished ? "Live" : "Draft"}
                  </span>
                </td>
                <td className="py-3">
                  <div className="flex items-center gap-2">
                    {s.isPublished && (
                      <Link href={`/sarees/${s.slug}`} target="_blank" className="text-text-muted hover:text-primary">
                        <ExternalLink className="h-4 w-4" />
                      </Link>
                    )}
                    <Link
                      href={`/admin/sarees/${s._id}/edit`}
                      className="text-text-muted hover:text-primary"
                      title="Edit"
                    >
                      <Pencil className="h-4 w-4" />
                    </Link>
                    <button
                      type="button"
                      onClick={() => togglePublish(s._id)}
                      className="text-text-muted hover:text-primary"
                      title={s.isPublished ? "Unpublish" : "Publish"}
                    >
                      {s.isPublished ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                    <button
                      type="button"
                      onClick={() => remove(s._id, s.name)}
                      className="text-text-muted hover:text-error"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
