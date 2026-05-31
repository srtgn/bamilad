import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ChevronRight, Leaf, Truck, RefreshCw } from "lucide-react";

import { AddToCart } from "@/components/storefront/add-to-cart";
import { MediaPlaceholder } from "@/components/storefront/media";
import { ProductCard } from "@/components/storefront/product-card";
import { Container } from "@/components/ui/container";
import { getProductBySlug, getRelatedProducts } from "@/lib/queries";
import { formatPrice } from "@/lib/utils";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) return { title: "Product not found" };
  return { title: product.name, description: product.description };
}

export default async function ProductPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) notFound();

  const related = await getRelatedProducts(product.categoryId, product.id, 4);
  const image = product.images[0];

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: product.description,
    ...(product.sku ? { sku: product.sku } : {}),
    offers: {
      "@type": "Offer",
      price: (product.priceCents / 100).toFixed(2),
      priceCurrency: product.currency,
      availability:
        product.stock > 0
          ? "https://schema.org/InStock"
          : "https://schema.org/OutOfStock",
    },
  };

  return (
    <Container className="py-10 sm:py-14">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <nav className="flex flex-wrap items-center gap-1 text-xs text-mocha">
        <Link href="/" className="hover:text-gold">Home</Link>
        <ChevronRight className="h-3 w-3" />
        <Link href="/shop" className="hover:text-gold">Shop</Link>
        {product.category ? (
          <>
            <ChevronRight className="h-3 w-3" />
            <Link href={`/shop/${product.category.slug}`} className="hover:text-gold">
              {product.category.name}
            </Link>
          </>
        ) : null}
        <ChevronRight className="h-3 w-3" />
        <span className="text-ink">{product.name}</span>
      </nav>

      <div className="mt-8 grid gap-10 lg:grid-cols-2">
        <div className="relative aspect-square overflow-hidden rounded-3xl bg-cream">
          {image ? (
            <Image
              src={image}
              alt={product.name}
              fill
              sizes="(max-width:1024px) 100vw, 50vw"
              className="object-cover"
              priority
            />
          ) : (
            <MediaPlaceholder label={product.name} />
          )}
        </div>

        <div>
          {product.category ? (
            <Link
              href={`/shop/${product.category.slug}`}
              className="text-sm font-semibold uppercase tracking-[0.2em] text-mocha hover:text-gold"
            >
              {product.category.name}
            </Link>
          ) : null}
          <h1 className="mt-2 font-heading text-3xl font-semibold text-ink sm:text-4xl">
            {product.name}
          </h1>

          <div className="mt-4 flex items-center gap-3">
            <span className="text-2xl font-semibold text-mocha-dark">
              {formatPrice(product.priceCents, product.currency)}
            </span>
            {product.compareAtPriceCents ? (
              <span className="text-lg text-mocha-light line-through">
                {formatPrice(product.compareAtPriceCents, product.currency)}
              </span>
            ) : null}
          </div>

          <p className="mt-3 text-sm">
            {product.stock > 0 ? (
              <span className="text-green-700">
                In stock{product.stock <= 10 ? ` — only ${product.stock} left` : ""}
              </span>
            ) : (
              <span className="text-red-600">Out of stock</span>
            )}
          </p>

          <p className="mt-6 leading-relaxed text-mocha-dark">{product.description}</p>

          <div className="mt-8">
            <AddToCart productId={product.id} maxStock={product.stock} />
          </div>

          <ul className="mt-8 space-y-3 border-t border-mocha/15 pt-6 text-sm text-mocha-dark">
            <li className="flex items-center gap-3">
              <Truck className="h-4 w-4 text-mocha" /> Free shipping on orders over $100
            </li>
            <li className="flex items-center gap-3">
              <Leaf className="h-4 w-4 text-mocha" /> Clean, cruelty-free formula
            </li>
            <li className="flex items-center gap-3">
              <RefreshCw className="h-4 w-4 text-mocha" /> 30-day easy returns
            </li>
          </ul>
        </div>
      </div>

      {related.length > 0 && (
        <section className="mt-20">
          <h2 className="font-heading text-2xl font-semibold text-ink">
            You may also like
          </h2>
          <div className="mt-8 grid grid-cols-2 gap-x-6 gap-y-10 md:grid-cols-4">
            {related.map((item) => (
              <ProductCard key={item.id} product={item} />
            ))}
          </div>
        </section>
      )}
    </Container>
  );
}
