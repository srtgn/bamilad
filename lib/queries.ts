import { prisma } from "@/lib/prisma";

/** Top-level categories with their children — powers the Shop mega-menu and footer. */
export async function getCategoryTree() {
  return prisma.category.findMany({
    where: { parentId: null },
    orderBy: { sortOrder: "asc" },
    include: { children: { orderBy: { sortOrder: "asc" } } },
  });
}

/** A flat set of child categories with imagery — used for the home category carousel. */
export async function getCarouselCategories(limit = 12) {
  return prisma.category.findMany({
    where: { parentId: { not: null } },
    orderBy: { sortOrder: "asc" },
    take: limit,
  });
}

export async function getTrendingProducts(limit = 8) {
  return prisma.product.findMany({
    where: { status: "ACTIVE", trending: true },
    orderBy: { createdAt: "desc" },
    take: limit,
  });
}

export async function getFeaturedProducts(limit = 8) {
  return prisma.product.findMany({
    where: { status: "ACTIVE", featured: true },
    take: limit,
  });
}

export async function getRecentBlogPosts(limit = 4) {
  return prisma.blogPost.findMany({
    where: { published: true },
    orderBy: { publishedAt: "desc" },
    take: limit,
  });
}

export async function getAllBlogPosts() {
  return prisma.blogPost.findMany({
    where: { published: true },
    orderBy: { publishedAt: "desc" },
  });
}

export async function getBlogPost(slug: string) {
  return prisma.blogPost.findUnique({ where: { slug } });
}
