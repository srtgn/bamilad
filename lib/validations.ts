import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

export const registerSchema = z.object({
  name: z.string().min(1, "Name is required").max(100),
  email: z.string().email("Enter a valid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

export const emailSchema = z.object({
  email: z.string().email("Enter a valid email address"),
});

export const resetPasswordSchema = z.object({
  token: z.string().min(1),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

export const addressSchema = z.object({
  fullName: z.string().min(1, "Name is required"),
  line1: z.string().min(1, "Address is required"),
  line2: z.string().optional(),
  city: z.string().min(1, "City is required"),
  state: z.string().optional(),
  postalCode: z.string().min(1, "Postal code is required"),
  country: z.string().min(2, "Country is required"),
  phone: z.string().optional(),
});

export const productSchema = z.object({
  name: z.string().min(1, "Name is required"),
  description: z.string().min(1, "Description is required"),
  price: z.coerce.number().min(0, "Price must be positive"),
  compareAtPrice: z.coerce.number().min(0).optional(),
  sku: z.string().optional(),
  stock: z.coerce.number().int().min(0),
  categoryId: z.string().optional(),
  status: z.enum(["DRAFT", "ACTIVE"]),
  featured: z.coerce.boolean().optional(),
  trending: z.coerce.boolean().optional(),
});

export const categorySchema = z.object({
  name: z.string().min(1, "Name is required"),
  parentId: z.string().optional(),
});

export const blogPostSchema = z.object({
  title: z.string().min(1, "Title is required"),
  excerpt: z.string().min(1, "Excerpt is required"),
  content: z.string().min(1, "Content is required"),
  coverImage: z.string().optional(),
  published: z.coerce.boolean().optional(),
});
