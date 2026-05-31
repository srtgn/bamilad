/**
 * Central brand configuration. Change `name` (and the rest here) to rebrand the
 * entire storefront in one place — e.g. swap "SERENIQ" for "Bamilad".
 */
export const siteConfig = {
  name: "SERENIQ",
  legalName: "SERENIQ Inc.",
  tagline: "Nourish Naturally",
  description:
    "Clean, science-backed beauty essentials. We blend nature-inspired ingredients with skin science to nourish, protect, and enhance your skin's natural glow.",
  url: process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000",
  announcement: "Free Shipping on Orders Over $100 — Nourish Naturally!",
  freeShippingThresholdCents: 10_000,
  currency: "USD",
  locale: "en-US",
  support: {
    email: "support@sereniq.com",
    phone: "1-800-123-4567",
    hours: "Live chat: Monday–Friday, 9am–5pm EST",
  },
  social: {
    instagram: "https://instagram.com",
    tiktok: "https://tiktok.com",
    facebook: "https://facebook.com",
  },
} as const;

export type SiteConfig = typeof siteConfig;
