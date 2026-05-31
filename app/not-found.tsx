import Link from "next/link";

import { buttonStyles } from "@/components/ui/button";
import { siteConfig } from "@/lib/site-config";

export default function NotFound() {
  return (
    <main className="flex flex-1 flex-col items-center justify-center bg-gradient-to-br from-mocha-light via-mocha to-mocha-dark px-6 py-24 text-center text-white">
      <p className="font-heading text-sm font-semibold uppercase tracking-[0.3em] text-white/70">
        {siteConfig.name}
      </p>
      <h1 className="mt-4 font-heading text-6xl font-bold">404</h1>
      <p className="mt-3 max-w-sm text-white/90">
        We couldn&apos;t find that page. It may have moved, or never existed.
      </p>
      <Link href="/" className={buttonStyles("light", "mt-7")}>
        Back to home
      </Link>
    </main>
  );
}
