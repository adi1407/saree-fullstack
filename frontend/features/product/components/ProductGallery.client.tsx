"use client";

import { useState } from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { SareeImages } from "@/lib/types";
import { ImageZoom } from "./ImageZoom.client";
import { Spin360Viewer } from "./Spin360Viewer.client";
import { Video360Viewer } from "./Video360Viewer.client";

interface ProductGalleryProps {
  images: SareeImages;
  name: string;
}

type ViewMode = "static" | "360video" | "360frames";

export function ProductGallery({ images, name }: ProductGalleryProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [mode, setMode] = useState<ViewMode>("static");

  const staticImages = images.gallery.filter(Boolean);
  const has360Video = Boolean(images.spinVideo);
  const has360Frames = images.spinFrames.length >= 24;
  const has360 = has360Video || has360Frames;

  return (
    <div className="space-y-4">
      {mode === "360video" && has360Video ? (
        <Video360Viewer
          videoUrl={images.spinVideo!}
          poster={images.spinPoster || staticImages[0]}
          alt={name}
        />
      ) : mode === "360frames" && has360Frames ? (
        <Spin360Viewer
          frames={images.spinFrames}
          poster={images.spinPoster || staticImages[0]}
          alt={name}
        />
      ) : (
        <ImageZoom
          src={staticImages[activeIndex] || images.spinPoster}
          alt={`${name} — view ${activeIndex + 1}`}
          priority
        />
      )}

      <div className="flex gap-2 overflow-x-auto pb-1">
        {staticImages.map((src, i) => (
          <button
            key={`${src}-${i}`}
            type="button"
            onClick={() => {
              setMode("static");
              setActiveIndex(i);
            }}
            className={cn(
              "relative h-20 w-16 shrink-0 overflow-hidden border-2 transition-colors",
              mode === "static" && activeIndex === i
                ? "border-secondary"
                : "border-transparent opacity-70 hover:opacity-100"
            )}
            aria-label={`View image ${i + 1}`}
          >
            <Image src={src} alt="" fill className="object-cover" sizes="64px" />
            <span className="text-micro absolute bottom-0 left-0 right-0 bg-ink/60 py-0.5 text-center text-white">
              {i + 1}
            </span>
          </button>
        ))}
        {has360 && (
          <button
            type="button"
            onClick={() => setMode(has360Video ? "360video" : "360frames")}
            className={cn(
              "relative flex h-20 w-16 shrink-0 flex-col items-center justify-center border-2 bg-ink transition-colors",
              mode === "360video" || mode === "360frames"
                ? "border-secondary"
                : "border-transparent opacity-80 hover:opacity-100"
            )}
            aria-label="360 degree model view"
          >
            <span className="text-title text-secondary">↻</span>
            <span className="text-eyebrow text-secondary">360°</span>
          </button>
        )}
      </div>

      <p className="text-small text-text-muted">
        {mode === "360video"
          ? "Drag to rotate the model — see front, sides & back as worn on a turntable."
          : mode === "360frames"
            ? `Drag or slide — ${images.spinFrames.length} turntable photos (front → sides → back).`
            : `${staticImages.length} photos · Tap for fullscreen · Pinch to zoom.`}
      </p>
    </div>
  );
}
