"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { RotateCw } from "lucide-react";

const PRELOAD_RADIUS = 12;
const PX_PER_FRAME = 3; // ~600px drag = full rotation at 200 frames

interface Spin360ViewerProps {
  frames: string[];
  poster: string;
  alt: string;
}

function angleLabel(progress: number): string {
  const deg = progress * 360;
  if (deg < 22.5 || deg >= 337.5) return "Front";
  if (deg < 67.5) return "Front Right";
  if (deg < 112.5) return "Right Side";
  if (deg < 157.5) return "Back Right";
  if (deg < 202.5) return "Back";
  if (deg < 247.5) return "Back Left";
  if (deg < 292.5) return "Left Side";
  return "Front Left";
}

export function Spin360Viewer({ frames, poster, alt }: Spin360ViewerProps) {
  const [index, setIndex] = useState(0);
  const [dragging, setDragging] = useState(false);
  const [hint, setHint] = useState(true);
  const [ready, setReady] = useState(false);
  const dragStartX = useRef(0);
  const dragStartIndex = useRef(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const cacheRef = useRef<Map<number, HTMLImageElement>>(new Map());

  const frameCount = frames.length;
  const currentSrc = frames[index] || poster;

  const preloadRange = useCallback(
    (center: number) => {
      if (frameCount === 0) return;
      for (let offset = -PRELOAD_RADIUS; offset <= PRELOAD_RADIUS; offset++) {
        const fi = ((center + offset) % frameCount + frameCount) % frameCount;
        if (!cacheRef.current.has(fi)) {
          const img = new Image();
          img.src = frames[fi];
          cacheRef.current.set(fi, img);
        }
      }
    },
    [frames, frameCount]
  );

  useEffect(() => {
    const t = setTimeout(() => setHint(false), 3500);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    preloadRange(index);
  }, [index, preloadRange]);

  useEffect(() => {
    if (frames[0]) {
      const img = new Image();
      img.onload = () => setReady(true);
      img.src = frames[0];
    }
  }, [frames]);

  function frameFromDrag(clientX: number) {
    const delta = clientX - dragStartX.current;
    const steps = Math.round(delta / PX_PER_FRAME);
    return ((dragStartIndex.current + steps) % frameCount + frameCount) % frameCount;
  }

  function onPointerDown(e: React.PointerEvent) {
    setDragging(true);
    dragStartX.current = e.clientX;
    dragStartIndex.current = index;
    setHint(false);
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
  }

  function onPointerMove(e: React.PointerEvent) {
    if (!dragging || frameCount === 0) return;
    setIndex(frameFromDrag(e.clientX));
  }

  function onPointerUp() {
    setDragging(false);
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
        {/* Native img for fast frame swapping with 200 frames */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={currentSrc}
          alt={`${alt} — 360° frame ${index + 1} of ${frameCount}`}
          className="h-full w-full object-cover select-none"
          draggable={false}
        />

        {!ready && (
          <div className="absolute inset-0 flex items-center justify-center bg-background-alt text-small text-text-muted">
            Loading {frameCount} frames...
          </div>
        )}

        {hint && ready && (
          <div className="absolute inset-0 flex items-center justify-center bg-ink/25 pointer-events-none">
            <div className="flex items-center gap-2 rounded-full bg-ink/85 px-4 py-2 text-small text-white">
              <RotateCw className="h-4 w-4" />
              Drag to see front, sides & back
            </div>
          </div>
        )}

        <div className="text-small absolute bottom-3 left-3 rounded-full bg-ink/80 px-3 py-1 text-secondary backdrop-blur-sm">
          360° · {angleLabel(index / Math.max(1, frameCount - 1))} · {index + 1}/{frameCount}
        </div>
      </div>

      <input
        type="range"
        min={0}
        max={Math.max(0, frameCount - 1)}
        value={index}
        onChange={(e) => setIndex(Number(e.target.value))}
        className="h-1.5 w-full cursor-pointer accent-secondary"
        aria-label="360 degree rotation"
      />
    </div>
  );
}
