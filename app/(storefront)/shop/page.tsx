import type { Metadata } from "next";
import Link from "next/link";

import { PageHeader } from "@/components/storefront/page-header";
import { ProductGrid } from "@/components/storefront/product-grid";
import { Container } from "@/components/ui/container";
import { getAllActiveProducts, getCategoryTree } from "@/lib/queries";

export const metadata: Metadata = {
  title: "Shop",
  description: "Browse all clean, science-backed beauty essentials.",
};

export default async function ShopPage() {
  const [products, tree] = await Promise.all([
    getAllActiveProducts(),
    getCategoryTree(),
  ]);

  return (
    <>
      <PageHeader
        title="Shop"
        subtitle="Thoughtfully crafted beauty essentials for every routine."
      />
      <Container className="py-12">
        <div className="mb-8 flex flex-wrap gap-2">
          <span className="rounded-full bg-mocha px-4 py-2 text-sm font-medium text-white">
            All
          </span>
          {tree.map((c) => (
            <Link
              key={c.id}
              href={`/shop/${c.slug}`}
              className="rounded-full border border-mocha/30 px-4 py-2 text-sm font-medium text-mocha-dark transition hover:border-mocha hover:bg-cream"
            >
              {c.name}
            </Link>
          ))}
        </div>

        <ProductGrid products={products} />

        <p className="mt-8 text-sm text-mocha">{products.length} products</p>
      </Container>
    </>
  );
}
