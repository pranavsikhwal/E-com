"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { addToCart } from "@/lib/api";
import { Button } from "@/components/ui/button";

export default function AddToCartButton({ productId }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  async function handleAddToCart() {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/login");
      return;
    }
    setLoading(true);
    setMessage("");
    try {
      await addToCart(productId);
      setMessage("Added to cart!");
    } catch (err) {
      setMessage("Failed to add. Try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex flex-col gap-2">
      <Button
        onClick={handleAddToCart}
        disabled={loading}
        className="w-full mt-4"
      >
        {loading ? "Adding..." : "Add to Cart"}
      </Button>

      {message && (
        <p
          className={
            message.includes("Added")
              ? "text-green-600 text-sm"
              : "text-red-500 text-sm"
          }
        >
          {message}
        </p>
      )}
    </div>
  );
}
