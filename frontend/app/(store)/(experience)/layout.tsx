import { MotionProviders } from "@/features/experience/providers/MotionProviders.client";
import { PageTransition } from "@/features/experience/motion/PageTransition.client";

export default function ExperienceLayout({ children }: { children: React.ReactNode }) {
  return (
    <MotionProviders>
      <PageTransition>{children}</PageTransition>
    </MotionProviders>
  );
}
