"use client";

import { useFormStatus } from "react-dom";

import { buttonStyles } from "@/components/ui/button";

const base =
  "w-full rounded-xl border border-mocha/25 bg-white px-4 py-2.5 text-sm outline-none transition focus:border-mocha";

export function Field({
  label,
  ...props
}: { label: string } & React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-sm font-medium text-ink">{label}</span>
      <input {...props} className={base} />
    </label>
  );
}

export function Textarea({
  label,
  ...props
}: { label: string } & React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-sm font-medium text-ink">{label}</span>
      <textarea {...props} className={`${base} min-h-28`} />
    </label>
  );
}

export function Select({
  label,
  children,
  ...props
}: { label: string } & React.SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-sm font-medium text-ink">{label}</span>
      <select {...props} className={base}>
        {children}
      </select>
    </label>
  );
}

export function Checkbox({
  label,
  ...props
}: { label: string } & React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <label className="flex items-center gap-2 text-sm font-medium text-ink">
      <input type="checkbox" {...props} className="h-4 w-4 rounded border-mocha/30" />
      {label}
    </label>
  );
}

export function FormError({ message }: { message?: string }) {
  if (!message) return null;
  return (
    <p className="rounded-xl bg-red-50 px-4 py-2.5 text-sm text-red-700">{message}</p>
  );
}

export function SubmitButton({ children }: { children: React.ReactNode }) {
  const { pending } = useFormStatus();
  return (
    <button type="submit" disabled={pending} className={buttonStyles("primary")}>
      {pending ? "Saving…" : children}
    </button>
  );
}
