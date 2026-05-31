"use server";

import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";

import { CART_COOKIE } from "@/lib/cart";
import { prisma } from "@/lib/prisma";

async function getOrCreateCartId() {
  const store = await cookies();
  const existing = store.get(CART_COOKIE)?.value;
  if (existing) {
    const found = await prisma.cart.findUnique({
      where: { id: existing },
      select: { id: true },
    });
    if (found) return existing;
  }
  const cart = await prisma.cart.create({ data: {} });
  store.set(CART_COOKIE, cart.id, {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 30,
  });
  return cart.id;
}

export async function addToCart(productId: string, quantity = 1) {
  const cartId = await getOrCreateCartId();
  await prisma.cartItem.upsert({
    where: { cartId_productId: { cartId, productId } },
    update: { quantity: { increment: quantity } },
    create: { cartId, productId, quantity },
  });
  revalidatePath("/", "layout");
}

export async function updateCartItem(itemId: string, quantity: number) {
  if (quantity <= 0) {
    await prisma.cartItem.delete({ where: { id: itemId } }).catch(() => {});
  } else {
    await prisma.cartItem.update({ where: { id: itemId }, data: { quantity } });
  }
  revalidatePath("/", "layout");
}

export async function removeCartItem(itemId: string) {
  await prisma.cartItem.delete({ where: { id: itemId } }).catch(() => {});
  revalidatePath("/", "layout");
}
