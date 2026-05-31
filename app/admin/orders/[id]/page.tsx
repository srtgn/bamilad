import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";

import { updateOrderStatus } from "@/app/actions/admin";
import { OrderStatusBadge } from "@/components/storefront/order-status-badge";
import { buttonStyles } from "@/components/ui/button";
import { prisma } from "@/lib/prisma";
import { formatPrice } from "@/lib/utils";

const STATUSES = ["PENDING", "PAID", "FULFILLED", "CANCELLED", "REFUNDED"] as const;

export default async function AdminOrderDetail({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const order = await prisma.order.findUnique({
    where: { id },
    include: { items: true, user: true },
  });
  if (!order) notFound();

  const addr = order.shippingAddress as {
    line1?: string;
    line2?: string;
    city?: string;
    state?: string;
    postal_code?: string;
    country?: string;
  } | null;

  return (
    <div>
      <Link
        href="/admin/orders"
        className="inline-flex items-center gap-1.5 text-sm font-medium text-mocha hover:text-gold"
      >
        <ArrowLeft className="h-4 w-4" /> Orders
      </Link>

      <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
        <h1 className="font-heading text-2xl font-semibold text-ink">
          {order.orderNumber}
        </h1>
        <OrderStatusBadge status={order.status} />
      </div>
      <p className="mt-1 text-sm text-mocha">
        {new Date(order.createdAt).toLocaleString()}
      </p>

      <div className="mt-6 grid gap-6 lg:grid-cols-3">
        <div className="rounded-2xl bg-white p-6 shadow-sm lg:col-span-2">
          <h2 className="font-heading text-lg font-semibold text-ink">Items</h2>
          <ul className="mt-4 divide-y divide-mocha/10">
            {order.items.map((item) => (
              <li key={item.id} className="flex justify-between py-2.5 text-sm">
                <span className="text-mocha-dark">
                  {item.name} × {item.quantity}
                </span>
                <span className="font-medium text-ink">
                  {formatPrice(item.priceCents * item.quantity, order.currency)}
                </span>
              </li>
            ))}
          </ul>
          <dl className="mt-4 space-y-1.5 border-t border-mocha/10 pt-4 text-sm">
            <div className="flex justify-between">
              <dt className="text-mocha-dark">Subtotal</dt>
              <dd>{formatPrice(order.subtotalCents, order.currency)}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-mocha-dark">Shipping</dt>
              <dd>{formatPrice(order.shippingCents, order.currency)}</dd>
            </div>
            <div className="flex justify-between font-semibold text-ink">
              <dt>Total</dt>
              <dd>{formatPrice(order.totalCents, order.currency)}</dd>
            </div>
          </dl>
        </div>

        <div className="space-y-6">
          <div className="rounded-2xl bg-white p-6 shadow-sm">
            <h2 className="font-heading text-lg font-semibold text-ink">Customer</h2>
            <p className="mt-3 text-sm text-mocha-dark">{order.email || "Guest"}</p>
            {order.user ? (
              <p className="text-sm text-mocha-dark">{order.user.name}</p>
            ) : null}
            {addr ? (
              <p className="mt-3 text-sm leading-relaxed text-mocha-dark">
                {addr.line1}
                {addr.line2 ? <>, {addr.line2}</> : null}
                <br />
                {addr.city}
                {addr.state ? `, ${addr.state}` : ""} {addr.postal_code}
                <br />
                {addr.country}
              </p>
            ) : null}
          </div>

          <form
            action={updateOrderStatus}
            className="rounded-2xl bg-white p-6 shadow-sm"
          >
            <h2 className="font-heading text-lg font-semibold text-ink">Status</h2>
            <input type="hidden" name="id" value={order.id} />
            <select
              name="status"
              defaultValue={order.status}
              className="mt-3 w-full rounded-xl border border-mocha/25 bg-white px-4 py-2.5 text-sm outline-none focus:border-mocha"
            >
              {STATUSES.map((s) => (
                <option key={s} value={s}>
                  {s.charAt(0) + s.slice(1).toLowerCase()}
                </option>
              ))}
            </select>
            <button type="submit" className={buttonStyles("primary", "mt-4 w-full")}>
              Update status
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
