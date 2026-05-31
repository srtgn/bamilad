import { cookies } from "next/headers";

import { prisma } from "@/lib/prisma";

export const CART_COOKIE = "sereniq_cart";

/** Read the current cart (with items + products) from the cart cookie. */
export async function getCart() {
  const store = await cookies();
  const id = store.get(CART_COOKIE)?.value;
  if (!id) return null;
  return prisma.cart.findUnique({
    where: { id },
    include: {
      items: {
        include: { product: true },
        orderBy: { id: "asc" },
      },
    },
  });
}

export type CartWithItems = NonNullable<Awaited<ReturnType<typeof getCart>>>;

export async function getCartCount() {
  const cart = await getCart();
  return cart?.items.reduce((sum, item) => sum + item.quantity, 0) ?? 0;
}

export function cartSubtotalCents(cart: CartWithItems) {
  return cart.items.reduce(
    (sum, item) => sum + item.product.priceCents * item.quantity,
    0,
  );
}
