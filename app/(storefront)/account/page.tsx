import type { Metadata } from "next";
import Link from "next/link";
import { MapPin, Package } from "lucide-react";

import { auth } from "@/auth";
import { OrderStatusBadge } from "@/components/storefront/order-status-badge";
import { prisma } from "@/lib/prisma";
import { formatPrice } from "@/lib/utils";

export const metadata: Metadata = { title: "Account" };

export default async function AccountPage() {
  const session = await auth();
  const userId = session!.user.id;

  const [orders, addressCount] = await Promise.all([
    prisma.order.findMany({ where: { userId }, orderBy: { createdAt: "desc" }, take: 3 }),
    prisma.address.count({ where: { userId } }),
  ]);
  const orderCount = await prisma.order.count({ where: { userId } });

  return (
    <div>
      <h1 className="font-heading text-2xl font-semibold text-ink">Account overview</h1>

      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        <Link
          href="/account/orders"
          className="flex items-center gap-4 rounded-2xl bg-cream-soft p-5 transition hover:bg-cream"
        >
          <span className="flex h-11 w-11 items-center justify-center rounded-full bg-mocha/10 text-mocha">
            <Package className="h-5 w-5" />
          </span>
          <span>
            <span className="block font-heading text-xl font-semibold text-ink">
              {orderCount}
            </span>
            <span className="text-sm text-mocha-dark">Orders</span>
          </span>
        </Link>
        <Link
          href="/account/addresses"
          className="flex items-center gap-4 rounded-2xl bg-cream-soft p-5 transition hover:bg-cream"
        >
          <span className="flex h-11 w-11 items-center justify-center rounded-full bg-mocha/10 text-mocha">
            <MapPin className="h-5 w-5" />
          </span>
          <span>
            <span className="block font-heading text-xl font-semibold text-ink">
              {addressCount}
            </span>
            <span className="text-sm text-mocha-dark">Saved addresses</span>
          </span>
        </Link>
      </div>

      <h2 className="mt-10 font-heading text-lg font-semibold text-ink">Recent orders</h2>
      {orders.length === 0 ? (
        <p className="mt-3 text-sm text-mocha-dark">
          You haven&apos;t placed any orders yet.{" "}
          <Link href="/shop" className="font-medium text-gold hover:underline">
            Start shopping
          </Link>
          .
        </p>
      ) : (
        <ul className="mt-4 divide-y divide-mocha/10">
          {orders.map((order) => (
            <li key={order.id} className="flex items-center justify-between py-3">
              <div>
                <p className="font-medium text-ink">{order.orderNumber}</p>
                <p className="text-xs text-mocha">
                  {new Date(order.createdAt).toLocaleDateString()}
                </p>
              </div>
              <div className="flex items-center gap-4">
                <OrderStatusBadge status={order.status} />
                <span className="font-medium text-mocha-dark">
                  {formatPrice(order.totalCents, order.currency)}
                </span>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
