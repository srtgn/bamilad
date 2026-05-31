"use client";

import { useActionState } from "react";

import { saveBlogPost, type AdminFormState } from "@/app/actions/admin";

import { Checkbox, Field, FormError, SubmitButton, Textarea } from "./form-fields";

type BlogInput = {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  coverImage: string | null;
  published: boolean;
} | null;

export function BlogForm({ post }: { post: BlogInput }) {
  const boundAction = saveBlogPost.bind(null, post?.id ?? null);
  const [state, action] = useActionState<AdminFormState, FormData>(
    boundAction,
    undefined,
  );

  return (
    <form action={action} className="max-w-2xl space-y-5">
      <FormError message={state?.error} />
      <Field label="Title" name="title" defaultValue={post?.title} required />
      <Textarea
        label="Excerpt"
        name="excerpt"
        defaultValue={post?.excerpt}
        required
      />
      <Textarea
        label="Content (HTML allowed)"
        name="content"
        defaultValue={post?.content}
        rows={12}
        required
      />
      <Field
        label="Cover image URL (optional)"
        name="coverImage"
        defaultValue={post?.coverImage ?? ""}
      />
      <Checkbox
        label="Published"
        name="published"
        defaultChecked={post ? post.published : true}
      />
      <SubmitButton>{post ? "Save changes" : "Create post"}</SubmitButton>
    </form>
  );
}
