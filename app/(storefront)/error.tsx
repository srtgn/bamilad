"use client";

import { Container } from "@/components/ui/container";
import { Button } from "@/components/ui/button";

export default function StorefrontError({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <Container className="flex flex-col items-center py-24 text-center">
      <h1 className="font-heading text-3xl font-semibold text-ink">
        Something went wrong
      </h1>
      <p className="mt-3 max-w-sm text-mocha-dark">
        An unexpected error occurred. Please try again — if it keeps happening, let us
        know.
      </p>
      <Button variant="primary" className="mt-6" onClick={() => reset()}>
        Try again
      </Button>
    </Container>
  );
}
