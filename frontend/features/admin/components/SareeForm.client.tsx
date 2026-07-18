"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { apiClient } from "@/lib/api";
import { ApiResponse, Saree, WeaveType, OccasionType } from "@/lib/types";
import { IMAGE_PRESETS, WEAVE_IMAGES } from "@/lib/saree-images";
import { Spin360Uploader, SPIN_FRAME_MIN } from "./Spin360Uploader.client";

const WEAVES: WeaveType[] = ["banarasi", "kanjeevaram", "chanderi", "maheshwari", "bandhani", "patola", "other"];
const OCCASIONS: OccasionType[] = ["wedding", "festive", "office", "puja", "casual"];

const defaultForm = {
  name: "",
  description: "",
  price: "",
  compareAtPrice: "",
  sku: "",
  weave: "banarasi" as WeaveType,
  fabric: "Pure Silk",
  inventory: "5",
  primaryColor: "Crimson",
  secondaryColor: "Gold",
  isPublished: true,
  isNewArrival: true,
  craftStory: "",
  gallery: [
    IMAGE_PRESETS[0].url,
    IMAGE_PRESETS[1].url,
    IMAGE_PRESETS[4].url,
    IMAGE_PRESETS[6].url,
    IMAGE_PRESETS[5].url,
  ] as string[],
  occasion: ["festive"] as OccasionType[],
  spinFrames: [] as string[],
  spinVideo: "",
};

function sareeToForm(saree: Saree) {
  return {
    name: saree.name,
    description: saree.description,
    price: String(saree.price),
    compareAtPrice: saree.compareAtPrice ? String(saree.compareAtPrice) : "",
    sku: saree.sku,
    weave: saree.weave,
    fabric: saree.fabric,
    inventory: String(saree.inventory),
    primaryColor: saree.colors.primary,
    secondaryColor: saree.colors.secondary || "",
    isPublished: saree.isPublished,
    isNewArrival: saree.isNewArrival,
    craftStory: saree.craftStory || "",
    gallery: [...saree.images.gallery],
    occasion: saree.occasion,
    spinFrames: saree.images.spinFrames || [],
    spinVideo: saree.images.spinVideo || "",
  };
}

interface SareeFormProps {
  saree?: Saree;
}

