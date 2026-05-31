import { redirect } from "next/navigation";

import { auth } from "@/auth";
import { AdminSidebar } from "@/components/admin/admin-sidebar";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();
  if (!session?.user) redirect("/login");
  if (session.user.role !== "ADMIN") redirect("/");

  return (
    <div className="flex min-h-screen bg-cream-soft">
      <AdminSidebar />
      <main className="min-w-0 flex-1 p-6 sm:p-8">{children}</main>
    </div>
  );
}
