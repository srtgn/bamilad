import { ProductForm } from "@/components/admin/product-form";
import { prisma } from "@/lib/prisma";

export default async function NewProductPage() {
  const cats = await prisma.category.findMany({
    orderBy: { sortOrder: "asc" },
    include: { parent: true },
  });
  const categories = cats.map((c) => ({
    id: c.id,
    label: c.parent ? `${c.parent.name} → ${c.name}` : c.name,
  }));

  return (
    <div>
      <h1 className="font-heading text-2xl font-semibold text-ink">New product</h1>
      <div className="mt-6">
        <ProductForm product={null} categories={categories} />
      </div>
    </div>
  );
}
