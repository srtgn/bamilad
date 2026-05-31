import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { PageHeader } from "@/components/storefront/page-header";
import { ProductGrid } from "@/components/storefront/product-grid";
import { Container } from "@/components/ui/container";
import { getCategoryBySlug, getProductsForCategory } from "@/lib/queries";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ category: string }>;
}): Promise<Metadata> {
  const { category: slug } = await params;
  const category = await getCategoryBySlug(slug);
  if (!category) return { title: "Category not found" };
  return {
    title: category.name,
    description: category.description ?? `Shop ${category.name} at our store.`,
  };
}

export default async function CategoryPage({
  params,
}: {
  params: Promise<{ category: string }>;
}) {
  const { category: slug } = await params;
  const { category, products } = await getProductsForCategory(slug);
  if (!category) notFound();

  return (
    <>
      <PageHeader title={category.name} subtitle={category.description ?? undefined} />
      <Container className="py-12">
        <div className="mb-8 flex flex-wrap gap-2">
          <Link
            href="/shop"
            className="rounded-full border border-mocha/30 px-4 py-2 text-sm font-medium text-mocha-dark transition hover:border-mocha hover:bg-cream"
          >
            All products
          </Link>
          {category.children.map((child) => (
            <Link
              key={child.id}
              href={`/shop/${child.slug}`}
              className="rounded-full border border-mocha/30 px-4 py-2 text-sm font-medium text-mocha-dark transition hover:border-mocha hover:bg-cream"
            >
              {child.name}
            </Link>
          ))}
        </div>

        <ProductGrid products={products} />

        <p className="mt-8 text-sm text-mocha">{products.length} products</p>
      </Container>
    </>
  );
}
