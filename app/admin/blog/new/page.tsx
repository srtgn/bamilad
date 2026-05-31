import { BlogForm } from "@/components/admin/blog-form";

export default function NewBlogPostPage() {
  return (
    <div>
      <h1 className="font-heading text-2xl font-semibold text-ink">New post</h1>
      <div className="mt-6">
        <BlogForm post={null} />
      </div>
    </div>
  );
}
