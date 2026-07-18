import { Container } from "@/components/ui/Container";
import { ProductCardSkeleton } from "@/components/ui/Skeleton";

export default function Loading() {
  return (
    <Container className="py-20">
      <div className="grid grid-cols-2 gap-4 md:grid-cols-4 md:gap-6">
        {Array.from({ length: 4 }).map((_, i) => (
          <ProductCardSkeleton key={i} />
        ))}
      </div>
    </Container>
  );
}
