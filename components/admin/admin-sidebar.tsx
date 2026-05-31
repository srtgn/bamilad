"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  FileText,
  FolderTree,
  LayoutDashboard,
  LogOut,
  Package,
  ShoppingBag,
  Store,
  Users,
} from "lucide-react";

import { logoutAction } from "@/app/actions/auth";
import { siteConfig } from "@/lib/site-config";
import { cn } from "@/lib/utils";

const nav = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard, exact: true },
  { href: "/admin/products", label: "Products", icon: Package, exact: false },
  { href: "/admin/categories", label: "Categories", icon: FolderTree, exact: false },
  { href: "/admin/orders", label: "Orders", icon: ShoppingBag, exact: false },
  { href: "/admin/users", label: "Users", icon: Users, exact: false },
  { href: "/admin/blog", label: "Blog", icon: FileText, exact: false },
];

export function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside className="flex w-60 shrink-0 flex-col bg-mocha-dark text-cream">
      <div className="px-6 py-5">
        <Link
          href="/admin"
          className="font-heading text-xl font-semibold tracking-[0.2em] text-white"
        >
          {siteConfig.name}
        </Link>
        <p className="text-xs text-cream/60">Admin</p>
      </div>

      <nav className="flex-1 space-y-1 px-3">
        {nav.map((item) => {
          const active = item.exact
            ? pathname === item.href
            : pathname.startsWith(item.href);
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm transition",
                active
                  ? "bg-white/15 font-medium text-white"
                  : "text-cream/80 hover:bg-white/10 hover:text-white",
              )}
            >
              <Icon className="h-4 w-4" />
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="space-y-1 border-t border-white/10 p-3">
        <Link
          href="/"
          className="flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm text-cream/80 transition hover:bg-white/10 hover:text-white"
        >
          <Store className="h-4 w-4" />
          View store
        </Link>
        <form action={logoutAction}>
          <button
            type="submit"
            className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-sm text-cream/80 transition hover:bg-white/10 hover:text-white"
          >
            <LogOut className="h-4 w-4" />
            Sign out
          </button>
        </form>
      </div>
    </aside>
  );
}
