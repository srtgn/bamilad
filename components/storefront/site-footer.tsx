import Link from "next/link";

import { FacebookIcon, InstagramIcon } from "@/components/icons/social-icons";
import { Container } from "@/components/ui/container";
import { siteConfig } from "@/lib/site-config";

type FooterCategory = { name: string; slug: string };

export function SiteFooter({ categories }: { categories: FooterCategory[] }) {
  return (
    <footer className="mt-auto bg-mocha text-cream">
      <Container className="py-14">
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-4">
          <div>
            <p className="font-heading text-2xl font-semibold tracking-[0.2em] text-white">
              {siteConfig.name}
            </p>
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-cream/80">
              {siteConfig.description}
            </p>
            <div className="mt-5 flex gap-3">
              <a
                href={siteConfig.social.instagram}
                aria-label="Instagram"
                className="flex h-9 w-9 items-center justify-center rounded-full bg-white/10 transition hover:bg-white/20"
              >
                <InstagramIcon className="h-4 w-4" />
              </a>
              <a
                href={siteConfig.social.facebook}
                aria-label="Facebook"
                className="flex h-9 w-9 items-center justify-center rounded-full bg-white/10 transition hover:bg-white/20"
              >
                <FacebookIcon className="h-4 w-4" />
              </a>
            </div>
          </div>

          <FooterColumn title="Shop">
            {categories.map((c) => (
              <FooterLink key={c.slug} href={`/shop/${c.slug}`}>
                {c.name}
              </FooterLink>
            ))}
            <FooterLink href="/shop">All products</FooterLink>
          </FooterColumn>

          <FooterColumn title="Company">
            <FooterLink href="/about">About us</FooterLink>
            <FooterLink href="/blogs">Blogs</FooterLink>
            <FooterLink href="/contact">Contact</FooterLink>
          </FooterColumn>

          <FooterColumn title="Support">
            <FooterLink href="/legal/shipping">Shipping</FooterLink>
            <FooterLink href="/legal/refund">Returns &amp; refunds</FooterLink>
            <FooterLink href="/legal/privacy">Privacy policy</FooterLink>
            <FooterLink href="/legal/terms">Terms of service</FooterLink>
          </FooterColumn>
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-white/15 pt-6 text-sm text-cream/70 sm:flex-row">
          <p>
            © {new Date().getFullYear()} {siteConfig.legalName}. All rights reserved.
          </p>
          <p>{siteConfig.support.email}</p>
        </div>
      </Container>
    </footer>
  );
}

function FooterColumn({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <h4 className="font-heading text-sm font-semibold uppercase tracking-wider text-white">
        {title}
      </h4>
      <ul className="mt-4 space-y-2.5">{children}</ul>
    </div>
  );
}

function FooterLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <li>
      <Link href={href} className="text-sm text-cream/80 transition hover:text-white">
        {children}
      </Link>
    </li>
  );
}
