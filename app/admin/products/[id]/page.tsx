import { notFound } from "next/navigation";

import { ProductForm } from "@/components/admin/product-form";
import { prisma } from "@/lib/prisma";

export default async function EditProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const [product, cats] = await Promise.all([
    prisma.product.findUnique({ where: { id } }),
    prisma.category.findMany({ orderBy: { sortOrder: "asc" }, include: { parent: true } }),
  ]);
  if (!product) notFound();

  const categories = cats.map((c) => ({
    id: c.id,
    label: c.parent ? `${c.parent.name} → ${c.name}` : c.name,
  }));

  return (
    <div>
      <h1 className="font-heading text-2xl font-semibold text-ink">Edit product</h1>
      <div className="mt-6">
        <ProductForm product={product} categories={categories} />
      </div>
    </div>
  );
}
