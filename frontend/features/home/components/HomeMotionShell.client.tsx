"use client";

import { MotionProviders } from "@/features/experience/providers/MotionProviders.client";

export function HomeMotionShell({ children }: { children: React.ReactNode }) {
  return <MotionProviders>{children}</MotionProviders>;
}
