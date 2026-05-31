"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { ChevronDown, Menu, X } from "lucide-react";

import { siteConfig } from "@/lib/site-config";
import { cn } from "@/lib/utils";

import { MegaMenu, type MegaCategory } from "./mega-menu";

const navLinks = [
  { label: "Home", href: "/" },
  { label: "About", href: "/about" },
  { label: "Blogs", href: "/blogs" },
  { label: "Contact", href: "/contact" },
];

function pillClass(active: boolean) {
  return cn(
    "inline-flex items-center gap-1.5 rounded-full px-6 py-2.5 text-[15px] font-medium tracking-wide transition",
    active
      ? "border border-white/90 text-white"
      : "border border-transparent text-white/90 hover:bg-white/10 hover:text-white",
  );
}

export function SiteHeader({ categories }: { categories: MegaCategory[] }) {
  const pathname = usePathname();
  const [shopOpen, setShopOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  return (
    <header className="relative z-30 bg-mocha text-white">
      <div className="pt-5 text-center">
        <Link
          href="/"
          className="font-heading text-3xl font-semibold tracking-[0.35em] sm:text-4xl"
        >
          {siteConfig.name}
        </Link>
      </div>

      <nav className="mt-5 border-t border-white/20">
        {/* Desktop */}
        <div
          className="mx-auto hidden max-w-5xl items-center justify-center gap-2 px-6 py-4 lg:flex"
          onMouseLeave={() => setShopOpen(false)}
        >
          <Link href="/" className={pillClass(isActive("/"))}>
            Home
          </Link>
          <div onMouseEnter={() => setShopOpen(true)}>
            <Link href="/shop" className={pillClass(isActive("/shop"))}>
              Shop <ChevronDown className="h-4 w-4" />
            </Link>
          </div>
          <Link href="/about" className={pillClass(isActive("/about"))}>
            About
          </Link>
          <Link href="/blogs" className={pillClass(isActive("/blogs"))}>
            Blogs
          </Link>
          <Link href="/contact" className={pillClass(isActive("/contact"))}>
            Contact
          </Link>
        </div>

        {/* Mobile bar */}
        <div className="flex items-center justify-between px-5 py-3 lg:hidden">
          <span className="text-sm font-medium tracking-wide text-white/80">Menu</span>
          <button
            onClick={() => setMobileOpen((v) => !v)}
            aria-label="Toggle menu"
            className="rounded-full p-2 hover:bg-white/10"
          >
            {mobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {/* Desktop mega-menu */}
        {shopOpen && (
          <div
            className="absolute inset-x-0 top-full hidden lg:block"
            onMouseEnter={() => setShopOpen(true)}
            onMouseLeave={() => setShopOpen(false)}
          >
            <MegaMenu categories={categories} onNavigate={() => setShopOpen(false)} />
          </div>
        )}
      </nav>

      {/* Mobile menu drawer */}
      {mobileOpen && (
        <div className="border-t border-white/15 bg-mocha lg:hidden">
          <div className="space-y-1 px-5 py-4">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className="block rounded-lg px-3 py-2 text-base text-white/90 hover:bg-white/10"
              >
                {link.label}
              </Link>
            ))}
            <p className="px-3 pb-1 pt-4 text-xs font-semibold uppercase tracking-wider text-white/50">
              Shop
            </p>
            {categories.map((cat) => (
              <Link
                key={cat.id}
                href={`/shop/${cat.slug}`}
                onClick={() => setMobileOpen(false)}
                className="block rounded-lg px-3 py-2 text-sm text-white/80 hover:bg-white/10"
              >
                {cat.name}
              </Link>
            ))}
            <Link
              href="/shop"
              onClick={() => setMobileOpen(false)}
              className="block rounded-lg px-3 py-2 text-sm font-medium text-white hover:bg-white/10"
            >
              All products →
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
