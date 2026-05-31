import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { PageHeader } from "@/components/storefront/page-header";
import { Container } from "@/components/ui/container";
import { siteConfig } from "@/lib/site-config";

const docs: Record<string, { title: string; body: string }> = {
  privacy: {
    title: "Privacy Policy",
    body: `<p>${siteConfig.name} respects your privacy. This policy explains what we collect and how we use it.</p>
<h2>Information we collect</h2>
<p>We collect the information you provide when you create an account or place an order — your name, email, shipping address, and order history. Payment details are handled securely by our payment processor (Stripe) and never stored on our servers.</p>
<h2>How we use it</h2>
<p>We use your information to process orders, provide support, and improve our products and service. We do not sell your personal data.</p>
<h2>Cookies</h2>
<p>We use essential cookies to keep you signed in and remember your cart, and optional cookies to understand how the site is used. You can manage your choice from the cookie banner.</p>
<h2>Your rights</h2>
<p>You may request access to, correction of, or deletion of your personal data at any time by contacting ${siteConfig.support.email}.</p>`,
  },
  terms: {
    title: "Terms of Service",
    body: `<p>By using ${siteConfig.name} you agree to these terms.</p>
<h2>Orders</h2>
<p>All orders are subject to acceptance and availability. We reserve the right to refuse or cancel an order. Prices are listed in ${siteConfig.currency} and may change without notice.</p>
<h2>Accounts</h2>
<p>You are responsible for keeping your account credentials secure and for all activity under your account.</p>
<h2>Products</h2>
<p>We aim to describe our products accurately, but colors and finishes may vary slightly. Our products are cosmetics and are not intended to diagnose or treat any condition.</p>
<h2>Liability</h2>
<p>To the fullest extent permitted by law, ${siteConfig.legalName} is not liable for indirect or consequential damages arising from use of the site or products.</p>`,
  },
  refund: {
    title: "Returns & Refunds",
    body: `<p>We want you to love your purchase. If you don't, here's how returns work.</p>
<h2>30-day returns</h2>
<p>You may return unopened products within 30 days of delivery for a full refund. Opened products may be eligible for store credit if there is a quality issue.</p>
<h2>How to start a return</h2>
<p>Email ${siteConfig.support.email} with your order number and we'll send a prepaid return label.</p>
<h2>Refund timing</h2>
<p>Once we receive your return, refunds are issued to your original payment method within 5–10 business days.</p>`,
  },
  shipping: {
    title: "Shipping Policy",
    body: `<p>Here's what to expect when your order ships.</p>
<h2>Processing</h2>
<p>Orders are processed within 1–2 business days. You'll receive a confirmation email when your order is on its way.</p>
<h2>Rates & delivery</h2>
<p>Standard shipping is a flat rate, and orders over $100 ship free. Delivery typically takes 3–7 business days depending on your location.</p>
<h2>International</h2>
<p>We currently ship within the US, Canada, the UK, and Australia. Duties and taxes may apply on international orders.</p>`,
  },
};

export function generateStaticParams() {
  return Object.keys(docs).map((doc) => ({ doc }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ doc: string }>;
}): Promise<Metadata> {
  const { doc } = await params;
  const d = docs[doc];
  return d ? { title: d.title } : { title: "Not found" };
}

export default async function LegalPage({
  params,
}: {
  params: Promise<{ doc: string }>;
}) {
  const { doc } = await params;
  const d = docs[doc];
  if (!d) notFound();

  return (
    <>
      <PageHeader title={d.title} />
      <Container className="max-w-3xl py-12">
        <div
          className="space-y-4 text-[15px] leading-relaxed text-mocha-dark [&_h2]:mt-8 [&_h2]:font-heading [&_h2]:text-xl [&_h2]:font-semibold [&_h2]:text-ink"
          dangerouslySetInnerHTML={{ __html: d.body }}
        />
        <p className="mt-10 text-xs text-mocha-light">
          This is a starter template — please review with legal counsel before launch.
        </p>
      </Container>
    </>
  );
}
