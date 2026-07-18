import { Container } from "@/components/ui/Container";

export default function CheckoutLoading() {
  return (
    <Container className="py-10 md:py-14">
      <div className="mb-8 h-9 w-48 animate-pulse bg-background-alt" />
      <div className="grid gap-10 lg:grid-cols-[1fr_380px]">
        <div className="space-y-4">
          <div className="h-6 w-40 animate-pulse bg-background-alt" />
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="h-12 w-full animate-pulse bg-background-alt" />
          ))}
        </div>
        <div className="h-72 w-full animate-pulse bg-background-alt" />
      </div>
    </Container>
  );
}
