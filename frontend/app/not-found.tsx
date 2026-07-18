import { Container } from "@/components/ui/Container";
import Link from "next/link";
import { Button } from "@/components/ui/Button";

export default function NotFound() {
  return (
    <Container className="flex min-h-[60vh] flex-col items-center justify-center py-20 text-center">
      <p className="text-eyebrow text-secondary">404</p>
      <h1 className="text-chapter mt-2 text-ink">Page not found</h1>
      <p className="mt-4 text-text-muted">The page you&apos;re looking for doesn&apos;t exist.</p>
      <Link href="/" className="mt-8">
        <Button>Return Home</Button>
      </Link>
    </Container>
  );
}
