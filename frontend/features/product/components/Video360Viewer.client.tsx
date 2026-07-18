"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { RotateCw } from "lucide-react";

interface Video360ViewerProps {
  videoUrl: string;
  poster: string;
  alt: string;
}

/** Map playback progress (0–1) to human-readable viewing angle */
function angleLabel(progress: number): string {
  const deg = ((progress % 1) + 1) % 1 * 360;
  if (deg < 22.5 || deg >= 337.5) return "Front";
  if (deg < 67.5) return "Front Right";
  if (deg < 112.5) return "Right Side";
  if (deg < 157.5) return "Back Right";
  if (deg < 202.5) return "Back";
  if (deg < 247.5) return "Back Left";
  if (deg < 292.5) return "Left Side";
  return "Front Left";
}

export function Video360Viewer({ videoUrl, poster, alt }: Video360ViewerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [ready, setReady] = useState(false);
  const [dragging, setDragging] = useState(false);
  const [hint, setHint] = useState(true);
  const [progress, setProgress] = useState(0);
  const dragStartX = useRef(0);
  const dragStartProgress = useRef(0);

  useEffect(() => {
    const t = setTimeout(() => setHint(false), 4000);
    return () => clearTimeout(t);
  }, []);

  const seekToProgress = useCallback((p: number) => {
    const video = videoRef.current;
    if (!video || !video.duration || !isFinite(video.duration)) return;
    const clamped = ((p % 1) + 1) % 1;
    video.currentTime = clamped * video.duration;
    setProgress(clamped);
  }, []);

  function onPointerDown(e: React.PointerEvent) {
    setDragging(true);
    dragStartX.current = e.clientX;
    dragStartProgress.current = progress;
    setHint(false);
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
  }

  function onPointerMove(e: React.PointerEvent) {
    if (!dragging || !containerRef.current) return;
    const width = containerRef.current.offsetWidth || 400;
    const delta = e.clientX - dragStartX.current;
    // Full drag across width = one full rotation
    const next = dragStartProgress.current + delta / width;
    seekToProgress(next);
  }

  function onPointerUp() {
    setDragging(false);
  }

  function onSliderChange(p: number) {
    seekToProgress(p);
  }

  return (
    <div className="space-y-2">
      <div
        ref={containerRef}
        className="relative aspect-[4/5] cursor-grab overflow-hidden bg-background-alt active:cursor-grabbing"
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerLeave={onPointerUp}
        onPointerCancel={onPointerUp}
      >
        <video
          ref={videoRef}
          src={videoUrl}
          poster={poster}
          muted
          playsInline
          preload="auto"
          className="h-full w-full object-cover select-none"
          onLoadedMetadata={() => {
            setReady(true);
            seekToProgress(0);
          }}
          aria-label={alt}
        />

        {!ready && (
          <div className="absolute inset-0 flex items-center justify-center bg-background-alt text-small text-text-muted">
            Loading 360° view...
          </div>
        )}

        {hint && ready && (
          <div className="absolute inset-0 flex items-center justify-center bg-ink/20 pointer-events-none">
            <div className="flex items-center gap-2 rounded-full bg-ink/85 px-4 py-2 text-small text-white">
              <RotateCw className="h-4 w-4" />
              Drag to see front, sides & back
            </div>
          </div>
        )}

        <div className="text-small absolute bottom-3 left-3 rounded-full bg-ink/80 px-3 py-1 text-secondary backdrop-blur-sm">
          360° · {angleLabel(progress)}
        </div>
      </div>

      <input
        type="range"
        min={0}
        max={1000}
        value={Math.round(progress * 1000)}
        onChange={(e) => onSliderChange(Number(e.target.value) / 1000)}
        className="h-1.5 w-full cursor-pointer accent-secondary"
        aria-label="Rotate model view"
      />

      <p className="text-small text-text-muted">
        Drag to rotate the model — view front, both sides, and back. Shot on a turntable for true all-angle inspection.
      </p>
    </div>
  );
}
