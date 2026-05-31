import Image from "next/image";
import Link from "next/link";

import { MediaPlaceholder } from "@/components/storefront/media";
import { formatBlogDate } from "@/lib/utils";

export type BlogCardData = {
  slug: string;
  title: string;
  excerpt: string;
  coverImage: string | null;
  author: string;
  publishedAt: Date | string;
};

export function BlogCard({ post }: { post: BlogCardData }) {
  return (
    <article className="group">
      <Link href={`/blogs/${post.slug}`} className="block">
        <div className="relative aspect-[16/10] overflow-hidden rounded-2xl bg-cream">
          {post.coverImage ? (
            <Image
              src={post.coverImage}
              alt={post.title}
              fill
              sizes="(max-width:768px) 100vw, 50vw"
              className="object-cover transition duration-500 group-hover:scale-105"
            />
          ) : (
            <MediaPlaceholder
              label={post.title}
              className="transition duration-500 group-hover:scale-105"
            />
          )}
        </div>
        <h3 className="mt-4 font-heading text-lg font-semibold text-gold transition group-hover:text-mocha-dark">
          {post.title}
        </h3>
      </Link>
      <p className="mt-2 text-sm leading-relaxed text-mocha-dark">{post.excerpt}</p>
      <div className="mt-4 flex items-center justify-between text-xs text-mocha">
        <span>{post.author}</span>
        <span>{formatBlogDate(post.publishedAt)}</span>
      </div>
    </article>
  );
}
