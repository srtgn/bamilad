"use client";

import { useActionState } from "react";

import { saveCategory, type AdminFormState } from "@/app/actions/admin";

import { Field, FormError, Select, SubmitButton } from "./form-fields";

export function CategoryForm({ parents }: { parents: { id: string; name: string }[] }) {
  const boundAction = saveCategory.bind(null, null);
  const [state, action] = useActionState<AdminFormState, FormData>(
    boundAction,
    undefined,
  );

  return (
    <form action={action} className="space-y-4 rounded-2xl bg-white p-5 shadow-sm">
      <h2 className="font-heading text-lg font-semibold text-ink">Add category</h2>
      <FormError message={state?.error} />
      <Field label="Name" name="name" required />
      <Select label="Parent (optional)" name="parentId" defaultValue="">
        <option value="">— Top level —</option>
        {parents.map((p) => (
          <option key={p.id} value={p.id}>
            {p.name}
          </option>
        ))}
      </Select>
      <SubmitButton>Add category</SubmitButton>
    </form>
  );
}
