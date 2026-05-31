"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";

import { addAddressAction, type AddressState } from "@/app/actions/account";
import { buttonStyles } from "@/components/ui/button";

function Field({
  label,
  className,
  ...props
}: { label: string } & React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <label className={className}>
      <span className="mb-1.5 block text-sm font-medium text-ink">{label}</span>
      <input
        {...props}
        className="w-full rounded-xl border border-mocha/25 bg-white px-4 py-2.5 text-sm outline-none transition focus:border-mocha"
      />
    </label>
  );
}

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button type="submit" disabled={pending} className={buttonStyles("primary")}>
      {pending ? "Saving…" : "Save address"}
    </button>
  );
}

export function AddressForm() {
  const [state, action] = useActionState<AddressState, FormData>(
    addAddressAction,
    undefined,
  );

  return (
    <form action={action} className="rounded-2xl bg-cream-soft p-6">
      <h3 className="font-heading text-lg font-semibold text-ink">Add an address</h3>
      {state?.error ? (
        <p className="mt-3 rounded-xl bg-red-50 px-4 py-2.5 text-sm text-red-700">
          {state.error}
        </p>
      ) : null}
      {state?.success ? (
        <p className="mt-3 rounded-xl bg-green-50 px-4 py-2.5 text-sm text-green-700">
          {state.success}
        </p>
      ) : null}

      <div className="mt-4 grid gap-4 sm:grid-cols-2">
        <Field label="Full name" name="fullName" required className="sm:col-span-2" />
        <Field label="Address line 1" name="line1" required className="sm:col-span-2" />
        <Field label="Address line 2" name="line2" className="sm:col-span-2" />
        <Field label="City" name="city" required />
        <Field label="State / Province" name="state" />
        <Field label="Postal code" name="postalCode" required />
        <Field label="Country" name="country" defaultValue="US" required />
        <Field label="Phone" name="phone" className="sm:col-span-2" />
      </div>

      <div className="mt-5">
        <SubmitButton />
      </div>
    </form>
  );
}
