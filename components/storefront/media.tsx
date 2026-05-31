import { cn } from "@/lib/utils";

/**
 * On-brand placeholder used wherever a product/category/blog image hasn't been
 * uploaded yet. Pure CSS — no external request — so it always renders. Swap in
 * real photography via the admin (Cloudinary) and these disappear automatically.
 */
export function MediaPlaceholder({
  label,
  tone = "light",
  className,
}: {
  label: string;
  tone?: "light" | "dark";
  className?: string;
}) {
  return (
    <div
      className={cn(
        "flex h-full w-full items-center justify-center bg-gradient-to-br p-5 text-center",
        tone === "light"
          ? "from-cream to-mocha-light/50"
          : "from-mocha to-mocha-dark",
        className,
      )}
    >
      <span
        className={cn(
          "font-heading text-sm font-medium uppercase tracking-[0.15em]",
          tone === "light" ? "text-mocha-dark/70" : "text-white/90",
        )}
      >
        {label}
      </span>
    </div>
  );
}
