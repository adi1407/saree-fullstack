"use client";

import { type ReactNode } from "react";
import { cn } from "@/lib/utils";

interface ExperiencePageShellProps {
  children: ReactNode;
  className?: string;
  hero?: ReactNode;
  heroFallback?: ReactNode;
}

export function ExperiencePageShell({
  children,
  className,
  hero,
  heroFallback,
}: ExperiencePageShellProps) {
  return (
    <div className={cn("relative", className)}>
      {hero && (
        <section className="experience-hero relative min-h-[100svh] overflow-hidden">
      {heroFallback && (
        <div className="absolute inset-0 -z-10" aria-hidden>
          <div className="relative h-full w-full">{heroFallback}</div>
        </div>
      )}
          {hero}
        </section>
      )}
      {children}
    </div>
  );
}
