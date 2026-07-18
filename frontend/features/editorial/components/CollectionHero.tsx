import Image from "next/image";
import type { WeaveStory } from "@/content/editorial";

interface CollectionHeroProps {
  story: WeaveStory;
}

export function CollectionHero({ story }: CollectionHeroProps) {
  return (
    <section className="relative flex min-h-[50vh] items-end overflow-hidden md:min-h-[60vh]">
      <Image
        src={story.heroImage}
        alt={`${story.title} sarees`}
        fill
        priority
        className="object-cover"
        sizes="100vw"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-ink/85 via-ink/30 to-ink/10" />
      <div className="relative z-10 w-full px-4 pb-12 pt-24 md:px-8 md:pb-16 lg:px-12">
        <div className="mx-auto max-w-[1440px]">
          <p className="text-eyebrow text-secondary">{story.origin}</p>
          <h1 className="text-display mt-2 text-white">{story.title}</h1>
          <p className="mt-4 max-w-xl text-white/80 leading-relaxed">{story.intro}</p>
        </div>
      </div>
    </section>
  );
}
