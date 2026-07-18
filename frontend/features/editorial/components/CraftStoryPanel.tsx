import { Divider } from "@/components/ui/Divider";

interface CraftStoryPanelProps {
  title?: string;
  story: string;
  origin?: string;
}

export function CraftStoryPanel({
  title = "The Craft",
  story,
  origin,
}: CraftStoryPanelProps) {
  return (
    <section className="border-gold-rule bg-background-alt py-16 md:py-20">
      <div className="mx-auto max-w-3xl px-4 text-center md:px-8">
        <Divider label="Heritage" className="mb-8" />
        <h2 className="text-chapter text-ink">{title}</h2>
        {origin && (
          <p className="text-eyebrow mt-2 text-secondary">{origin}</p>
        )}
        <blockquote className="mt-6 text-quote text-text">
          &ldquo;{story}&rdquo;
        </blockquote>
      </div>
    </section>
  );
}
