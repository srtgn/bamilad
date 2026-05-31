import { deleteCategory } from "@/app/actions/admin";
import { CategoryForm } from "@/components/admin/category-form";
import { prisma } from "@/lib/prisma";

export default async function AdminCategoriesPage() {
  const categories = await prisma.category.findMany({
    orderBy: [{ parentId: "asc" }, { sortOrder: "asc" }],
    include: {
      parent: true,
      _count: { select: { products: true, children: true } },
    },
  });
  const parents = categories.filter((c) => !c.parentId).map((c) => ({ id: c.id, name: c.name }));

  return (
    <div>
      <h1 className="font-heading text-2xl font-semibold text-ink">Categories</h1>

      <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_320px]">
        <div className="overflow-x-auto rounded-2xl bg-white shadow-sm">
          <table className="w-full text-sm">
            <thead className="border-b border-mocha/10 text-left text-xs uppercase tracking-wider text-mocha">
              <tr>
                <th className="p-4">Name</th>
                <th className="p-4">Parent</th>
                <th className="p-4">Products</th>
                <th className="p-4"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-mocha/10">
              {categories.map((category) => (
                <tr key={category.id}>
                  <td className="p-4 font-medium text-ink">{category.name}</td>
                  <td className="p-4 text-mocha-dark">{category.parent?.name ?? "—"}</td>
                  <td className="p-4 text-mocha-dark">{category._count.products}</td>
                  <td className="p-4 text-right">
                    <form action={deleteCategory}>
                      <input type="hidden" name="id" value={category.id} />
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

        <CategoryForm parents={parents} />
      </div>
    </div>
  );
}
