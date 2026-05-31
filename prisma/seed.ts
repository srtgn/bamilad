import "dotenv/config";

import { PrismaPg } from "@prisma/adapter-pg";
import bcrypt from "bcryptjs";

import { PrismaClient } from "../generated/prisma/client";

const prisma = new PrismaClient({
  adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL! }),
});

const slugify = (s: string) =>
  s
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

const img = (text: string, w = 800, h = 800) =>
  `https://placehold.co/${w}x${h}/ede6dd/8b7355?text=${encodeURIComponent(text)}`;

const categoryTree: { name: string; slug: string; children: string[] }[] = [
  { name: "Face Care", slug: "face-care", children: ["Face Wash", "Toners", "Serum", "Moisturizers", "Face Masks"] },
  { name: "Make Up", slug: "make-up", children: ["Foundation", "Blush", "Highlighter", "Lipstick"] },
  { name: "Hair Care", slug: "hair-care", children: ["Shampoo", "Conditioner", "Hair Oils"] },
  { name: "Body Care", slug: "body-care", children: ["Body Wash", "Body Lotion", "Body Scrubs"] },
  { name: "Eye Makeup", slug: "eye-makeup", children: ["Liquid Eye Liner", "Pencil Liner"] },
  {
    name: "Tools & Accessories",
    slug: "tools-accessories",
    children: ["Makeup Brushes", "Facial Rollers", "Sponges & Applicators"],
  },
];

type SeedProduct = {
  name: string;
  categorySlug: string;
  priceCents: number;
  compareAtPriceCents?: number;
  description: string;
  stock: number;
  featured?: boolean;
  trending?: boolean;
};

const products: SeedProduct[] = [
  { name: "Radiance Vitamin C Serum", categorySlug: "serum", priceCents: 3200, compareAtPriceCents: 3800, stock: 120, featured: true, trending: true, description: "A brightening daily serum with stabilized vitamin C and hyaluronic acid to even tone and boost your natural glow." },
  { name: "AquaBalance Hydrating Toner", categorySlug: "toners", priceCents: 2200, stock: 140, trending: true, description: "An alcohol-free toner that rebalances and preps skin with soothing botanicals and gentle exfoliating actives." },
  { name: "DewGlow Daily Moisturizer", categorySlug: "moisturizers", priceCents: 2800, compareAtPriceCents: 3200, stock: 160, trending: true, featured: true, description: "A lightweight gel-cream that locks in moisture for a dewy, healthy-looking finish all day long." },
  { name: "Daily Shield Sunscreen SPF 50", categorySlug: "moisturizers", priceCents: 2600, stock: 200, description: "Broad-spectrum SPF 50 with a weightless, non-greasy feel that stays invisible on every skin tone." },
  { name: "Velvet Matte Lipstick — Rosewood", categorySlug: "lipstick", priceCents: 1900, stock: 90, trending: true, description: "Creamy, long-wear matte lipstick in a universally flattering rosewood nude." },
  { name: "Gentle Foam Face Wash", categorySlug: "face-wash", priceCents: 1800, stock: 180, description: "A pH-balanced foaming cleanser that lifts away makeup and impurities without stripping the skin." },
  { name: "Hydrating Clay Face Mask", categorySlug: "face-masks", priceCents: 2400, stock: 75, description: "A creamy clay mask that purifies pores while keeping skin soft, calm, and hydrated." },
  { name: "Luminous Liquid Foundation", categorySlug: "foundation", priceCents: 3400, compareAtPriceCents: 3900, stock: 110, featured: true, description: "Buildable medium coverage with a natural radiant finish and skin-loving ingredients." },
  { name: "Soft Bloom Blush", categorySlug: "blush", priceCents: 2100, stock: 95, description: "A silky powder blush that blends seamlessly for a fresh, just-pinched flush." },
  { name: "24K Glow Highlighter", categorySlug: "highlighter", priceCents: 2300, stock: 85, featured: true, description: "A finely milled highlighter that catches the light for a lit-from-within glow." },
  { name: "Nourish Repair Shampoo", categorySlug: "shampoo", priceCents: 2000, stock: 150, description: "A sulfate-free shampoo that gently cleanses while strengthening and softening every strand." },
  { name: "Silk Smooth Conditioner", categorySlug: "conditioner", priceCents: 2000, stock: 150, description: "A rich, detangling conditioner that restores shine and all-day manageability." },
  { name: "Argan Repair Hair Oil", categorySlug: "hair-oils", priceCents: 2500, stock: 130, trending: true, description: "A lightweight argan oil blend that tames frizz and adds brilliant shine without weighing hair down." },
  { name: "Precision Liquid Eyeliner", categorySlug: "liquid-eye-liner", priceCents: 1700, stock: 160, description: "An ultra-fine felt tip with intense, smudge-proof black for effortless precision lines." },
  { name: "Rose Quartz Facial Roller", categorySlug: "facial-rollers", priceCents: 2900, stock: 70, featured: true, description: "A genuine rose quartz roller to depuff, sculpt, and boost your skincare absorption." },
  { name: "Pro Blend Makeup Brush Set", categorySlug: "makeup-brushes", priceCents: 4200, compareAtPriceCents: 4800, stock: 60, trending: true, description: "A 10-piece set of soft, vegan brushes for flawless face and eye application." },
];

