import type { MetadataRoute } from "next";

import { prisma } from "@/lib/prisma";
import { siteConfig } from "@/lib/site-config";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = siteConfig.url;

  const [products, categories, posts] = await Promise.all([
    prisma.product.findMany({
      where: { status: "ACTIVE" },
      select: { slug: true, updatedAt: true },
    }),
    prisma.category.findMany({ select: { slug: true } }),
    prisma.blogPost.findMany({
      where: { published: true },
      select: { slug: true, updatedAt: true },
    }),
  ]);

  const staticPaths = ["", "/shop", "/about", "/blogs", "/contact"];

  return [
    ...staticPaths.map((p) => ({ url: `${base}${p}`, changeFrequency: "weekly" as const })),
    ...categories.map((c) => ({ url: `${base}/shop/${c.slug}` })),
    ...products.map((p) => ({
      url: `${base}/products/${p.slug}`,
      lastModified: p.updatedAt,
    })),
    ...posts.map((p) => ({
      url: `${base}/blogs/${p.slug}`,
      lastModified: p.updatedAt,
    })),
  ];
}
