import Link from "next/link";

import { OrderStatusBadge } from "@/components/storefront/order-status-badge";
import { prisma } from "@/lib/prisma";
import { formatPrice } from "@/lib/utils";

export default async function AdminOrdersPage() {
  const orders = await prisma.order.findMany({
    orderBy: { createdAt: "desc" },
    take: 100,
  });

  return (
    <div>
      <h1 className="font-heading text-2xl font-semibold text-ink">Orders</h1>

      <div className="mt-6 overflow-x-auto rounded-2xl bg-white shadow-sm">
        <table className="w-full text-sm">
          <thead className="border-b border-mocha/10 text-left text-xs uppercase tracking-wider text-mocha">
            <tr>
              <th className="p-4">Order</th>
              <th className="p-4">Date</th>
              <th className="p-4">Email</th>
              <th className="p-4">Status</th>
              <th className="p-4 text-right">Total</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-mocha/10">
            {orders.length === 0 ? (
              <tr>
                <td colSpan={5} className="p-6 text-center text-mocha-dark">
                  No orders yet.
                </td>
              </tr>
            ) : (
              orders.map((order) => (
                <tr key={order.id}>
                  <td className="p-4">
                    <Link
                      href={`/admin/orders/${order.id}`}
                      className="font-medium text-ink hover:text-gold"
                    >
                      {order.orderNumber}
                    </Link>
                  </td>
                  <td className="p-4 text-mocha-dark">
                    {new Date(order.createdAt).toLocaleDateString()}
                  </td>
                  <td className="p-4 text-mocha-dark">{order.email || "—"}</td>
                  <td className="p-4">
                    <OrderStatusBadge status={order.status} />
                  </td>
                  <td className="p-4 text-right font-medium text-ink">
                    {formatPrice(order.totalCents, order.currency)}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
