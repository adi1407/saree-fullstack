"use client";

import { Canvas } from "@react-three/fiber";
import { Suspense, type ReactNode } from "react";
import { useExperienceMotion } from "@/features/experience/providers/MotionProviders.client";
import { AnimatedProceduralFallback } from "@/features/experience/visuals/AnimatedProceduralFallback.client";
import { cn } from "@/lib/utils";

interface SceneCanvasProps {
  children: ReactNode;
  className?: string;
  fallbackVariant?: "wine" | "gold" | "ink" | "accent";
}

export function SceneCanvas({
  children,
  className,
  fallbackVariant = "wine",
}: SceneCanvasProps) {
  const { enableWebGL, canvasDpr } = useExperienceMotion();

  if (!enableWebGL) {
    return (
      <div className={cn("absolute inset-0 -z-10", className)} aria-hidden>
        <AnimatedProceduralFallback variant={fallbackVariant} />
      </div>
    );
  }

  return (
    <div className={cn("absolute inset-0 -z-10", className)} aria-hidden>
      <Canvas
        dpr={canvasDpr}
        camera={{ position: [0, 0, 5], fov: 50 }}
        gl={{ antialias: true, alpha: true }}
        style={{ background: "transparent" }}
      >
        <Suspense fallback={null}>{children}</Suspense>
      </Canvas>
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-ink/20 via-transparent to-background/70" />
    </div>
  );
}
