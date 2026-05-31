import type { NextRequest } from "next/server";
import type Stripe from "stripe";

import { fulfillOrder } from "@/lib/orders";
import { stripe } from "@/lib/stripe";

export async function POST(req: NextRequest) {
  const body = await req.text();
  const signature = req.headers.get("stripe-signature");
  const secret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!signature || !secret || secret === "whsec_xxx") {
    return new Response("Webhook secret not configured", { status: 400 });
  }

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(body, signature, secret);
  } catch {
    return new Response("Invalid signature", { status: 400 });
  }

  if (event.type === "checkout.session.completed") {
    const s = event.data.object as Stripe.Checkout.Session;
    const orderId = s.metadata?.orderId;
    if (orderId) {
      await fulfillOrder(orderId, {
        cartId: s.metadata?.cartId ?? undefined,
        email: s.customer_details?.email ?? undefined,
        paymentIntentId:
          typeof s.payment_intent === "string" ? s.payment_intent : undefined,
        shippingAddress: s.customer_details?.address
          ? { ...s.customer_details.address }
          : undefined,
      });
    }
  }

  return new Response("ok", { status: 200 });
}
