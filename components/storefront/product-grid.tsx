import { ProductCard, type ProductCardData } from "./product-card";

export function ProductGrid({
  products,
}: {
  products: (ProductCardData & { id: string })[];
}) {
  if (products.length === 0) {
    return (
      <p className="py-16 text-center text-mocha">
        No products here yet — check back soon.
      </p>
    );
  }
  return (
    <div className="grid grid-cols-2 gap-x-6 gap-y-10 md:grid-cols-3 lg:grid-cols-4">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}
