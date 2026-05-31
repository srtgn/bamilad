import { randomBytes } from "node:crypto";

import { Prisma } from "@/generated/prisma/client";
import { sendOrderConfirmationEmail } from "@/lib/email";
import { prisma } from "@/lib/prisma";
import { formatPrice } from "@/lib/utils";

export function generateOrderNumber() {
  return `SRQ-${randomBytes(4).toString("hex").toUpperCase()}`;
}

/**
 * Marks a PENDING order PAID, decrements stock, clears the cart, and emails a
 * confirmation. Idempotent: if the order isn't PENDING it returns early, so it's
 * safe to call from the Stripe webhook (which may deliver an event more than once).
 */
export async function fulfillOrder(
  orderId: string,
  opts: {
    cartId?: string;
    email?: string;
    paymentIntentId?: string;
    shippingAddress?: Prisma.InputJsonValue;
  } = {},
) {
  const order = await prisma.order.findUnique({
    where: { id: orderId },
    include: { items: true },
  });
  if (!order || order.status !== "PENDING") return order;

  const data: Prisma.OrderUpdateInput = { status: "PAID" };
  if (opts.email) data.email = opts.email;
  if (opts.paymentIntentId) data.stripePaymentIntentId = opts.paymentIntentId;
  if (opts.shippingAddress) data.shippingAddress = opts.shippingAddress;

  const stockOps = order.items
    .filter((item) => item.productId)
    .map((item) =>
      prisma.product.update({
        where: { id: item.productId! },
        data: { stock: { decrement: item.quantity } },
      }),
    );

  await prisma.$transaction([
    prisma.order.update({ where: { id: orderId }, data }),
    ...stockOps,
  ]);

  if (opts.cartId) {
    await prisma.cartItem.deleteMany({ where: { cartId: opts.cartId } });
  }

  const itemsHtml = order.items
    .map(
      (item) =>
        `<tr><td style="padding:4px 0">${item.name} × ${item.quantity}</td><td style="padding:4px 0;text-align:right">${formatPrice(item.priceCents * item.quantity, order.currency)}</td></tr>`,
    )
    .join("");
  await sendOrderConfirmationEmail(order.email || opts.email || "", {
    orderNumber: order.orderNumber,
    totalLabel: formatPrice(order.totalCents, order.currency),
    itemsHtml,
  });

  return order;
}
