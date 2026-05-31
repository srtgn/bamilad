import { Container } from "@/components/ui/container";

export function AuthShell({
  title,
  subtitle,
  children,
  footer,
}: {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
}) {
  return (
    <Container className="flex justify-center py-16">
      <div className="w-full max-w-md">
        <div className="rounded-3xl bg-cream-soft p-8 sm:p-10">
          <h1 className="font-heading text-2xl font-semibold text-ink">{title}</h1>
          {subtitle ? (
            <p className="mt-1.5 text-sm text-mocha-dark">{subtitle}</p>
          ) : null}
          <div className="mt-6">{children}</div>
        </div>
        {footer ? (
          <div className="mt-5 text-center text-sm text-mocha-dark">{footer}</div>
        ) : null}
      </div>
    </Container>
  );
}
