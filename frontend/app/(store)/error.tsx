"use client";

import { useEffect } from "react";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <Container className="flex min-h-[50vh] flex-col items-center justify-center py-20 text-center">
      <h1 className="text-chapter text-ink">Something went wrong</h1>
      <p className="mt-4 text-text-muted">We couldn&apos;t load this page. Please try again.</p>
      <Button onClick={reset} className="mt-6">
        Try again
      </Button>
    </Container>
  );
}
