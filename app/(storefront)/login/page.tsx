import type { Metadata } from "next";
import Link from "next/link";

import { AuthShell } from "@/components/auth/auth-shell";
import { LoginForm } from "@/components/auth/forms";

export const metadata: Metadata = { title: "Sign in" };

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ verified?: string; reset?: string; error?: string }>;
}) {
  const sp = await searchParams;

  return (
    <AuthShell
      title="Welcome back"
      subtitle="Sign in to your account"
      footer={
        <>
          Don&apos;t have an account?{" "}
          <Link href="/register" className="font-medium text-gold hover:underline">
            Create one
          </Link>
        </>
      }
    >
      {sp.verified ? (
        <p className="mb-4 rounded-xl bg-green-50 px-4 py-2.5 text-sm text-green-700">
          Email verified — you can now sign in.
        </p>
      ) : null}
      {sp.reset ? (
        <p className="mb-4 rounded-xl bg-green-50 px-4 py-2.5 text-sm text-green-700">
          Password updated. Sign in with your new password.
        </p>
      ) : null}
      {sp.error === "verify" ? (
        <p className="mb-4 rounded-xl bg-red-50 px-4 py-2.5 text-sm text-red-700">
          That verification link is invalid or has expired.
        </p>
      ) : null}
      <LoginForm />
    </AuthShell>
  );
}
