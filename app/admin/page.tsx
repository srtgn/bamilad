import Link from "next/link";
import { DollarSign, Package, ShoppingBag, Users } from "lucide-react";

import { OrderStatusBadge } from "@/components/storefront/order-status-badge";
import { prisma } from "@/lib/prisma";
import { formatPrice } from "@/lib/utils";

export default async function AdminDashboard() {
  const [revenue, orderCount, productCount, userCount, recentOrders] =
    await Promise.all([
      prisma.order.aggregate({
        _sum: { totalCents: true },
        where: { status: { in: ["PAID", "FULFILLED"] } },
      }),
      prisma.order.count(),
      prisma.product.count(),
      prisma.user.count(),
      prisma.order.findMany({ orderBy: { createdAt: "desc" }, take: 6 }),
    ]);

  const stats = [
    {
      label: "Revenue",
      value: formatPrice(revenue._sum.totalCents ?? 0),
      icon: DollarSign,
    },
    { label: "Orders", value: String(orderCount), icon: ShoppingBag },
    { label: "Products", value: String(productCount), icon: Package },
    { label: "Customers", value: String(userCount), icon: Users },
  ];

  return (
    <div>
      <h1 className="font-heading text-2xl font-semibold text-ink">Dashboard</h1>

      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div key={stat.label} className="rounded-2xl bg-white p-5 shadow-sm">
              <div className="flex items-center justify-between">
                <span className="text-sm text-mocha-dark">{stat.label}</span>
                <Icon className="h-4 w-4 text-mocha" />
              </div>
              <p className="mt-2 font-heading text-2xl font-semibold text-ink">
                {stat.value}
              </p>
            </div>
          );
        })}
      </div>

      <div className="mt-8 rounded-2xl bg-white p-6 shadow-sm">
        <div className="flex items-center justify-between">
          <h2 className="font-heading text-lg font-semibold text-ink">Recent orders</h2>
          <Link href="/admin/orders" className="text-sm font-medium text-mocha hover:text-gold">
            View all
          </Link>
        </div>
        {recentOrders.length === 0 ? (
          <p className="mt-4 text-sm text-mocha-dark">No orders yet.</p>
        ) : (
          <table className="mt-4 w-full text-sm">
            <thead className="text-left text-xs uppercase tracking-wider text-mocha">
              <tr>
                <th className="pb-2">Order</th>
                <th className="pb-2">Email</th>
                <th className="pb-2">Status</th>
                <th className="pb-2 text-right">Total</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-mocha/10">
              {recentOrders.map((order) => (
                <tr key={order.id}>
                  <td className="py-2.5">
                    <Link
                      href={`/admin/orders/${order.id}`}
                      className="font-medium text-ink hover:text-gold"
                    >
                      {order.orderNumber}
                    </Link>
                  </td>
                  <td className="py-2.5 text-mocha-dark">{order.email || "—"}</td>
                  <td className="py-2.5">
                    <OrderStatusBadge status={order.status} />
                  </td>
                  <td className="py-2.5 text-right font-medium text-ink">
                    {formatPrice(order.totalCents, order.currency)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
