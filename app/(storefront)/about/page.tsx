import type { Metadata } from "next";

import { MediaPlaceholder } from "@/components/storefront/media";
import { PageHeader } from "@/components/storefront/page-header";
import { Container } from "@/components/ui/container";
import { siteConfig } from "@/lib/site-config";

export const metadata: Metadata = {
  title: "About Us",
  description: `Learn about ${siteConfig.name} — ${siteConfig.tagline}.`,
};

export default function AboutPage() {
  return (
    <>
      <PageHeader title="About Us" />
      <section className="py-14 sm:py-20">
        <Container>
          <div className="grid items-stretch gap-8 lg:grid-cols-2">
            <div className="relative min-h-[420px] overflow-hidden rounded-3xl">
              <MediaPlaceholder label={siteConfig.name} tone="dark" />
            </div>

            <div className="rounded-3xl bg-cream-soft p-8 sm:p-10">
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-mocha">
                {siteConfig.name}
              </p>
              <h2 className="mt-3 font-heading text-3xl font-semibold text-gold">
                Nourish Your Skin
              </h2>

              <div className="mt-6 space-y-6 text-mocha-dark">
                <div>
                  <h3 className="font-heading text-base font-semibold text-ink">
                    Who We Are
                  </h3>
                  <p className="mt-2 leading-relaxed">
                    {siteConfig.name} is a modern skincare brand dedicated to creating
                    clean, effective, and thoughtfully formulated beauty essentials. We
                    blend nature-inspired ingredients with skin science to deliver
                    products that nourish, protect, and enhance your skin&apos;s natural
                    glow.
                  </p>
                </div>
                <div>
                  <h3 className="font-heading text-base font-semibold text-ink">
                    Mission Statement
                  </h3>
                  <p className="mt-2 leading-relaxed">
                    Our mission is to simplify skincare through purposeful formulations
                    that deliver visible results without compromise. We create
                    high-quality products that are gentle, effective, and suitable for
                    daily use. By focusing on clean ingredients, responsible sourcing,
                    and skin-friendly innovation, {siteConfig.name} empowers individuals
                    to build mindful beauty routines that support long-term skin health,
                    confidence, and self-care.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </Container>
      </section>
    </>
  );
}
