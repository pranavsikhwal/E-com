import ProductCard from "@/components/product-cards-03";
import { getProducts } from "@/lib/api";

export default async function HomePage() {
  const products = await getProducts();

  return (
    <div className="grid grid-cols-4 gap-5 p-10">
      {products.map(
        (
          product, //this create productcard for each product by passing props.
        ) => (
          <ProductCard key={product.id} product={product} />
        ),
      )}
    </div>
  );
}
