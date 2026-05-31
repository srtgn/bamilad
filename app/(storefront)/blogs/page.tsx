import type { Metadata } from "next";

import { BlogCard } from "@/components/storefront/blog-card";
import { PageHeader } from "@/components/storefront/page-header";
import { Container } from "@/components/ui/container";
import { getAllBlogPosts } from "@/lib/queries";

export const metadata: Metadata = {
  title: "News",
  description: "Tips, trends, and rituals from our beauty journal.",
};

export default async function BlogsPage() {
  const posts = await getAllBlogPosts();

  return (
    <>
      <PageHeader title="News" />
      <section className="py-14 sm:py-20">
        <Container>
          {posts.length === 0 ? (
            <p className="text-center text-mocha">No posts yet — check back soon.</p>
          ) : (
            <div className="grid gap-x-8 gap-y-12 md:grid-cols-2">
              {posts.map((post) => (
                <BlogCard key={post.id} post={post} />
              ))}
            </div>
          )}
        </Container>
      </section>
    </>
  );
}
