import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, ShoppingBag } from "lucide-react";

import { CartItemRow } from "@/components/storefront/cart-item-row";
import { PageHeader } from "@/components/storefront/page-header";
import { buttonStyles } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { cartSubtotalCents, getCart } from "@/lib/cart";
import { siteConfig } from "@/lib/site-config";
import { formatPrice } from "@/lib/utils";

export const metadata: Metadata = { title: "Your Cart" };

const FLAT_SHIPPING_CENTS = 800;

export default async function CartPage() {
  const cart = await getCart();
  const items = cart?.items ?? [];

  if (items.length === 0) {
    return (
      <>
        <PageHeader title="Your Cart" />
        <Container className="flex flex-col items-center py-20 text-center">
          <span className="flex h-16 w-16 items-center justify-center rounded-full bg-cream text-mocha">
            <ShoppingBag className="h-7 w-7" />
          </span>
          <h2 className="mt-5 font-heading text-2xl font-semibold text-ink">
            Your cart is empty
          </h2>
          <p className="mt-2 max-w-sm text-mocha-dark">
            Discover clean, science-backed essentials made for your daily ritual.
          </p>
          <Link href="/shop" className={buttonStyles("primary", "mt-6")}>
            Start shopping <ArrowRight className="h-4 w-4" />
          </Link>
        </Container>
      </>
    );
  }

  const subtotal = cartSubtotalCents(cart!);
  const freeShipping = subtotal >= siteConfig.freeShippingThresholdCents;
  const shipping = freeShipping ? 0 : FLAT_SHIPPING_CENTS;
  const total = subtotal + shipping;
  const remainingForFree = siteConfig.freeShippingThresholdCents - subtotal;

  return (
    <>
      <PageHeader title="Your Cart" />
      <Container className="py-12">
        <div className="grid gap-10 lg:grid-cols-3">
          <div className="divide-y divide-mocha/10 lg:col-span-2">
            {items.map((item) => (
              <CartItemRow key={item.id} item={item} />
            ))}
          </div>

          <aside className="h-fit rounded-3xl bg-cream-soft p-6 sm:p-8">
            <h2 className="font-heading text-lg font-semibold text-ink">Order summary</h2>
            <dl className="mt-5 space-y-3 text-sm">
              <div className="flex justify-between">
                <dt className="text-mocha-dark">Subtotal</dt>
                <dd className="font-medium text-ink">{formatPrice(subtotal)}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-mocha-dark">Shipping</dt>
                <dd className="font-medium text-ink">
                  {freeShipping ? "Free" : formatPrice(shipping)}
                </dd>
              </div>
              <div className="flex justify-between border-t border-mocha/15 pt-3 text-base">
                <dt className="font-semibold text-ink">Total</dt>
                <dd className="font-semibold text-ink">{formatPrice(total)}</dd>
              </div>
            </dl>

            {!freeShipping && remainingForFree > 0 ? (
              <p className="mt-4 rounded-xl bg-white px-4 py-3 text-xs text-mocha-dark">
                Add {formatPrice(remainingForFree)} more to unlock free shipping.
              </p>
            ) : null}

            <Link href="/checkout" className={buttonStyles("primary", "mt-6 w-full")}>
              Checkout <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href="/shop"
              className="mt-3 block text-center text-sm font-medium text-mocha hover:text-gold"
            >
              Continue shopping
            </Link>
          </aside>
        </div>
      </Container>
    </>
  );
}
