"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { SareeForm } from "@/features/admin/components/SareeForm.client";
import { apiClient } from "@/lib/api";
import { ApiResponse, PaginatedResponse, Saree } from "@/lib/types";

export default function EditSareePage() {
  const params = useParams();
  const [saree, setSaree] = useState<Saree | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    apiClient
      .get<PaginatedResponse<Saree[]>>("/api/admin/sarees", { limit: 100 })
      .then((res) => {
        const found = res.data.find((s) => s._id === params.id);
        if (!found) throw new Error("Saree not found");
        setSaree(found);
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [params.id]);

  if (loading) return <p className="text-text-muted">Loading saree...</p>;
  if (error || !saree) return <p className="text-error">{error || "Saree not found"}</p>;

  return (
    <div>
      <h1 className="text-chapter text-ink">Edit Saree</h1>
      <p className="mt-1 text-text-muted">{saree.name}</p>
      <div className="mt-6">
        <SareeForm saree={saree} />
      </div>
    </div>
  );
}
