"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { getCart, removeFromCart, placeOrder } from "@/lib/api";
import { Button } from "@/components/ui/button";

export default function CartPage() {
  const router = useRouter();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [ordering, setOrdering] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/login");
      return;
    }
    fetchCart();
  }, []);

  async function fetchCart() {
    try {
      const data = await getCart();
      setItems(data);
    } catch (err) {
      setError("Failed to load cart.");
    } finally {
      setLoading(false);
    }
  }

  async function handleRemove(itemId) {
    try {
      await removeFromCart(itemId);
      setItems(items.filter((item) => item.id !== itemId));
    } catch (err) {
      setError("Failed to remove item.");
    }
  }

  async function handlePlaceOrder() {
    const confirmed = window.confirm(
      "Are you sure you want to place this order?",
    );
    if (!confirmed) return;

    setOrdering(true);
    setError("");

    try {
      await placeOrder();
      setItems([]);
      setOrderSuccess(true);
    } catch (err) {
      setError("Failed to place order. Please try again.");
    } finally {
      setOrdering(false);
    }
  }

  const total = items.reduce((sum, item) => {
    return sum + item.product.price * item.quantity;
  }, 0);

  if (loading) return <p>Loading your cart...</p>;

  if (orderSuccess) {
    return (
      <div className="max-w-2xl mx-auto text-center mt-20">
        <h1 className="text-3xl font-bold mb-4">
          🎉 Order Placed Successfully!
        </h1>
        <p className="text-muted-foreground mb-8">
          Thank you for your order. We'll process it shortly.
        </p>
        <Button onClick={() => router.push("/")}>Continue Shopping</Button>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="max-w-2xl mx-auto text-center mt-20">
        <p className="text-muted-foreground mb-4">Your cart is empty.</p>
        <Button onClick={() => router.push("/")}>Browse Products</Button>
      </div>
    );
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

      <div className="mt-6 border-t pt-4">
        <div className="flex justify-between items-center mb-6">
          <p className="text-lg font-semibold">Total</p>
          <p className="text-lg font-bold">₹{total.toFixed(2)}</p>
        </div>

        {error && <p className="text-red-500 text-sm mb-4">{error}</p>}

        <Button
          className="w-full"
          onClick={handlePlaceOrder}
          disabled={ordering}
        >
          {ordering ? "Placing Order..." : "Place Order"}
        </Button>
      </div>
    </div>
  );
}
