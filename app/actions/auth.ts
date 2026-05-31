"use server";

import { randomBytes } from "node:crypto";

import bcrypt from "bcryptjs";
import { AuthError } from "next-auth";

import { signIn, signOut } from "@/auth";
import { sendPasswordResetEmail, sendVerificationEmail } from "@/lib/email";
import { prisma } from "@/lib/prisma";
import { siteConfig } from "@/lib/site-config";
import { emailSchema, registerSchema, resetPasswordSchema } from "@/lib/validations";

export type AuthState = { error?: string; success?: string } | undefined;

export async function loginAction(_prev: AuthState, formData: FormData): Promise<AuthState> {
  const email = String(formData.get("email") ?? "");
  const password = String(formData.get("password") ?? "");
  try {
    await signIn("credentials", { email, password, redirectTo: "/account" });
    return {};
  } catch (error) {
    if (error instanceof AuthError) {
      return {
        error: "Invalid email or password — or your email isn't verified yet.",
      };
    }
    throw error; // a redirect (success) — let Next handle it
  }
}

export async function registerAction(_prev: AuthState, formData: FormData): Promise<AuthState> {
  const parsed = registerSchema.safeParse({
    name: formData.get("name"),
    email: formData.get("email"),
    password: formData.get("password"),
  });
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Invalid input" };
  }

  const { name, email, password } = parsed.data;
  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    return { error: "An account with this email already exists." };
  }

  await prisma.user.create({
    data: { name, email, passwordHash: await bcrypt.hash(password, 10) },
  });

  const token = randomBytes(32).toString("hex");
  await prisma.verificationToken.create({
    data: { identifier: email, token, expires: new Date(Date.now() + 1000 * 60 * 60 * 24) },
  });
  await sendVerificationEmail(email, `${siteConfig.url}/api/verify?token=${token}`);

  return {
    success: "Account created! Check your email for a verification link before signing in.",
  };
}

export async function requestPasswordResetAction(
  _prev: AuthState,
  formData: FormData,
): Promise<AuthState> {
  const parsed = emailSchema.safeParse({ email: formData.get("email") });
  if (!parsed.success) return { error: "Enter a valid email address." };

  const user = await prisma.user.findUnique({ where: { email: parsed.data.email } });
  if (user) {
    const token = randomBytes(32).toString("hex");
    await prisma.passwordResetToken.create({
      data: { userId: user.id, token, expires: new Date(Date.now() + 1000 * 60 * 60) },
    });
    await sendPasswordResetEmail(
      user.email,
      `${siteConfig.url}/reset-password?token=${token}`,
    );
  }

  // Always the same response — don't reveal which emails are registered.
  return { success: "If an account exists for that email, we've sent a reset link." };
}

export async function resetPasswordAction(
  _prev: AuthState,
  formData: FormData,
): Promise<AuthState> {
  const parsed = resetPasswordSchema.safeParse({
    token: formData.get("token"),
    password: formData.get("password"),
  });
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Invalid input" };
  }

  const { token, password } = parsed.data;
  const record = await prisma.passwordResetToken.findUnique({ where: { token } });
  if (!record || record.expires < new Date()) {
    return { error: "This reset link is invalid or has expired." };
  }

  await prisma.user.update({
    where: { id: record.userId },
    data: { passwordHash: await bcrypt.hash(password, 10) },
  });
  await prisma.passwordResetToken.delete({ where: { token } }).catch(() => {});

  return { success: "Your password has been reset. You can now sign in." };
}

export async function logoutAction() {
  await signOut({ redirectTo: "/" });
}