const blogPosts: {
  title: string;
  excerpt: string;
  content: string;
  publishedAt: Date;
}[] = [
  {
    title: "How To Achieve a Flawless Natural Makeup Look",
    excerpt:
      "Master the art of natural makeup with our step-by-step guide — from skincare prep and a lightweight base to subtle eyes, groomed brows, and a fresh lip finish.",
    publishedAt: new Date("2026-02-17"),
    content: `<p>The secret to a flawless natural look starts long before you reach for foundation. It begins with healthy, well-prepped skin.</p>
<h2>Start with skincare</h2>
<p>Cleanse, tone, and moisturize, then let your products absorb for a few minutes. A hydrated base means makeup glides on evenly and lasts longer.</p>
<h2>Build a lightweight base</h2>
<p>Choose a sheer-to-medium foundation or tinted moisturizer and apply only where you need it. Spot-conceal, then set lightly so skin still looks like skin.</p>
<h2>Define, don't overpower</h2>
<p>Groom the brows, add a wash of neutral shadow, and finish with a tinted balm. The goal is you — only more radiant.</p>`,
  },
  {
    title: "Best Makeup Trends To Try This Season",
    excerpt:
      "From glazed skin and graphic liner to blurred lips and bold brows — explore the best makeup trends this season and find the looks that speak to your style.",
    publishedAt: new Date("2026-02-17"),
    content: `<p>This season is all about luminous, lived-in beauty. Here are the trends worth trying.</p>
<h2>Glazed, glowing skin</h2>
<p>Dewy is here to stay. Layer a hydrating serum under a radiant moisturizer and tap a cream highlighter on the high points.</p>
<h2>Soft graphic liner</h2>
<p>A precise flick in espresso brown feels modern and flattering on everyone. Keep the rest of the eye clean.</p>
<h2>Blurred lips</h2>
<p>Press a creamy lipstick into the lips and blot for that effortless, just-bitten finish.</p>`,
  },
  {
    title: "The Science Behind Clean Skincare Ingredients",
    excerpt:
      "Clean doesn't mean less effective. We break down the hero ingredients in our formulas and the research that makes them work for your skin.",
    publishedAt: new Date("2026-01-28"),
    content: `<p>"Clean" beauty should mean transparency and efficacy — not marketing. Here's how we evaluate every ingredient.</p>
<h2>Evidence first</h2>
<p>From niacinamide to peptides, we choose actives with peer-reviewed research behind them, at concentrations that actually do something.</p>
<h2>Gentle by design</h2>
<p>We formulate for the skin barrier, avoiding harsh sulfates and unnecessary fragrance so daily use stays comfortable.</p>`,
  },
  {
    title: "Building a Mindful Daily Beauty Routine",
    excerpt:
      "A great routine is one you'll actually keep. Learn how to build simple morning and evening rituals that support long-term skin health.",
    publishedAt: new Date("2026-01-12"),
    content: `<p>Consistency beats complexity. A short routine you follow daily will always outperform a ten-step routine you abandon.</p>
<h2>Morning</h2>
<p>Cleanse, treat with antioxidants, moisturize, and never skip SPF.</p>
<h2>Evening</h2>
<p>Remove the day, apply your targeted treatments, and seal everything in with a nourishing moisturizer.</p>`,
  },
];

