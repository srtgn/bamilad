import { redirect } from "next/navigation";

import { auth } from "@/auth";
import { AccountNav } from "@/components/account/account-nav";
import { Container } from "@/components/ui/container";

export default async function AccountLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();
  if (!session?.user) redirect("/login");

  return (
    <Container className="py-12">
      <div className="grid gap-10 lg:grid-cols-[220px_1fr]">
        <AccountNav
          name={session.user.name ?? session.user.email ?? "there"}
          isAdmin={session.user.role === "ADMIN"}
        />
        <div className="min-w-0">{children}</div>
      </div>
    </Container>
  );
}
