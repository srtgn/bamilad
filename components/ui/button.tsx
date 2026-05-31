import { cn } from "@/lib/utils";

export type ButtonVariant = "primary" | "outline" | "ghost" | "light" | "dark";

const variants: Record<ButtonVariant, string> = {
  primary: "bg-mocha text-white hover:bg-mocha-dark",
  dark: "bg-ink text-white hover:bg-ink/90",
  outline: "border border-white/70 text-white hover:bg-white/10",
  ghost: "text-mocha hover:bg-mocha/10",
  light: "bg-white text-ink hover:bg-cream",
};

export function buttonStyles(
  variant: ButtonVariant = "primary",
  className?: string,
) {
  return cn(
    "inline-flex items-center justify-center gap-2 rounded-full px-6 py-3 text-sm font-medium transition disabled:cursor-not-allowed disabled:opacity-60",
    variants[variant],
    className,
  );
}

export function Button({
  variant = "primary",
  className,
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> & { variant?: ButtonVariant }) {
  return <button className={buttonStyles(variant, className)} {...props} />;
}
