import type { Metadata } from "next";
import Link from "next/link";
import { CheckCircle2 } from "lucide-react";

import { OrderStatusBadge } from "@/components/storefront/order-status-badge";
import { buttonStyles } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { prisma } from "@/lib/prisma";
import { formatPrice } from "@/lib/utils";

export const metadata: Metadata = { title: "Order confirmed" };

export default async function CheckoutSuccessPage({
  searchParams,
}: {
  searchParams: Promise<{ order?: string; session_id?: string }>;
}) {
  const sp = await searchParams;
  const order = sp.order
    ? await prisma.order.findUnique({
        where: { orderNumber: sp.order },
        include: { items: true },
      })
    : sp.session_id
      ? await prisma.order.findUnique({
          where: { stripeSessionId: sp.session_id },
          include: { items: true },
        })
      : null;

  return (
    <Container className="max-w-2xl py-16 text-center">
      <span className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-green-100 text-green-700">
        <CheckCircle2 className="h-8 w-8" />
      </span>
      <h1 className="mt-5 font-heading text-3xl font-semibold text-ink">
        Thank you for your order!
      </h1>
      <p className="mt-2 text-mocha-dark">
        {order ? (
          <>
            Your order <strong>{order.orderNumber}</strong> has been received and a
            confirmation email is on its way.
          </>
        ) : (
          "Your order has been received and a confirmation email is on its way."
        )}
      </p>

      {order ? (
        <div className="mt-8 rounded-3xl bg-cream-soft p-6 text-left">
          <div className="flex items-center justify-between">
            <span className="text-sm text-mocha-dark">Status</span>
            <OrderStatusBadge status={order.status} />
          </div>
          <ul className="mt-4 divide-y divide-mocha/10">
            {order.items.map((item) => (
              <li key={item.id} className="flex justify-between py-2 text-sm">
                <span className="text-mocha-dark">
                  {item.name} × {item.quantity}
                </span>
                <span className="font-medium text-ink">
                  {formatPrice(item.priceCents * item.quantity, order.currency)}
                </span>
              </li>
            ))}
          </ul>
          <div className="mt-4 flex justify-between border-t border-mocha/15 pt-3 font-semibold text-ink">
            <span>Total</span>
            <span>{formatPrice(order.totalCents, order.currency)}</span>
          </div>
        </div>
      ) : null}

      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <Link href="/shop" className={buttonStyles("primary")}>
          Continue shopping
        </Link>
        <Link
          href="/account/orders"
          className={buttonStyles("light", "border border-mocha/20")}
        >
          View orders
        </Link>
      </div>
    </Container>
  );
}
