import type { Metadata } from "next";
import Link from "next/link";

import { auth } from "@/auth";
import { OrderStatusBadge } from "@/components/storefront/order-status-badge";
import { prisma } from "@/lib/prisma";
import { formatPrice } from "@/lib/utils";

export const metadata: Metadata = { title: "Orders" };

export default async function OrdersPage() {
  const session = await auth();
  const orders = await prisma.order.findMany({
    where: { userId: session!.user.id },
    orderBy: { createdAt: "desc" },
    include: { items: true },
  });

  return (
    <div>
      <h1 className="font-heading text-2xl font-semibold text-ink">Your orders</h1>

      {orders.length === 0 ? (
        <p className="mt-4 text-sm text-mocha-dark">
          No orders yet.{" "}
          <Link href="/shop" className="font-medium text-gold hover:underline">
            Browse the shop
          </Link>
          .
        </p>
      ) : (
        <div className="mt-6 space-y-4">
          {orders.map((order) => (
            <div key={order.id} className="rounded-2xl border border-mocha/10 p-5">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <p className="font-medium text-ink">{order.orderNumber}</p>
                  <p className="text-xs text-mocha">
                    {new Date(order.createdAt).toLocaleString()}
                  </p>
                </div>
                <div className="flex items-center gap-4">
                  <OrderStatusBadge status={order.status} />
                  <span className="font-semibold text-mocha-dark">
                    {formatPrice(order.totalCents, order.currency)}
                  </span>
                </div>
              </div>
              <ul className="mt-3 border-t border-mocha/10 pt-3 text-sm text-mocha-dark">
                {order.items.map((item) => (
                  <li key={item.id} className="flex justify-between py-0.5">
                    <span>
                      {item.name} × {item.quantity}
                    </span>
                    <span>{formatPrice(item.priceCents * item.quantity, order.currency)}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
