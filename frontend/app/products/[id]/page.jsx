import Image from "next/image";
import { getProductsByID } from "@/lib/api";
import AddToCartButton from "@/components/AddToCartButton";

export default async function ProductDetailPage({ params }) {
  const { id } = await params;
  const product = await getProductsByID(id);

  return (
    <div className="max-w-4xl mx-auto">
      <div className="grid grid-cols-2 gap-10">
        <figure className="relative aspect-square w-full overflow-hidden rounded-md">
          <Image
            fill
            src={product.image_url || "/placeholder.png"}
            alt={product.name}
            className="object-cover"
          />
        </figure>

        <div className="flex flex-col justify-center gap-4">
          <h1 className="text-2xl font-bold">{product.name}</h1>

          <p className="text-muted-foreground">
            {product.description || "No description available"}
          </p>

          <p className="text-xl font-semibold">₹{product.price}</p>

          <p className={product.stock > 0 ? "text-green-600" : "text-red-500"}>
            {product.stock > 0
              ? `In Stock (${product.stock} left)`
              : "Out of Stock"}
          </p>

          <AddToCartButton productId={product.id} />
        </div>
      </div>
    </div>
  );
}
