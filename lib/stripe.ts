import Stripe from "stripe";

const key = process.env.STRIPE_SECRET_KEY;

/** True only when a real Stripe secret key is present (not the placeholder). */
export const isStripeConfigured = Boolean(
  key && key.startsWith("sk_") && key !== "sk_test_xxx",
);

// Safe to construct with a placeholder — no network call happens until used.
export const stripe = new Stripe(key ?? "sk_test_placeholder");
