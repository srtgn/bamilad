import type { Metadata } from "next";
import Link from "next/link";

import { buttonStyles } from "@/components/ui/button";
import { Container } from "@/components/ui/container";

export const metadata: Metadata = { title: "Checkout canceled" };

export default function CheckoutCancelPage() {
  return (
    <Container className="max-w-xl py-20 text-center">
      <h1 className="font-heading text-3xl font-semibold text-ink">
        Checkout canceled
      </h1>
      <p className="mt-3 text-mocha-dark">
        No charge was made and your cart is still saved. Ready when you are.
      </p>
      <Link href="/cart" className={buttonStyles("primary", "mt-6")}>
        Return to cart
      </Link>
    </Container>
  );
}
