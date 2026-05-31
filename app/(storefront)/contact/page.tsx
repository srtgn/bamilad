import type { Metadata } from "next";
import { ArrowRight, Mail, Phone, MessageCircle } from "lucide-react";

import { MediaPlaceholder } from "@/components/storefront/media";
import { PageHeader } from "@/components/storefront/page-header";
import { buttonStyles } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { siteConfig } from "@/lib/site-config";

export const metadata: Metadata = {
  title: "Contact Us",
  description: `Get in touch with the ${siteConfig.name} customer support team.`,
};

export default function ContactPage() {
  return (
    <>
      <PageHeader title="Contact Us" />
      <section className="py-14 sm:py-20">
        <Container>
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-mocha">
            Contact Us
          </p>
          <h2 className="mt-3 font-heading text-3xl font-semibold text-gold">
            Get In Touch With Us
          </h2>
          <p className="mt-4 max-w-3xl leading-relaxed text-mocha-dark">
            We are a wellness-focused beauty brand dedicated to creating clean,
            science-backed skincare that supports your body and mind. Our formulations
            combine natural ingredients with modern research to help you feel your best
            every day. Have a question or need a hand? We&apos;re here for you.
          </p>

          <div className="mt-10 grid items-stretch gap-8 lg:grid-cols-2">
            <div className="relative min-h-[420px] overflow-hidden rounded-3xl">
              <MediaPlaceholder label={siteConfig.name} tone="dark" />
            </div>

            <div className="flex flex-col rounded-3xl bg-cream-soft p-8 sm:p-10">
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-mocha">
                Contact Us
              </p>
              <h3 className="mt-3 font-heading text-2xl font-semibold text-gold">
                Customer Support
              </h3>
              <p className="mt-4 leading-relaxed text-mocha-dark">
                For any product-related inquiries or help with your order, please
                don&apos;t hesitate to reach out to our customer support team.
              </p>

              <ul className="mt-6 space-y-4 text-mocha-dark">
                <li className="flex items-center gap-3">
                  <Mail className="h-5 w-5 text-mocha" />
                  <a href={`mailto:${siteConfig.support.email}`} className="hover:text-gold">
                    {siteConfig.support.email}
                  </a>
                </li>
                <li className="flex items-center gap-3">
                  <Phone className="h-5 w-5 text-mocha" />
                  <a href={`tel:${siteConfig.support.phone}`} className="hover:text-gold">
                    {siteConfig.support.phone}
                  </a>
                </li>
                <li className="flex items-start gap-3">
                  <MessageCircle className="mt-0.5 h-5 w-5 text-mocha" />
                  <span>{siteConfig.support.hours}</span>
                </li>
              </ul>

              <a
                href={`mailto:${siteConfig.support.email}`}
                className={buttonStyles("primary", "mt-8 self-start")}
              >
                Get in touch <ArrowRight className="h-4 w-4" />
              </a>
            </div>
          </div>
        </Container>
      </section>
    </>
  );
}
