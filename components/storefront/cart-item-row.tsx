"use client";

import Image from "next/image";
import Link from "next/link";
import { useTransition } from "react";
import { Trash2 } from "lucide-react";

import { removeCartItem, updateCartItem } from "@/app/actions/cart";
import { formatPrice } from "@/lib/utils";

import { MediaPlaceholder } from "./media";
import { QuantityStepper } from "./quantity-stepper";

type CartRowItem = {
  id: string;
  quantity: number;
  product: {
    slug: string;
    name: string;
    priceCents: number;
    currency: string;
    images: string[];
    stock: number;
  };
};

export function CartItemRow({ item }: { item: CartRowItem }) {
  const [pending, startTransition] = useTransition();
  const image = item.product.images[0];

  return (
    <div className={pending ? "flex gap-4 py-5 opacity-60" : "flex gap-4 py-5"}>
      <Link
        href={`/products/${item.product.slug}`}
        className="relative h-24 w-24 shrink-0 overflow-hidden rounded-xl bg-cream"
      >
        {image ? (
          <Image src={image} alt={item.product.name} fill sizes="96px" className="object-cover" />
        ) : (
          <MediaPlaceholder label={item.product.name} />
        )}
      </Link>

      <div className="flex flex-1 flex-col">
        <div className="flex justify-between gap-4">
          <Link
            href={`/products/${item.product.slug}`}
            className="font-medium text-ink hover:text-gold"
          >
            {item.product.name}
          </Link>
          <span className="font-semibold text-mocha-dark">
            {formatPrice(item.product.priceCents * item.quantity, item.product.currency)}
          </span>
        </div>
        <span className="text-sm text-mocha">
          {formatPrice(item.product.priceCents, item.product.currency)} each
        </span>

        <div className="mt-auto flex items-center justify-between pt-3">
          <QuantityStepper
            value={item.quantity}
            max={Math.max(item.quantity, item.product.stock)}
            onChange={(q) => startTransition(() => updateCartItem(item.id, q))}
          />
          <button
            type="button"
            disabled={pending}
            onClick={() => startTransition(() => removeCartItem(item.id))}
            className="flex items-center gap-1.5 text-sm text-mocha transition hover:text-red-600"
          >
            <Trash2 className="h-4 w-4" /> Remove
          </button>
        </div>
      </div>
    </div>
  );
}
