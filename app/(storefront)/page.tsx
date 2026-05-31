import Link from "next/link";
import { ArrowRight, Globe, Coins, Leaf, ShieldCheck, Sparkles } from "lucide-react";

import { BlogCard } from "@/components/storefront/blog-card";
import { CategoryCarousel } from "@/components/storefront/category-carousel";
import { Marquee } from "@/components/storefront/marquee";
import { ProductCard } from "@/components/storefront/product-card";
import { buttonStyles } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import {
  getCarouselCategories,
  getFeaturedProducts,
  getRecentBlogPosts,
  getTrendingProducts,
} from "@/lib/queries";
import { siteConfig } from "@/lib/site-config";

export default async function HomePage() {
  const [categories, trending, featured, posts] = await Promise.all([
    getCarouselCategories(10),
    getTrendingProducts(8),
    getFeaturedProducts(4),
    getRecentBlogPosts(2),
  ]);

  const gridProducts = (trending.length ? trending : featured).slice(0, 8);

  return (
    <>
      {/* ─── Hero ─────────────────────────────────────────────── */}
      <section className="relative overflow-hidden bg-gradient-to-br from-mocha-light via-mocha to-mocha-dark">
        <div className="pointer-events-none absolute -left-24 top-10 h-72 w-72 rounded-full bg-white/10 blur-3xl" />
        <div className="pointer-events-none absolute -right-16 bottom-0 h-80 w-80 rounded-full bg-gold/20 blur-3xl" />

        <div className="relative mx-auto flex min-h-[80vh] max-w-7xl flex-col items-center justify-center px-6 py-24 text-center">
          <h1 className="pointer-events-none select-none font-heading text-5xl font-bold leading-[1.05] tracking-tight text-white/20 sm:text-7xl lg:text-[7rem]">
            Nurture Your
            <br />
            Mind &amp; Body
          </h1>
          <div className="relative z-10 -mt-4 max-w-xl">
            <p className="text-base leading-relaxed text-white/90 sm:text-lg">
              {siteConfig.description}
            </p>
            <Link href="/shop" className={buttonStyles("light", "mt-7")}>
              Explore more <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>

        <div className="absolute bottom-6 left-6 hidden sm:block">
          <Selector icon={<Globe className="h-4 w-4" />} label="English" />
        </div>
        <div className="absolute bottom-6 right-6 hidden sm:block">
          <Selector icon={<Coins className="h-4 w-4" />} label="Dollars" />
        </div>
      </section>

      {/* ─── Categories ───────────────────────────────────────── */}
      <section className="py-16 sm:py-20">
        <Container>
          <div className="mb-8 flex flex-col items-end text-right">
            <h2 className="font-heading text-sm font-semibold uppercase tracking-[0.25em] text-gold">
              Categories
            </h2>
            <p className="mt-2 max-w-md text-sm text-mocha">
              Explore thoughtfully curated categories designed to meet your beauty,
              skincare, and self-care needs with quality products for every routine.
            </p>
          </div>
          <CategoryCarousel
            categories={categories.map((c) => ({
              name: c.name,
              slug: c.slug,
              image: c.image,
            }))}
          />
        </Container>
      </section>

      <Marquee />

      {/* ─── Trending products ────────────────────────────────── */}
      <section className="py-16 sm:py-20">
        <Container>
          <div className="mb-8 flex items-end justify-between">
            <h2 className="font-heading text-2xl font-semibold tracking-tight text-ink sm:text-3xl">
              Trending products
            </h2>
            <Link
              href="/shop"
              className="inline-flex items-center gap-1 text-sm font-medium text-mocha-dark hover:text-gold"
            >
              View all <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
          <div className="grid grid-cols-2 gap-x-6 gap-y-10 md:grid-cols-4">
            {gridProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </Container>
      </section>

      {/* ─── Brand promise strip ──────────────────────────────── */}
      <section className="bg-cream py-14">
        <Container>
          <div className="grid gap-8 sm:grid-cols-3">
            <Feature
              icon={<Leaf className="h-6 w-6" />}
              title="Clean ingredients"
              body="Nature-inspired formulas, responsibly sourced and skin-friendly."
            />
            <Feature
              icon={<ShieldCheck className="h-6 w-6" />}
              title="Science-backed"
              body="Every active is chosen for proven, visible results."
            />
            <Feature
              icon={<Sparkles className="h-6 w-6" />}
              title="Made for daily use"
              body="Gentle, effective essentials for long-term skin health."
            />
          </div>
        </Container>
      </section>

      {/* ─── Journal ──────────────────────────────────────────── */}
      {posts.length > 0 && (
        <section className="py-16 sm:py-20">
          <Container>
            <div className="mb-8 flex items-end justify-between">
              <div>
                <h2 className="font-heading text-sm font-semibold uppercase tracking-[0.25em] text-gold">
                  From the journal
                </h2>
                <p className="mt-2 font-heading text-2xl font-semibold text-ink sm:text-3xl">
                  Tips, trends &amp; rituals
                </p>
              </div>
              <Link
                href="/blogs"
                className="inline-flex items-center gap-1 text-sm font-medium text-mocha-dark hover:text-gold"
              >
                All posts <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
            <div className="grid gap-10 md:grid-cols-2">
              {posts.map((post) => (
                <BlogCard key={post.id} post={post} />
              ))}
            </div>
          </Container>
        </section>
      )}
    </>
  );
}

function Selector({ icon, label }: { icon: React.ReactNode; label: string }) {
  return (
    <div className="inline-flex items-center gap-2 rounded-full bg-white/90 px-4 py-2 text-sm font-medium text-ink shadow-sm">
      {icon}
      {label}
      <ArrowRight className="h-3 w-3 rotate-90 text-mocha" />
    </div>
  );
}

function Feature({
  icon,
  title,
  body,
}: {
  icon: React.ReactNode;
  title: string;
  body: string;
}) {
  return (
    <div className="flex flex-col items-center text-center">
      <span className="flex h-12 w-12 items-center justify-center rounded-full bg-mocha/10 text-mocha">
        {icon}
      </span>
      <h3 className="mt-4 font-heading text-lg font-semibold text-ink">{title}</h3>
      <p className="mt-1 max-w-xs text-sm text-mocha-dark">{body}</p>
    </div>
  );
}
