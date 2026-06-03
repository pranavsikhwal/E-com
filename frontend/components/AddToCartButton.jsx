"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";

export default function AddToCartButton({ productId }) {
  const [loading, setLoading] = useState(false);

  function handleAddToCart() {
    setLoading(true);

    // cart logic will go here later when auth is ready
    console.log("Adding product to cart:", productId);

    setTimeout(() => {
      setLoading(false);
    }, 1000);
  }

  return (
    <Button
      onClick={handleAddToCart}
      disabled={loading}
      className="w-full mt-4"
    >
      {loading ? "Adding..." : "Add to Cart"}
    </Button>
  );
}
