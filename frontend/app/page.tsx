"use client";

import { useState, useEffect } from "react";
import ProductCard from "@/components/product-cards-03";
import { getProducts } from "@/lib/api";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";

export default function HomePage() {
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    const delay = setTimeout(() => {
      fetchProducts(1);
      setPage(1);
    }, 400);

    return () => clearTimeout(delay);
  }, [search]);

  useEffect(() => {
    fetchProducts(page);
  }, [page]);

  async function fetchProducts(pageNum: number) {
    setLoading(true);
    try {
      const data = await getProducts(search, pageNum);
      setProducts(data.products);
      setTotalPages(data.total_pages);
    } catch (err) {
      console.error("Failed to fetch products", err);
    } finally {
      setLoading(false);
    }
  }

  function handlePageChange(newPage: number) {
    if (newPage < 1 || newPage > totalPages) return;
    setPage(newPage);
    window.scrollTo(0, 0);
  }

  return (
    <div>
      {/* Search bar */}
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
            className="pl-10 h-12 text-base rounded-full border-gray-300 shadow-sm"
          />
        </div>
      </div>

      {/* Products */}
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

      {/* Pagination */}
      {!loading && totalPages > 1 && (
        <div className="flex justify-center items-center gap-2 mt-10">
          <Button
            variant="outline"
            onClick={() => handlePageChange(page - 1)}
            disabled={page === 1} //cannt go before page 1
          >
            ← Previous
          </Button>

          {Array.from({ length: totalPages }, (_, i) => i + 1).map((num) => (
            <Button
              key={num}
              variant={page === num ? "default" : "outline"}
              onClick={() => handlePageChange(num)}
            >
              {num}
            </Button>
          ))}

          <Button
            variant="outline"
            onClick={() => handlePageChange(page + 1)}
            disabled={page === totalPages}
          >
            Next →
          </Button>
        </div>
      )}
    </div>
  );
}
