"use client";

import { useEffect } from "react";
import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";

export default function CollectionError({
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
      <h1 className="text-chapter text-ink">We couldn&apos;t load this collection</h1>
      <p className="mt-4 text-text-muted">Please try again, or explore all sarees.</p>
      <div className="mt-6 flex flex-wrap justify-center gap-3">
        <Button onClick={reset}>Try again</Button>
        <Link
          href="/sarees"
          className="inline-flex items-center border border-secondary px-6 text-eyebrow text-primary transition-colors hover:bg-secondary hover:text-ink"
        >
          Browse all sarees
        </Link>
      </div>
    </Container>
  );
}
