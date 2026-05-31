"use server";

import { redirect } from "next/navigation";

import { auth } from "@/auth";
import { cartSubtotalCents, getCart } from "@/lib/cart";
import { fulfillOrder, generateOrderNumber } from "@/lib/orders";
import { prisma } from "@/lib/prisma";
import { siteConfig } from "@/lib/site-config";
import { isStripeConfigured, stripe } from "@/lib/stripe";

const FLAT_SHIPPING_CENTS = 800;

export async function createCheckoutSession() {
  const cart = await getCart();
  if (!cart || cart.items.length === 0) redirect("/cart");

  const session = await auth();
  const subtotalCents = cartSubtotalCents(cart);
  const shippingCents =
    subtotalCents >= siteConfig.freeShippingThresholdCents ? 0 : FLAT_SHIPPING_CENTS;
  const totalCents = subtotalCents + shippingCents;

  const order = await prisma.order.create({
    data: {
      orderNumber: generateOrderNumber(),
      userId: session?.user?.id ?? null,
      email: session?.user?.email ?? "",
      status: "PENDING",
      subtotalCents,
      shippingCents,
      totalCents,
      currency: siteConfig.currency,
      items: {
        create: cart.items.map((item) => ({
          productId: item.productId,
          name: item.product.name,
          priceCents: item.product.priceCents,
          quantity: item.quantity,
        })),
      },
    },
  });

  // Dev/demo fallback: with no real Stripe key, simulate a successful payment so
  // the full purchase flow is testable locally. Add a real key to use Stripe.
  if (!isStripeConfigured) {
    await fulfillOrder(order.id, {
      cartId: cart.id,
      email: order.email || session?.user?.email || "guest@sereniq.test",
    });
    redirect(`/checkout/success?order=${order.orderNumber}`);
  }

  const currency = siteConfig.currency.toLowerCase();
  const checkout = await stripe.checkout.sessions.create({
    mode: "payment",
    line_items: cart.items.map((item) => ({
      quantity: item.quantity,
      price_data: {
        currency,
        unit_amount: item.product.priceCents,
        product_data: { name: item.product.name },
      },
    })),
    customer_email: session?.user?.email ?? undefined,
    shipping_address_collection: { allowed_countries: ["US", "CA", "GB", "AU"] },
    shipping_options: [
      {
        shipping_rate_data: {
          type: "fixed_amount",
          display_name: shippingCents === 0 ? "Free shipping" : "Standard shipping",
          fixed_amount: { amount: shippingCents, currency },
        },
      },
    ],
    metadata: { orderId: order.id, cartId: cart.id },
    success_url: `${siteConfig.url}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${siteConfig.url}/checkout/cancel`,
  });

  await prisma.order.update({
    where: { id: order.id },
    data: { stripeSessionId: checkout.id },
  });

  redirect(checkout.url!);
}
