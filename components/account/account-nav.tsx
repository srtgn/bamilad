"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, LogOut, MapPin, Package, Shield } from "lucide-react";

import { logoutAction } from "@/app/actions/auth";
import { cn } from "@/lib/utils";

const links = [
  { href: "/account", label: "Overview", icon: LayoutDashboard, exact: true },
  { href: "/account/orders", label: "Orders", icon: Package, exact: false },
  { href: "/account/addresses", label: "Addresses", icon: MapPin, exact: false },
];

export function AccountNav({ name, isAdmin }: { name: string; isAdmin: boolean }) {
  const pathname = usePathname();

  return (
    <aside>
      <p className="px-3 text-sm text-mocha">Hello,</p>
      <p className="truncate px-3 font-heading text-lg font-semibold text-ink">{name}</p>

      <nav className="mt-5 space-y-1">
        {links.map((link) => {
          const active = link.exact
            ? pathname === link.href
            : pathname.startsWith(link.href);
          const Icon = link.icon;
          return (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm transition",
                active
                  ? "bg-cream font-medium text-ink"
                  : "text-mocha-dark hover:bg-cream-soft",
              )}
            >
              <Icon className="h-4 w-4" />
              {link.label}
            </Link>
          );
        })}

        {isAdmin ? (
          <Link
            href="/admin"
            className="flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm text-mocha-dark transition hover:bg-cream-soft"
          >
            <Shield className="h-4 w-4" />
            Admin dashboard
          </Link>
        ) : null}

        <form action={logoutAction}>
          <button
            type="submit"
            className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-sm text-mocha-dark transition hover:bg-cream-soft"
          >
            <LogOut className="h-4 w-4" />
            Sign out
          </button>
        </form>
      </nav>
    </aside>
  );
}
