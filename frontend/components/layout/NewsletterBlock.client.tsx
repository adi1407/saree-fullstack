"use client";

import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";

export function NewsletterBlock() {
  return (
    <div className="mx-auto max-w-md text-center">
      <p className="text-card-title text-ink">Join the Heritage Circle</p>
      <p className="mt-2 text-small text-text-muted">
        Early access to new weaves, festive edits, and artisan stories.
      </p>
      <form
        className="mt-4 flex flex-col gap-2 sm:flex-row"
        onSubmit={(e) => {
          e.preventDefault();
        }}
      >
        <Input
          id="newsletter"
          type="email"
          placeholder="Your email"
          aria-label="Email for newsletter"
          className="flex-1"
        />
        <Button type="submit" variant="primary" className="shrink-0">
          Join
        </Button>
      </form>
    </div>
  );
}
