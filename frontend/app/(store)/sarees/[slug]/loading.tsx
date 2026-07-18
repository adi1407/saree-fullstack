import { Container } from "@/components/ui/Container";

export default function SareeDetailLoading() {
  return (
    <Container className="py-8 md:py-12">
      <div className="mb-6 h-3 w-56 animate-pulse bg-background-alt" />
      <div className="grid gap-10 lg:grid-cols-[58%_42%] lg:gap-12">
        <div className="aspect-[3/4] w-full animate-pulse bg-background-alt" />
        <div className="space-y-4">
          <div className="h-3 w-24 animate-pulse bg-background-alt" />
          <div className="h-9 w-3/4 animate-pulse bg-background-alt" />
          <div className="h-5 w-32 animate-pulse bg-background-alt" />
          <div className="h-6 w-40 animate-pulse bg-background-alt" />
          <div className="space-y-2 pt-4">
            <div className="h-3 w-full animate-pulse bg-background-alt" />
            <div className="h-3 w-full animate-pulse bg-background-alt" />
            <div className="h-3 w-2/3 animate-pulse bg-background-alt" />
          </div>
          <div className="h-12 w-full animate-pulse bg-background-alt" />
        </div>
      </div>
    </Container>
  );
}
