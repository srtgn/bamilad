"use client";

import Link from "next/link";
import { useActionState } from "react";
import { useFormStatus } from "react-dom";

import {
  loginAction,
  registerAction,
  requestPasswordResetAction,
  resetPasswordAction,
  type AuthState,
} from "@/app/actions/auth";
import { buttonStyles } from "@/components/ui/button";

function Field({
  label,
  ...props
}: { label: string } & React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-sm font-medium text-ink">{label}</span>
      <input
        {...props}
        className="w-full rounded-xl border border-mocha/25 bg-white px-4 py-2.5 text-sm outline-none transition focus:border-mocha"
      />
    </label>
  );
}

function SubmitButton({ children }: { children: React.ReactNode }) {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className={buttonStyles("primary", "w-full")}
    >
      {pending ? "Please wait…" : children}
    </button>
  );
}

function Alert({ state }: { state: AuthState }) {
  if (state?.error) {
    return (
      <p className="rounded-xl bg-red-50 px-4 py-2.5 text-sm text-red-700">
        {state.error}
      </p>
    );
  }
  if (state?.success) {
    return (
      <p className="rounded-xl bg-green-50 px-4 py-2.5 text-sm text-green-700">
        {state.success}
      </p>
    );
  }
  return null;
}

export function LoginForm() {
  const [state, action] = useActionState(loginAction, undefined);
  return (
    <form action={action} className="space-y-4">
      <Alert state={state} />
      <Field label="Email" name="email" type="email" required autoComplete="email" />
      <Field
        label="Password"
        name="password"
        type="password"
        required
        autoComplete="current-password"
      />
      <div className="text-right">
        <Link href="/forgot-password" className="text-sm text-mocha hover:text-gold">
          Forgot password?
        </Link>
      </div>
      <SubmitButton>Sign in</SubmitButton>
    </form>
  );
}

export function RegisterForm() {
  const [state, action] = useActionState(registerAction, undefined);
  return (
    <form action={action} className="space-y-4">
      <Alert state={state} />
      <Field label="Full name" name="name" type="text" required autoComplete="name" />
      <Field label="Email" name="email" type="email" required autoComplete="email" />
      <Field
        label="Password"
        name="password"
        type="password"
        required
        minLength={8}
        autoComplete="new-password"
      />
      <SubmitButton>Create account</SubmitButton>
    </form>
  );
}

export function ForgotPasswordForm() {
  const [state, action] = useActionState(requestPasswordResetAction, undefined);
  return (
    <form action={action} className="space-y-4">
      <Alert state={state} />
      <Field label="Email" name="email" type="email" required autoComplete="email" />
      <SubmitButton>Send reset link</SubmitButton>
    </form>
  );
}

export function ResetPasswordForm({ token }: { token: string }) {
  const [state, action] = useActionState(resetPasswordAction, undefined);
  return (
    <form action={action} className="space-y-4">
      <Alert state={state} />
      <input type="hidden" name="token" value={token} />
      <Field
        label="New password"
        name="password"
        type="password"
        required
        minLength={8}
        autoComplete="new-password"
      />
      <SubmitButton>Reset password</SubmitButton>
      {state?.success ? (
        <Link
          href="/login?reset=1"
          className={buttonStyles("light", "w-full border border-mocha/20")}
        >
          Go to sign in
        </Link>
      ) : null}
    </form>
  );
}
