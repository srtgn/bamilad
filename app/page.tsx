import { prisma } from "@/lib/prisma";
import { siteConfig } from "@/lib/site-config";

export default async function Home() {
  const [products, categories, posts] = await Promise.all([
    prisma.product.count(),
    prisma.category.count(),
    prisma.blogPost.count(),
  ]);

  return (
    <main className="flex flex-1 flex-col items-center justify-center gap-6 bg-cream-soft px-6 py-24 text-center">
      <p className="text-sm font-medium uppercase tracking-[0.3em] text-gold">
        {siteConfig.tagline}
      </p>
      <h1 className="text-5xl font-semibold tracking-tight text-mocha-dark sm:text-6xl">
        {siteConfig.name}
      </h1>
      <p className="max-w-md text-mocha">{siteConfig.description}</p>
      <div className="mt-4 flex gap-10 rounded-2xl bg-white px-10 py-6 shadow-sm">
        <Stat label="Products" value={products} />
        <Stat label="Categories" value={categories} />
        <Stat label="Blog posts" value={posts} />
      </div>
      <p className="text-xs text-mocha-light">
        Phase 0 smoke test · database connected via Prisma 7 + pg adapter
      </p>
    </main>
  );
}

function Stat({ label, value }: { label: string; value: number }) {
  return (
    <div className="flex flex-col">
      <span className="font-heading text-3xl font-semibold text-ink">{value}</span>
      <span className="text-xs uppercase tracking-wider text-mocha">{label}</span>
    </div>
  );
}
