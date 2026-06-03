const BASE_URL = "http://localhost:8000";

export async function getProducts() {
  const res = await fetch(`${BASE_URL}/products/`, {
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error("Failed to fetch products");
  }

  return res.json();
}
export async function getProductsByID(id) {
  const res = await fetch(`${BASE_URL}/products/${id}`, {
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error("Failed to fetch product");
  }

  return res.json();
}
