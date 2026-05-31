import Link from "next/link";

import { Container } from "@/components/ui/container";

export type MegaCategory = {
  id: string;
  name: string;
  slug: string;
  children: { id: string; name: string; slug: string }[];
};

export function MegaMenu({
  categories,
  onNavigate,
}: {
  categories: MegaCategory[];
  onNavigate?: () => void;
}) {
  return (
    <div className="border-t border-mocha/10 bg-cream shadow-xl">
      <Container className="py-10">
        <div className="grid grid-cols-2 gap-x-8 gap-y-10 md:grid-cols-3">
          {categories.map((cat) => (
            <div key={cat.id}>
              <Link
                href={`/shop/${cat.slug}`}
                onClick={onNavigate}
                className="font-heading text-base font-semibold text-ink transition hover:text-gold"
              >
                {cat.name}
              </Link>
              <ul className="mt-3 space-y-2.5">
                {cat.children.map((child) => (
                  <li key={child.id}>
                    <Link
                      href={`/shop/${child.slug}`}
                      onClick={onNavigate}
                      className="text-sm text-mocha-dark transition hover:text-gold"
                    >
                      {child.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </Container>
    </div>
  );
}
