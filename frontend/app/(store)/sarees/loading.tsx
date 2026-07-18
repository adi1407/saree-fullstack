import { Container } from "@/components/ui/Container";

function SkeletonCard() {
  return (
    <div className="animate-pulse">
      <div className="aspect-[3/4] bg-background-alt" />
      <div className="mt-3 space-y-2">
        <div className="h-3 w-16 bg-background-alt" />
        <div className="h-4 w-full bg-background-alt" />
        <div className="h-3 w-20 bg-background-alt" />
      </div>
    </div>
  );
}

export default function SareesLoading() {
  return (
    <Container className="py-10 md:py-16">
      <div className="mb-8 space-y-2">
        <div className="h-3 w-24 animate-pulse bg-background-alt" />
        <div className="h-10 w-48 animate-pulse bg-background-alt" />
        <div className="h-4 w-32 animate-pulse bg-background-alt" />
      </div>
      <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4 md:gap-6">
        {Array.from({ length: 8 }).map((_, i) => (
          <SkeletonCard key={i} />
        ))}
      </div>
    </Container>
  );
}
