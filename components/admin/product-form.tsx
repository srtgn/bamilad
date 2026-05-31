"use client";

import { useActionState } from "react";

import { saveProduct, type AdminFormState } from "@/app/actions/admin";

import {
  Checkbox,
  Field,
  FormError,
  Select,
  SubmitButton,
  Textarea,
} from "./form-fields";

type ProductInput = {
  id: string;
  name: string;
  slug: string;
  description: string;
  priceCents: number;
  compareAtPriceCents: number | null;
  sku: string | null;
  stock: number;
  categoryId: string | null;
  status: "DRAFT" | "ACTIVE";
  featured: boolean;
  trending: boolean;
  images: string[];
} | null;

export function ProductForm({
  product,
  categories,
}: {
  product: ProductInput;
  categories: { id: string; label: string }[];
}) {
  const boundAction = saveProduct.bind(null, product?.id ?? null);
  const [state, action] = useActionState<AdminFormState, FormData>(
    boundAction,
    undefined,
  );

  return (
    <form action={action} className="max-w-2xl space-y-5">
      <FormError message={state?.error} />
      <Field label="Name" name="name" defaultValue={product?.name} required />
      <Field
        label="Slug (optional — auto-generated from the name)"
        name="slug"
        defaultValue={product?.slug}
      />
      <Textarea
        label="Description"
        name="description"
        defaultValue={product?.description}
        required
      />

      <div className="grid gap-5 sm:grid-cols-2">
        <Field
          label="Price (USD)"
          name="price"
          type="number"
          step="0.01"
          min="0"
          defaultValue={product ? (product.priceCents / 100).toString() : ""}
          required
        />
        <Field
          label="Compare-at price (USD, optional)"
          name="compareAtPrice"
          type="number"
          step="0.01"
          min="0"
          defaultValue={
            product?.compareAtPriceCents
              ? (product.compareAtPriceCents / 100).toString()
              : ""
          }
        />
        <Field label="SKU" name="sku" defaultValue={product?.sku ?? ""} />
        <Field
          label="Stock"
          name="stock"
          type="number"
          min="0"
          defaultValue={product ? product.stock.toString() : "0"}
          required
        />
        <Select
          label="Category"
          name="categoryId"
          defaultValue={product?.categoryId ?? ""}
        >
          <option value="">— None —</option>
          {categories.map((c) => (
            <option key={c.id} value={c.id}>
              {c.label}
            </option>
          ))}
        </Select>
        <Select label="Status" name="status" defaultValue={product?.status ?? "ACTIVE"}>
          <option value="ACTIVE">Active</option>
          <option value="DRAFT">Draft</option>
        </Select>
      </div>

      <div className="flex gap-6">
        <Checkbox label="Featured" name="featured" defaultChecked={product?.featured} />
        <Checkbox label="Trending" name="trending" defaultChecked={product?.trending} />
      </div>

      <Textarea
        label="Image URLs (one per line)"
        name="images"
        defaultValue={product?.images.join("\n") ?? ""}
        placeholder="https://res.cloudinary.com/your-cloud/..."
      />

      <SubmitButton>{product ? "Save changes" : "Create product"}</SubmitButton>
    </form>
  );
}
