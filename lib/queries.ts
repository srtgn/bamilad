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

export async function getProductBySlug(slug: string) {
  return prisma.product.findFirst({
    where: { slug, status: "ACTIVE" },
    include: { category: true },
  });
}

export async function getAllActiveProducts() {
  return prisma.product.findMany({
    where: { status: "ACTIVE" },
    orderBy: [{ trending: "desc" }, { createdAt: "desc" }],
  });
}

export async function getCategoryBySlug(slug: string) {
  return prisma.category.findUnique({
    where: { slug },
    include: { children: true, parent: true },
  });
}

/** Products in a category — includes products of child categories when given a parent. */
export async function getProductsForCategory(slug: string) {
  const category = await prisma.category.findUnique({
    where: { slug },
    include: {
      children: {
        select: { id: true, name: true, slug: true },
        orderBy: { sortOrder: "asc" },
      },
    },
  });
  if (!category) return { category: null, products: [] };
  const categoryIds = [category.id, ...category.children.map((c) => c.id)];
  const products = await prisma.product.findMany({
    where: { status: "ACTIVE", categoryId: { in: categoryIds } },
    orderBy: { createdAt: "desc" },
  });
  return { category, products };
}

export async function getRelatedProducts(
  categoryId: string | null,
  excludeId: string,
  take = 4,
) {
  if (!categoryId) return [];
  return prisma.product.findMany({
    where: { status: "ACTIVE", categoryId, id: { not: excludeId } },
    take,
  });
}
