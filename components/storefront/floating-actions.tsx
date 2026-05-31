import Link from "next/link";
import { Search, User, ShoppingBag } from "lucide-react";

import { cn } from "@/lib/utils";

const base =
  "flex h-12 w-12 items-center justify-center rounded-2xl bg-mocha/85 text-white shadow-lg backdrop-blur transition hover:bg-mocha-dark";

export function FloatingActions({ cartCount = 0 }: { cartCount?: number }) {
  return (
    <div className="fixed left-3 top-1/3 z-40 hidden flex-col gap-3 sm:flex">
      <Link href="/shop" aria-label="Search products" className={base}>
        <Search className="h-5 w-5" />
      </Link>
      <Link href="/account" aria-label="Your account" className={base}>
        <User className="h-5 w-5" />
      </Link>
      <Link href="/cart" aria-label="Your cart" className={cn(base, "relative")}>
        <ShoppingBag className="h-5 w-5" />
        <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-gold px-1 text-[11px] font-semibold text-white">
          {cartCount}
        </span>
      </Link>
    </div>
  );
}
