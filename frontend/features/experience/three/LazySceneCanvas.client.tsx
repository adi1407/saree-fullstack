"use client";

import { Suspense, useEffect, useRef, useState, type ReactNode } from "react";
import dynamic from "next/dynamic";

// Code-split Three/R3F into a separate chunk so it is only downloaded when a
// scene actually scrolls into view, not on initial page load.
const SceneCanvas = dynamic(
  () => import("@/features/experience/three/SceneCanvas.client").then((m) => m.SceneCanvas),
  { ssr: false }
);

interface LazySceneCanvasProps {
  children: ReactNode;
  className?: string;
  fallbackVariant?: "wine" | "gold" | "ink" | "accent";
  rootMargin?: string;
}

export function LazySceneCanvas({
  children,
  className,
  fallbackVariant = "wine",
  rootMargin = "200px",
}: LazySceneCanvasProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setVisible(true);
      },
      { rootMargin, threshold: 0.05 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [rootMargin]);

  return (
    <div ref={ref} className={className}>
      {visible && (
        <SceneCanvas fallbackVariant={fallbackVariant} className="!absolute inset-0">
          <Suspense fallback={null}>{children}</Suspense>
        </SceneCanvas>
      )}
    </div>
  );
}
