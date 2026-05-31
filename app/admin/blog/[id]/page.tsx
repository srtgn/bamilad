import { notFound } from "next/navigation";

import { BlogForm } from "@/components/admin/blog-form";
import { prisma } from "@/lib/prisma";

export default async function EditBlogPostPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const post = await prisma.blogPost.findUnique({ where: { id } });
  if (!post) notFound();

  return (
    <div>
      <h1 className="font-heading text-2xl font-semibold text-ink">Edit post</h1>
      <div className="mt-6">
        <BlogForm post={post} />
      </div>
    </div>
  );
}
