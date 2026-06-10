"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { getCart, removeFromCart } from "@/lib/api";
import { Button } from "@/components/ui/button";

export default function CartPage() {
  const router = useRouter();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    //runs only once  when the page loads
    const token = localStorage.getItem("token");

    if (!token) {
      router.push("/login");
      return;
    }

    async function fetchCart() {
      try {
        const data = await getCart();
        setItems(data);
      } catch (err) {
        setError("Failed to load cart. Please try again.");
      } finally {
        setLoading(false);
      }
    }

    fetchCart();
  }, []);

  async function handleRemove(itemId) {
    try {
      await removeFromCart(itemId);
      setItems(items.filter((item) => item.id !== itemId));
    } catch (err) {
      setError("Failed to remove item.");
    }
  }

  const total = items.reduce((sum, item) => {
    return sum + item.product.price * item.quantity;
  }, 0); // 0 is the initial sum

  if (loading) {
    return <p>Loading your cart...</p>;
  }

  if (error) {
    return <p className="text-red-500">{error}</p>;
  }

  if (items.length === 0) {
    return <p>Your cart is empty.</p>;
  }

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Your Cart</h1>

      <div className="flex flex-col gap-4">
        {items.map((item) => (
          <div
            key={item.id}
            className="flex items-center gap-4 border rounded-md p-4"
          >
            <figure className="relative w-20 h-20 flex-shrink-0">
              <Image
                fill
                src={item.product.image_url || "/placeholder.png"}
                alt={item.product.name}
                className="object-cover rounded-md"
              />
            </figure>

            <div className="flex-1">
              <p className="font-medium">{item.product.name}</p>
              <p className="text-sm text-muted-foreground">
                Qty: {item.quantity}
              </p>
              <p className="text-sm font-semibold">
                ₹{item.product.price * item.quantity}
              </p>
            </div>

            <Button variant="destructive" onClick={() => handleRemove(item.id)}>
              Remove
            </Button>
          </div>
        ))}
      </div>

      <div className="mt-6 border-t pt-4 flex justify-between items-center">
        <p className="text-lg font-semibold">Total</p>
        <p className="text-lg font-bold">₹{total.toFixed(2)}</p>
      </div>
    </div>
  );
}
