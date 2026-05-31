import { Container } from "@/components/ui/container";

export function PageHeader({
  title,
  subtitle,
}: {
  title: string;
  subtitle?: string;
}) {
  return (
    <div className="bg-mocha text-white">
      <Container className="py-14 text-center sm:py-16">
        <h1 className="font-heading text-4xl font-semibold sm:text-5xl">{title}</h1>
        {subtitle ? (
          <p className="mx-auto mt-3 max-w-xl text-white/80">{subtitle}</p>
        ) : null}
      </Container>
    </div>
  );
}
