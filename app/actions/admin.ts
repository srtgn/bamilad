"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { requireAdmin } from "@/lib/auth-helpers";
import { prisma } from "@/lib/prisma";
import { slugify } from "@/lib/utils";
import { blogPostSchema, categorySchema, productSchema } from "@/lib/validations";

export type AdminFormState = { error?: string } | undefined;

const ORDER_STATUSES = ["PENDING", "PAID", "FULFILLED", "CANCELLED", "REFUNDED"] as const;
type OrderStatus = (typeof ORDER_STATUSES)[number];

function parseImages(input: FormDataEntryValue | null): string[] {
  return String(input ?? "")
    .split(/\n+/)
    .map((s) => s.trim())
    .filter(Boolean);
}

function optionalNumber(value: FormDataEntryValue | null) {
  const s = String(value ?? "").trim();
  return s === "" ? undefined : s;
}

// ─── Products ────────────────────────────────────────────────────────────
export async function saveProduct(
  id: string | null,
  _prev: AdminFormState,
  formData: FormData,
): Promise<AdminFormState> {
  await requireAdmin();

  const parsed = productSchema.safeParse({
    name: formData.get("name"),
    description: formData.get("description"),
    price: formData.get("price"),
    compareAtPrice: optionalNumber(formData.get("compareAtPrice")),
    sku: formData.get("sku") || undefined,
    stock: formData.get("stock"),
    categoryId: formData.get("categoryId") || undefined,
    status: formData.get("status"),
    featured: formData.get("featured"),
    trending: formData.get("trending"),
  });
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Invalid input" };
  }

  const d = parsed.data;
  const customSlug = String(formData.get("slug") ?? "").trim();
  const data = {
    name: d.name,
    slug: customSlug || slugify(d.name),
    description: d.description,
    priceCents: Math.round(d.price * 100),
    compareAtPriceCents:
      d.compareAtPrice != null ? Math.round(d.compareAtPrice * 100) : null,
    sku: d.sku || null,
    stock: d.stock,
    categoryId: d.categoryId || null,
    status: d.status,
    featured: !!d.featured,
    trending: !!d.trending,
    images: parseImages(formData.get("images")),
  };

  try {
    if (id) {
      await prisma.product.update({ where: { id }, data });
    } else {
      await prisma.product.create({ data });
    }
  } catch {
    return { error: "Could not save — the slug or SKU may already be in use." };
  }

  revalidatePath("/admin/products");
  revalidatePath("/shop");
  redirect("/admin/products");
}

export async function deleteProduct(formData: FormData) {
  await requireAdmin();
  await prisma.product
    .delete({ where: { id: String(formData.get("id")) } })
    .catch(() => {});
  revalidatePath("/admin/products");
}

// ─── Categories ──────────────────────────────────────────────────────────
export async function saveCategory(
  id: string | null,
  _prev: AdminFormState,
  formData: FormData,
): Promise<AdminFormState> {
  await requireAdmin();

  const parsed = categorySchema.safeParse({
    name: formData.get("name"),
    parentId: formData.get("parentId") || undefined,
  });
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Invalid input" };
  }

  const data = {
    name: parsed.data.name,
    slug: slugify(parsed.data.name),
    parentId: parsed.data.parentId || null,
  };

  try {
    if (id) {
      await prisma.category.update({ where: { id }, data });
    } else {
      await prisma.category.create({ data });
    }
  } catch {
    return { error: "Could not save — that name/slug may already exist." };
  }

  revalidatePath("/admin/categories");
  redirect("/admin/categories");
}

export async function deleteCategory(formData: FormData) {
  await requireAdmin();
  await prisma.category
    .delete({ where: { id: String(formData.get("id")) } })
    .catch(() => {});
  revalidatePath("/admin/categories");
}

// ─── Orders ──────────────────────────────────────────────────────────────
export async function updateOrderStatus(formData: FormData) {
  await requireAdmin();
  const id = String(formData.get("id"));
  const status = String(formData.get("status"));
  if (!ORDER_STATUSES.includes(status as OrderStatus)) return;
  await prisma.order.update({ where: { id }, data: { status: status as OrderStatus } });
  revalidatePath("/admin/orders");
  revalidatePath(`/admin/orders/${id}`);
}

// ─── Users ───────────────────────────────────────────────────────────────
export async function updateUserRole(formData: FormData) {
  const session = await requireAdmin();
  const id = String(formData.get("id"));
  const role = String(formData.get("role"));
  if (role !== "ADMIN" && role !== "CUSTOMER") return;
  // Prevent locking yourself out of admin.
  if (id === session.user.id && role !== "ADMIN") return;
  await prisma.user.update({ where: { id }, data: { role } });
  revalidatePath("/admin/users");
}

// ─── Blog ────────────────────────────────────────────────────────────────
export async function saveBlogPost(
  id: string | null,
  _prev: AdminFormState,
  formData: FormData,
): Promise<AdminFormState> {
  await requireAdmin();

  const parsed = blogPostSchema.safeParse({
    title: formData.get("title"),
    excerpt: formData.get("excerpt"),
    content: formData.get("content"),
    coverImage: formData.get("coverImage") || undefined,
    published: formData.get("published"),
  });
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Invalid input" };
  }

  const d = parsed.data;
  const data = {
    title: d.title,
    slug: slugify(d.title),
    excerpt: d.excerpt,
    content: d.content,
    coverImage: d.coverImage || null,
    published: !!d.published,
  };

  try {
    if (id) {
      await prisma.blogPost.update({ where: { id }, data });
    } else {
      await prisma.blogPost.create({ data });
    }
  } catch {
    return { error: "Could not save — that title/slug may already exist." };
  }

  revalidatePath("/admin/blog");
  revalidatePath("/blogs");
  redirect("/admin/blog");
}

export async function deleteBlogPost(formData: FormData) {
  await requireAdmin();
  await prisma.blogPost
    .delete({ where: { id: String(formData.get("id")) } })
    .catch(() => {});
  revalidatePath("/admin/blog");
}
