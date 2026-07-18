import { Suspense } from "react";
import { Container } from "@/components/ui/Container";
import { OrderDetailContent } from "./OrderDetailContent.client";

export default function OrderDetailPage() {
  return (
    <Suspense
      fallback={
        <Container className="py-20 text-center text-text-muted">Loading order...</Container>
      }
    >
      <OrderDetailContent />
    </Suspense>
  );
}
