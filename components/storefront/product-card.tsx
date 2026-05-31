import Image from "next/image";
import Link from "next/link";

import { MediaPlaceholder } from "@/components/storefront/media";
import { formatPrice } from "@/lib/utils";

export type ProductCardData = {
  slug: string;
  name: string;
  priceCents: number;
  compareAtPriceCents: number | null;
  images: string[];
  currency: string;
};

export function ProductCard({ product }: { product: ProductCardData }) {
  const image = product.images[0];

  return (
    <Link href={`/products/${product.slug}`} className="group block">
      <div className="relative aspect-square overflow-hidden rounded-2xl bg-cream">
        {image ? (
          <Image
            src={image}
            alt={product.name}
            fill
            sizes="(max-width:768px) 50vw, 25vw"
            className="object-cover transition duration-500 group-hover:scale-105"
          />
        ) : (
          <MediaPlaceholder
            label={product.name}
            className="transition duration-500 group-hover:scale-105"
          />
        )}
        {product.compareAtPriceCents ? (
          <span className="absolute left-3 top-3 rounded-full bg-gold px-3 py-1 text-xs font-semibold text-white">
            Sale
          </span>
        ) : null}
      </div>
      <h3 className="mt-3 text-sm font-medium text-ink">{product.name}</h3>
      <div className="mt-1 flex items-center gap-2">
        <span className="text-sm font-semibold text-mocha-dark">
          {formatPrice(product.priceCents, product.currency)}
        </span>
        {product.compareAtPriceCents ? (
          <span className="text-xs text-mocha-light line-through">
            {formatPrice(product.compareAtPriceCents, product.currency)}
          </span>
        ) : null}
      </div>
    </Link>
  );
}
