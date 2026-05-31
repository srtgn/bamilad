import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

export type CarouselCategory = {
  name: string;
  slug: string;
  image: string | null;
};

export function CategoryCarousel({
  categories,
}: {
  categories: CarouselCategory[];
}) {
  return (
    <div className="no-scrollbar flex gap-5 overflow-x-auto scroll-smooth pb-2">
      {categories.map((c) => (
        <Link
          key={c.slug}
          href={`/shop/${c.slug}`}
          className="group relative aspect-[3/4] w-56 shrink-0 overflow-hidden rounded-2xl bg-mocha"
        >
          {c.image ? (
            <Image
              src={c.image}
              alt={c.name}
              fill
              sizes="224px"
              className="object-cover opacity-90 transition duration-500 group-hover:scale-105"
            />
          ) : null}
          <div className="absolute inset-0 bg-gradient-to-t from-ink/70 via-ink/10 to-transparent" />
          <div className="absolute inset-x-0 bottom-0 flex items-center justify-between p-5">
            <span className="font-heading text-lg font-semibold text-white">
              {c.name}
            </span>
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-white/90 text-ink transition group-hover:bg-white">
              <ArrowRight className="h-4 w-4" />
            </span>
          </div>
        </Link>
      ))}
    </div>
  );
}
