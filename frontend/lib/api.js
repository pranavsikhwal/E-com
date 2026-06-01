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
