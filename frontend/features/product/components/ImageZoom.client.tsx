"use client";

import { useState, useRef, useCallback } from "react";
import Image from "next/image";
import { ZoomIn, X, Minus, Plus } from "lucide-react";

const ZOOM_LEVEL = 2.5;

interface ImageZoomProps {
  src: string;
  alt: string;
  priority?: boolean;
}

export function ImageZoom({ src, alt, priority }: ImageZoomProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [hovering, setHovering] = useState(false);
  const [position, setPosition] = useState({ x: 50, y: 50 });
  const [fullscreen, setFullscreen] = useState(false);
  const [fsScale, setFsScale] = useState(1.5);
  const [fsPan, setFsPan] = useState({ x: 0, y: 0 });
  const [fsDragging, setFsDragging] = useState(false);
  const [fsDragStart, setFsDragStart] = useState({ x: 0, y: 0 });

  const handleMove = useCallback((clientX: number, clientY: number) => {
    const el = containerRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const x = Math.max(0, Math.min(100, ((clientX - rect.left) / rect.width) * 100));
    const y = Math.max(0, Math.min(100, ((clientY - rect.top) / rect.height) * 100));
    setPosition({ x, y });
  }, []);

  function onMouseMove(e: React.MouseEvent) {
    handleMove(e.clientX, e.clientY);
  }

  function onTouchMove(e: React.TouchEvent) {
    if (e.touches.length === 1) {
      handleMove(e.touches[0].clientX, e.touches[0].clientY);
    }
  }

  return (
    <>
      <div
        ref={containerRef}
        className="relative aspect-[4/5] w-full cursor-crosshair overflow-hidden bg-background-alt"
        onMouseEnter={() => setHovering(true)}
        onMouseLeave={() => setHovering(false)}
        onMouseMove={onMouseMove}
        onTouchStart={() => setHovering(true)}
        onTouchMove={onTouchMove}
        onTouchEnd={() => setHovering(false)}
        onClick={() => setFullscreen(true)}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => e.key === "Enter" && setFullscreen(true)}
        aria-label={`Zoom ${alt}`}
      >
        <Image
          src={src}
          alt={alt}
          fill
          className="object-cover"
          sizes="(max-width: 1024px) 100vw, 58vw"
          priority={priority}
          draggable={false}
        />

        {/* Desktop magnifier lens */}
        {hovering && (
          <div
            className="pointer-events-none absolute z-10 hidden h-28 w-28 -translate-x-1/2 -translate-y-1/2 overflow-hidden rounded-full border-2 border-secondary shadow-xl md:block"
            style={{ left: `${position.x}%`, top: `${position.y}%` }}
          >
            <div
              className="absolute inset-0"
              style={{
                backgroundImage: `url(${src})`,
                backgroundSize: `${ZOOM_LEVEL * 100}%`,
                backgroundPosition: `${position.x}% ${position.y}%`,
                backgroundRepeat: "no-repeat",
              }}
            />
          </div>
        )}

        {/* Mobile / tablet zoom preview strip */}
        {hovering && (
          <div
            className="pointer-events-none absolute inset-0 z-[5] bg-cover bg-no-repeat md:hidden"
            style={{
              backgroundImage: `url(${src})`,
              backgroundSize: `${ZOOM_LEVEL * 100}%`,
              backgroundPosition: `${position.x}% ${position.y}%`,
              opacity: 0.15,
            }}
          />
        )}

        <div className="text-small absolute bottom-3 right-3 flex items-center gap-1.5 rounded-full bg-ink/75 px-3 py-1.5 text-white backdrop-blur-sm">
          <ZoomIn className="h-3.5 w-3.5" />
          <span className="hidden sm:inline">Hover to zoom · Click to expand</span>
          <span className="sm:hidden">Tap to zoom</span>
        </div>
      </div>

      {/* Fullscreen zoom modal */}
      {fullscreen && (
        <div
          className="fixed inset-0 z-[100] flex flex-col bg-ink/95"
          onClick={() => setFullscreen(false)}
        >
          <div className="flex items-center justify-between px-4 py-3 text-white">
            <p className="text-small opacity-80">{alt}</p>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setFsScale((s) => Math.max(1, s - 0.25));
                }}
                className="rounded-full bg-white/10 p-2 hover:bg-white/20"
                aria-label="Zoom out"
              >
                <Minus className="h-4 w-4" />
              </button>
              <span className="min-w-[3rem] text-center text-small tabular-nums">
                {Math.round(fsScale * 100)}%
              </span>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setFsScale((s) => Math.min(4, s + 0.25));
                }}
                className="rounded-full bg-white/10 p-2 hover:bg-white/20"
                aria-label="Zoom in"
              >
                <Plus className="h-4 w-4" />
              </button>
              <button
                type="button"
                onClick={() => setFullscreen(false)}
                className="ml-2 rounded-full bg-white/10 p-2 hover:bg-white/20"
                aria-label="Close"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
          </div>

          <div
            className="relative flex flex-1 cursor-grab items-center justify-center overflow-hidden active:cursor-grabbing"
            onClick={(e) => e.stopPropagation()}
            onPointerDown={(e) => {
              setFsDragging(true);
              setFsDragStart({ x: e.clientX - fsPan.x, y: e.clientY - fsPan.y });
            }}
            onPointerMove={(e) => {
              if (!fsDragging) return;
              setFsPan({ x: e.clientX - fsDragStart.x, y: e.clientY - fsDragStart.y });
            }}
            onPointerUp={() => setFsDragging(false)}
            onPointerLeave={() => setFsDragging(false)}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={src}
              alt={alt}
              draggable={false}
              className="max-h-full max-w-full select-none object-contain transition-transform duration-100"
              style={{
                transform: `translate(${fsPan.x}px, ${fsPan.y}px) scale(${fsScale})`,
              }}
            />
          </div>
        </div>
      )}
    </>
  );
}
