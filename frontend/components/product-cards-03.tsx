import Link from "next/link";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

type Product = {
  id: number;
  name: string;
  description: string | null;
  price: number;
  image_url: string | null;
  stock: number;
};

export default function ProductCard({ product }: { product: Product }) {
  return (
    <div className="group">
      <figure className="relative aspect-square w-full overflow-hidden rounded-md">
        <Image
          fill
          className="object-cover transition-transform duration-300 group-hover:scale-105 group-hover:rotate-2"
          src={product.image_url || "/placeholder.png"}
          alt={product.name}
        />
        <Badge
          variant="secondary"
          className="absolute end-2 top-2 bg-white/30 dark:bg-black/30"
        >
          {product.stock > 0 ? "In Stock" : "Out of Stock"}
        </Badge>
      </figure>

      <div className="mt-3 flex items-center justify-between">
        <p className="font-medium">{product.name}</p>
        <p className="text-muted-foreground">₹{product.price}</p>
      </div>

      <Link href={`/products/${product.id}`}>
        <Button variant="secondary" className="mt-3 w-full">
          Details
        </Button>
      </Link>
    </div>
  );
}