async function main() {
  console.log("🌱 Seeding categories…");
  for (const [pIdx, parent] of categoryTree.entries()) {
    const p = await prisma.category.upsert({
      where: { slug: parent.slug },
      update: { name: parent.name, sortOrder: pIdx, image: img(parent.name, 1000, 700) },
      create: { name: parent.name, slug: parent.slug, sortOrder: pIdx, image: img(parent.name, 1000, 700) },
    });
    for (const [cIdx, childName] of parent.children.entries()) {
      const cslug = slugify(childName);
      await prisma.category.upsert({
        where: { slug: cslug },
        update: { name: childName, parentId: p.id, sortOrder: cIdx },
        create: { name: childName, slug: cslug, parentId: p.id, sortOrder: cIdx, image: img(childName, 1000, 700) },
      });
    }
  }

  const cats = await prisma.category.findMany();
  const idBySlug = new Map(cats.map((c) => [c.slug, c.id]));

  console.log("🌱 Seeding products…");
  for (const prod of products) {
    const slug = slugify(prod.name);
    const categoryId = idBySlug.get(prod.categorySlug) ?? null;
    await prisma.product.upsert({
      where: { slug },
      update: {
        name: prod.name,
        description: prod.description,
        priceCents: prod.priceCents,
        compareAtPriceCents: prod.compareAtPriceCents ?? null,
        stock: prod.stock,
        featured: prod.featured ?? false,
        trending: prod.trending ?? false,
        categoryId,
      },
      create: {
        name: prod.name,
        slug,
        description: prod.description,
        priceCents: prod.priceCents,
        compareAtPriceCents: prod.compareAtPriceCents ?? null,
        sku: slug.toUpperCase().replace(/-/g, "").slice(0, 12),
        stock: prod.stock,
        images: [img(prod.name)],
        featured: prod.featured ?? false,
        trending: prod.trending ?? false,
        categoryId,
      },
    });
  }

  console.log("🌱 Seeding blog posts…");
  for (const post of blogPosts) {
    const slug = slugify(post.title);
    await prisma.blogPost.upsert({
      where: { slug },
      update: { title: post.title, excerpt: post.excerpt, content: post.content },
      create: {
        title: post.title,
        slug,
        excerpt: post.excerpt,
        content: post.content,
        coverImage: img(post.title, 1200, 800),
        publishedAt: post.publishedAt,
        author: "Sereniq",
      },
    });
  }

  console.log("🌱 Seeding users…");
  const adminEmail = process.env.ADMIN_EMAIL ?? "admin@sereniq.test";
  const adminPassword = process.env.ADMIN_PASSWORD ?? "ChangeMe123!";
  await prisma.user.upsert({
    where: { email: adminEmail },
    update: { role: "ADMIN", emailVerified: new Date() },
    create: {
      email: adminEmail,
      name: "Store Admin",
      role: "ADMIN",
      emailVerified: new Date(),
      passwordHash: await bcrypt.hash(adminPassword, 10),
    },
  });

  await prisma.user.upsert({
    where: { email: "customer@sereniq.test" },
    update: {},
    create: {
      email: "customer@sereniq.test",
      name: "Demo Customer",
      role: "CUSTOMER",
      emailVerified: new Date(),
      passwordHash: await bcrypt.hash("Password123!", 10),
    },
  });

  console.log("✅ Seed complete.");
  console.log(`   Admin login:    ${adminEmail} / ${adminPassword}`);
  console.log("   Customer login: customer@sereniq.test / Password123!");
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
