import Link from "next/link";
import { Plus } from "lucide-react";

import { deleteBlogPost } from "@/app/actions/admin";
import { buttonStyles } from "@/components/ui/button";
import { prisma } from "@/lib/prisma";
import { formatBlogDate } from "@/lib/utils";

export default async function AdminBlogPage() {
  const posts = await prisma.blogPost.findMany({ orderBy: { publishedAt: "desc" } });

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="font-heading text-2xl font-semibold text-ink">Blog</h1>
        <Link href="/admin/blog/new" className={buttonStyles("primary")}>
          <Plus className="h-4 w-4" /> New post
        </Link>
      </div>

      <div className="mt-6 overflow-x-auto rounded-2xl bg-white shadow-sm">
        <table className="w-full text-sm">
          <thead className="border-b border-mocha/10 text-left text-xs uppercase tracking-wider text-mocha">
            <tr>
              <th className="p-4">Title</th>
              <th className="p-4">Published</th>
              <th className="p-4">Date</th>
              <th className="p-4"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-mocha/10">
            {posts.map((post) => (
              <tr key={post.id}>
                <td className="p-4">
                  <Link
                    href={`/admin/blog/${post.id}`}
                    className="font-medium text-ink hover:text-gold"
                  >
                    {post.title}
                  </Link>
                </td>
                <td className="p-4">
                  {post.published ? (
                    <span className="rounded-full bg-green-100 px-2.5 py-1 text-xs font-medium text-green-800">
                      Live
                    </span>
                  ) : (
                    <span className="rounded-full bg-gray-200 px-2.5 py-1 text-xs font-medium text-gray-700">
                      Draft
                    </span>
                  )}
                </td>
                <td className="p-4 text-mocha-dark">{formatBlogDate(post.publishedAt)}</td>
                <td className="p-4 text-right">
                  <form action={deleteBlogPost}>
                    <input type="hidden" name="id" value={post.id} />
                    <button
                      type="submit"
                      className="text-xs font-medium text-mocha hover:text-red-600"
                    >
                      Delete
                    </button>
                  </form>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