export function SareeForm({ saree }: SareeFormProps) {
  const isEdit = Boolean(saree);
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [form, setForm] = useState(() => (saree ? sareeToForm(saree) : defaultForm));

  function setGalleryIndex(i: number, url: string) {
    const next = [...form.gallery];
    next[i] = url;
    setForm({ ...form, gallery: next });
  }

  function toggleOccasion(o: OccasionType) {
    setForm({
      ...form,
      occasion: form.occasion.includes(o)
        ? form.occasion.filter((x) => x !== o)
        : [...form.occasion, o],
    });
  }

  function applyWeaveImages(weave: WeaveType) {
    const base = WEAVE_IMAGES[weave] || IMAGE_PRESETS[0].url;
    setForm({
      ...form,
      weave,
      gallery: [
        base,
        IMAGE_PRESETS[1].url,
        IMAGE_PRESETS[5].url,
        IMAGE_PRESETS[6].url,
        IMAGE_PRESETS[4].url,
      ],
    });
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    const gallery = form.gallery.filter(Boolean);
    if (gallery.length < 5) {
      setError("Please add all 5 product images (model, detail, fabric views)");
      setLoading(false);
      return;
    }

    try {
      const payload = {
        name: form.name,
        description: form.description,
        price: Number(form.price),
        compareAtPrice: form.compareAtPrice ? Number(form.compareAtPrice) : undefined,
        sku: form.sku,
        weave: form.weave,
        occasion: form.occasion,
        fabric: form.fabric,
        blouseIncluded: true,
        colors: { primary: form.primaryColor, secondary: form.secondaryColor || undefined },
        images: {
          gallery,
          ...(form.spinVideo ? { spinVideo: form.spinVideo } : {}),
          ...(form.spinFrames.length >= SPIN_FRAME_MIN && !form.spinVideo
            ? { spinFrames: form.spinFrames }
            : {}),
        },
        inventory: Number(form.inventory),
        isPublished: form.isPublished,
        isNewArrival: form.isNewArrival,
        craftStory: form.craftStory || undefined,
      };

      if (isEdit && saree) {
        const res = await apiClient.patch<ApiResponse<Saree>>(`/api/admin/sarees/${saree._id}`, payload);
        setSuccess(`"${res.data.name}" updated!`);
      } else {
        const res = await apiClient.post<ApiResponse<Saree>>("/api/admin/sarees", payload);
        setSuccess(`"${res.data.name}" created! View it on the store.`);
      }
      setTimeout(() => router.push("/admin/sarees"), 1500);
    } catch (err) {
      setError(err instanceof Error ? err.message : `Failed to ${isEdit ? "update" : "create"} saree`);
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-3xl space-y-6">
      <div className="grid gap-4 md:grid-cols-2">
        <Input
          id="name"
          label="Saree Name *"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          placeholder="Crimson Banarasi Silk with Gold Zari"
          required
        />
        <Input
          id="sku"
          label="SKU *"
          value={form.sku}
          onChange={(e) => setForm({ ...form, sku: e.target.value })}
          placeholder="SAR-BAN-007"
          required
        />
      </div>

      <div>
        <label className="mb-1.5 block text-small text-text-muted">Description *</label>
        <textarea
          className="w-full border border-border bg-surface px-4 py-2.5 text-small outline-none focus:border-secondary"
          rows={3}
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
          required
        />
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Input
          id="price"
          label="Price (₹) *"
          type="number"
          value={form.price}
          onChange={(e) => setForm({ ...form, price: e.target.value })}
          required
        />
        <Input
          id="compareAtPrice"
          label="Compare at Price (₹)"
          type="number"
          value={form.compareAtPrice}
          onChange={(e) => setForm({ ...form, compareAtPrice: e.target.value })}
        />
        <Input
          id="inventory"
          label="Inventory *"
          type="number"
          value={form.inventory}
          onChange={(e) => setForm({ ...form, inventory: e.target.value })}
          required
        />
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div>
          <label className="mb-1.5 block text-small text-text-muted">Weave *</label>
          <select
            className="w-full border border-border bg-surface px-4 py-2.5 text-small"
            value={form.weave}
            onChange={(e) => applyWeaveImages(e.target.value as WeaveType)}
          >
            {WEAVES.map((w) => (
              <option key={w} value={w}>{w}</option>
            ))}
          </select>
        </div>
        <Input
          id="fabric"
          label="Fabric"
          value={form.fabric}
          onChange={(e) => setForm({ ...form, fabric: e.target.value })}
        />
      </div>

      <div>
        <label className="mb-2 block text-small text-text-muted">Occasions</label>
        <div className="flex flex-wrap gap-2">
          {OCCASIONS.map((o) => (
            <button
              key={o}
              type="button"
              onClick={() => toggleOccasion(o)}
              className={`border px-3 py-1 text-eyebrow ${
                form.occasion.includes(o)
                  ? "border-primary bg-primary text-white"
                  : "border-border text-text-muted"
              }`}
            >
              {o}
            </button>
          ))}
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Input
          id="primaryColor"
          label="Primary Color"
          value={form.primaryColor}
          onChange={(e) => setForm({ ...form, primaryColor: e.target.value })}
        />
        <Input
          id="secondaryColor"
          label="Secondary Color"
          value={form.secondaryColor}
          onChange={(e) => setForm({ ...form, secondaryColor: e.target.value })}
        />
      </div>

      {/* Images — 5 required + auto 360° from gallery */}
      <div className="rounded border border-border bg-background-alt p-4">
        <p className="mb-1 text-small font-medium">Product Images (5 required)</p>
        <p className="mb-3 text-small text-text-muted">
          5 static product photos for gallery & zoom.
        </p>
        <div className="mb-4 flex flex-wrap gap-2">
          {IMAGE_PRESETS.map((preset) => (
            <button
              key={preset.url}
              type="button"
              onClick={() => setGalleryIndex(0, preset.url)}
              className="relative h-16 w-12 overflow-hidden border border-border hover:border-secondary"
              title={preset.label}
            >
              <Image src={preset.url} alt={preset.label} fill className="object-cover" sizes="48px" />
            </button>
          ))}
        </div>
        <div className="grid gap-3 sm:grid-cols-2">
          {form.gallery.map((url, i) => (
            <div key={i} className="flex gap-2">
              <div className="relative h-20 w-16 shrink-0 overflow-hidden bg-surface">
                {url && <Image src={url} alt="" fill className="object-cover" sizes="64px" />}
              </div>
              <Input
                id={`img-${i}`}
                label={`Image ${i + 1}${i === 0 ? " (hero)" : ""}`}
                value={url}
                onChange={(e) => setGalleryIndex(i, e.target.value)}
                placeholder="https://..."
              />
            </div>
          ))}
        </div>
      </div>

      <Spin360Uploader
        frames={form.spinFrames}
        onChange={(urls) => setForm({ ...form, spinFrames: urls, spinVideo: "" })}
      />

      <div className="rounded border border-border bg-background-alt p-4">
        <p className="mb-1 text-small font-medium">OR — Turntable video (recommended)</p>
        <p className="mb-3 text-small text-text-muted">
          Upload an MP4 of the model slowly rotating on a turntable (one full turn).
          Customers drag to see front, sides & back. Best for true all-angle view.
        </p>
        <Input
          id="spinVideo"
          label="360° Video URL (MP4)"
          value={form.spinVideo}
          onChange={(e) =>
            setForm({ ...form, spinVideo: e.target.value, spinFrames: [] })
          }
          placeholder="https://yoursite.com/uploads/spin/rotation.mp4"
        />
        <label className="mt-3 inline-flex cursor-pointer items-center gap-2 text-small text-secondary hover:underline">
          <input
            type="file"
            accept="video/mp4,video/webm"
            className="hidden"
            onChange={async (e) => {
              const file = e.target.files?.[0];
              if (!file) return;
              setLoading(true);
              setError("");
              try {
                const fd = new FormData();
                fd.append("video", file);
                const res = await fetch("/api/admin/upload/spin-video", {
                  method: "POST",
                  credentials: "include",
                  body: fd,
                });
                const data = await res.json();
                if (!res.ok) throw new Error(data.message || "Upload failed");
                setForm({ ...form, spinVideo: data.data.url, spinFrames: [] });
              } catch (err) {
                setError(err instanceof Error ? err.message : "Video upload failed");
              } finally {
                setLoading(false);
                e.target.value = "";
              }
            }}
          />
          Upload turntable MP4
        </label>
      </div>

      <Input
        id="craftStory"
        label="Craft Story (optional)"
        value={form.craftStory}
        onChange={(e) => setForm({ ...form, craftStory: e.target.value })}
      />

      <div className="flex flex-wrap gap-6">
        <label className="flex items-center gap-2 text-small">
          <input
            type="checkbox"
            checked={form.isPublished}
            onChange={(e) => setForm({ ...form, isPublished: e.target.checked })}
          />
          Publish on store immediately
        </label>
        <label className="flex items-center gap-2 text-small">
          <input
            type="checkbox"
            checked={form.isNewArrival}
            onChange={(e) => setForm({ ...form, isNewArrival: e.target.checked })}
          />
          Mark as New Arrival
        </label>
      </div>

      {error && <p className="text-small text-error">{error}</p>}
      {success && <p className="text-small text-accent">{success}</p>}

      <div className="flex gap-3">
        <Button type="submit" disabled={loading} size="lg">
          {loading ? "Saving..." : isEdit ? "Update Saree" : "Add Saree to Store"}
        </Button>
        <Button type="button" variant="outline" onClick={() => router.push("/admin/sarees")}>
          Cancel
        </Button>
      </div>
    </form>
  );
}
