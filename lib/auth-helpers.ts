import { auth } from "@/auth";

/**
 * Server-side guard for admin mutations. Every admin server action calls this so
 * protection doesn't rely on the layout/UI alone (defense in depth).
 */
export async function requireAdmin() {
  const session = await auth();
  if (!session?.user || session.user.role !== "ADMIN") {
    throw new Error("Unauthorized");
  }
  return session;
}
