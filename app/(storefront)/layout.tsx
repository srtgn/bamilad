import { AnnouncementBar } from "@/components/storefront/announcement-bar";
import { CookieConsent } from "@/components/storefront/cookie-consent";
import { FloatingActions } from "@/components/storefront/floating-actions";
import { SiteFooter } from "@/components/storefront/site-footer";
import { SiteHeader } from "@/components/storefront/site-header";
import { getCartCount } from "@/lib/cart";
import { getCategoryTree } from "@/lib/queries";

export default async function StorefrontLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [tree, cartCount] = await Promise.all([getCategoryTree(), getCartCount()]);

  const categories = tree.map((c) => ({
    id: c.id,
    name: c.name,
    slug: c.slug,
    children: c.children.map((child) => ({
      id: child.id,
      name: child.name,
      slug: child.slug,
    })),
  }));

  const footerCategories = tree.map((c) => ({ name: c.name, slug: c.slug }));

  return (
    <>
      <AnnouncementBar />
      <SiteHeader categories={categories} />
      <FloatingActions cartCount={cartCount} />
      <div className="flex-1">{children}</div>
      <SiteFooter categories={footerCategories} />
      <CookieConsent />
    </>
  );
}
