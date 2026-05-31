import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";

import { MediaPlaceholder } from "@/components/storefront/media";
import { Container } from "@/components/ui/container";
import { getBlogPost } from "@/lib/queries";
import { formatBlogDate } from "@/lib/utils";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = await getBlogPost(slug);
  if (!post) return { title: "Post not found" };
  return { title: post.title, description: post.excerpt };
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = await getBlogPost(slug);
  if (!post || !post.published) notFound();

  return (
    <article className="py-12 sm:py-16">
      <Container className="max-w-3xl">
        <Link
          href="/blogs"
          className="inline-flex items-center gap-1.5 text-sm font-medium text-mocha hover:text-gold"
        >
          <ArrowLeft className="h-4 w-4" /> All posts
        </Link>

        <div className="mt-6 flex items-center gap-3 text-xs uppercase tracking-wider text-mocha">
          <span>{post.author}</span>
          <span>•</span>
          <span>{formatBlogDate(post.publishedAt)}</span>
        </div>
        <h1 className="mt-3 font-heading text-3xl font-semibold leading-tight text-ink sm:text-4xl">
          {post.title}
        </h1>

        <div className="relative mt-8 aspect-[16/9] overflow-hidden rounded-3xl bg-cream">
          {post.coverImage ? (
            <Image
              src={post.coverImage}
              alt={post.title}
              fill
              sizes="(max-width:768px) 100vw, 768px"
              className="object-cover"
              priority
            />
          ) : (
            <MediaPlaceholder label={post.title} />
          )}
        </div>

        <div
          className="mt-10 space-y-4 text-[15px] leading-relaxed text-mocha-dark [&_h2]:mt-8 [&_h2]:font-heading [&_h2]:text-xl [&_h2]:font-semibold [&_h2]:text-ink"
          dangerouslySetInnerHTML={{ __html: post.content }}
        />
      </Container>
    </article>
  );
}
