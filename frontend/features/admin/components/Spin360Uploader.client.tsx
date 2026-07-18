"use client";

import { useState, useRef } from "react";
import { Upload, X, RotateCw, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/Button";

export const SPIN_FRAME_MIN = 24;
export const SPIN_FRAME_MAX = 200;

interface Spin360UploaderProps {
  frames: string[];
  onChange: (urls: string[]) => void;
}

export function Spin360Uploader({ frames, onChange }: Spin360UploaderProps) {
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState("");
  const [error, setError] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  async function handleFiles(fileList: FileList | null) {
    if (!fileList?.length) return;

    const files = Array.from(fileList).slice(0, SPIN_FRAME_MAX);
    if (files.length < SPIN_FRAME_MIN) {
      setError(`Upload at least ${SPIN_FRAME_MIN} images for a smooth 360° spin`);
      return;
    }

    setUploading(true);
    setError("");
    setProgress(`Uploading 0 / ${files.length}...`);

    const formData = new FormData();
    files.forEach((f) => formData.append("frames", f));

    try {
      const res = await fetch("/api/admin/upload/spin-frames", {
        method: "POST",
        credentials: "include",
        body: formData,
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Upload failed");

      onChange(data.data.urls);
      setProgress(`✓ ${data.data.count} frames ready for 360° rotation`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload failed");
      setProgress("");
    } finally {
      setUploading(false);
    }
  }

  function onDrop(e: React.DragEvent) {
    e.preventDefault();
    handleFiles(e.dataTransfer.files);
  }

  return (
    <div className="rounded border border-border bg-surface p-4">
      <div className="mb-2 flex items-center gap-2">
        <RotateCw className="h-4 w-4 text-secondary" />
        <p className="text-small font-medium">360° Spin Images</p>
      </div>
        <p className="mb-3 text-small text-text-muted">
          Upload 24–200 photos from a turntable shoot (model stands still, camera rotates OR model spins on platform).
          Frame 1 = front, middle = sides, last = back. Same outfit in every shot.
        </p>

      <div
        onDragOver={(e) => e.preventDefault()}
        onDrop={onDrop}
        className="flex flex-col items-center justify-center rounded border-2 border-dashed border-border bg-background-alt px-6 py-10 text-center transition-colors hover:border-secondary"
      >
        <Upload className="mb-2 h-8 w-8 text-secondary" />
        <p className="text-small text-text">Drag & drop spin frames here</p>
        <p className="mt-1 text-small text-text-muted">JPEG, PNG, WebP · max {SPIN_FRAME_MAX} files</p>
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          multiple
          className="hidden"
          onChange={(e) => handleFiles(e.target.files)}
        />
        <Button
          type="button"
          variant="outline"
          className="mt-4"
          disabled={uploading}
          onClick={() => inputRef.current?.click()}
        >
          {uploading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Uploading...
            </>
          ) : (
            "Select spin images"
          )}
        </Button>
      </div>

      {progress && <p className="mt-2 text-small text-accent">{progress}</p>}
      {error && <p className="mt-2 text-small text-error">{error}</p>}

      {frames.length > 0 && (
        <div className="mt-4 flex items-center justify-between rounded bg-accent/10 px-3 py-2">
          <span className="text-small text-accent">
            {frames.length} frames loaded — 360° ready
          </span>
          <button
            type="button"
            onClick={() => onChange([])}
            className="text-text-muted hover:text-error"
            aria-label="Clear frames"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      )}

      {frames.length > 0 && (
        <div className="mt-3 flex gap-1 overflow-x-auto pb-1">
          {frames.slice(0, 12).map((url, i) => (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              key={url}
              src={url}
              alt={`Frame ${i + 1}`}
              className="h-12 w-10 shrink-0 object-cover"
            />
          ))}
          {frames.length > 12 && (
            <span className="flex h-12 w-10 shrink-0 items-center justify-center bg-ink text-small text-white">
              +{frames.length - 12}
            </span>
          )}
        </div>
      )}
    </div>
  );
}
