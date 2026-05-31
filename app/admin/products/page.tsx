import Link from "next/link";
import { Plus } from "lucide-react";

import { deleteProduct } from "@/app/actions/admin";
import { buttonStyles } from "@/components/ui/button";
import { prisma } from "@/lib/prisma";
import { formatPrice } from "@/lib/utils";

export default async function AdminProductsPage() {
  const products = await prisma.product.findMany({
    orderBy: { createdAt: "desc" },
    include: { category: true },
  });

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="font-heading text-2xl font-semibold text-ink">Products</h1>
        <Link href="/admin/products/new" className={buttonStyles("primary")}>
          <Plus className="h-4 w-4" /> New product
        </Link>
      </div>

      <div className="mt-6 overflow-x-auto rounded-2xl bg-white shadow-sm">
        <table className="w-full text-sm">
          <thead className="border-b border-mocha/10 text-left text-xs uppercase tracking-wider text-mocha">
            <tr>
              <th className="p-4">Name</th>
              <th className="p-4">Category</th>
              <th className="p-4">Price</th>
              <th className="p-4">Stock</th>
              <th className="p-4">Status</th>
              <th className="p-4"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-mocha/10">
            {products.map((product) => (
              <tr key={product.id}>
                <td className="p-4">
                  <Link
                    href={`/admin/products/${product.id}`}
                    className="font-medium text-ink hover:text-gold"
                  >
                    {product.name}
                  </Link>
                </td>
                <td className="p-4 text-mocha-dark">{product.category?.name ?? "—"}</td>
                <td className="p-4 text-mocha-dark">
                  {formatPrice(product.priceCents, product.currency)}
                </td>
                <td className="p-4 text-mocha-dark">{product.stock}</td>
                <td className="p-4">
                  <span
                    className={
                      product.status === "ACTIVE"
                        ? "rounded-full bg-green-100 px-2.5 py-1 text-xs font-medium text-green-800"
                        : "rounded-full bg-gray-200 px-2.5 py-1 text-xs font-medium text-gray-700"
                    }
                  >
                    {product.status === "ACTIVE" ? "Active" : "Draft"}
                  </span>
                </td>
                <td className="p-4 text-right">
                  <form action={deleteProduct}>
                    <input type="hidden" name="id" value={product.id} />
                    <button
                      type="submit"
                      className="text-xs font-medium text-mocha hover:text-red-600"
                    >
                      Delete
                    </button>
                  </form>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
