"use client";

import { useState, useTransition } from "react";
import { Check, ShoppingBag } from "lucide-react";

import { addToCart } from "@/app/actions/cart";
import { buttonStyles } from "@/components/ui/button";

import { QuantityStepper } from "./quantity-stepper";

export function AddToCart({
  productId,
  maxStock,
}: {
  productId: string;
  maxStock: number;
}) {
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);
  const [pending, startTransition] = useTransition();
  const soldOut = maxStock <= 0;

  return (
    <div className="flex flex-wrap items-center gap-4">
      <QuantityStepper value={qty} onChange={setQty} max={Math.max(1, maxStock)} />
      <button
        type="button"
        disabled={soldOut || pending}
        onClick={() =>
          startTransition(async () => {
            await addToCart(productId, qty);
            setAdded(true);
            setTimeout(() => setAdded(false), 2000);
          })
        }
        className={buttonStyles("primary", "min-w-[190px]")}
      >
        {added ? (
          <>
            <Check className="h-4 w-4" /> Added to cart
          </>
        ) : (
          <>
            <ShoppingBag className="h-4 w-4" />
            {soldOut ? "Out of stock" : pending ? "Adding…" : "Add to cart"}
          </>
        )}
      </button>
    </div>
  );
}
