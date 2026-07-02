"use client";

import { useState, useEffect } from "react";
import ProductCard from "@/components/product-cards-03";
import { getProducts } from "@/lib/api";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

export default function HomePage() {
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const delay = setTimeout(() => {
      fetchProducts();
    }, 400);

    return () => clearTimeout(delay);
  }, [search]);

  async function fetchProducts() {
    setLoading(true);
    try {
      const data = await getProducts(search);
      setProducts(data);
    } catch (err) {
      console.error("Failed to fetch products", err);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      {/* Search bar — centered, prominent */}
      <div className="flex flex-col items-center mb-10 mt-4">
        <div className="relative w-full max-w-xl">
          <Search
            className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
            size={18}
          />
          <Input
            type="text"
            placeholder="Search products..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10 h-12 text-base rounded-full border-gray-300 shadow-sm focus:ring-2 focus:ring-black"
          />
        </div>
      </div>

      {/* Results */}
      {loading && (
        <p className="text-center text-muted-foreground">Loading products...</p>
      )}

      {!loading && products.length === 0 && (
        <p className="text-center text-muted-foreground mt-10">
          No products found for "{search}"
        </p>
      )}

      {!loading && products.length > 0 && (
        <div className="grid grid-cols-4 gap-5">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
}
