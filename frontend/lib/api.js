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
export async function registerUser(email, password) {
  const res = await fetch(`${BASE_URL}/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });

  if (!res.ok) {
    throw new Error("Registration failed");
  }

  return res.json();
}
export async function loginUser(email, password) {
  const formData = new FormData();
  formData.append("username", email);
  formData.append("password", password);

  const res = await fetch(`${BASE_URL}/auth/login`, {
    method: "POST",
    body: formData,
  });

  if (!res.ok) {
    throw new Error("Login failed");
  }

  return res.json();
}
export async function getCart() {
  const token = localStorage.getItem("token");

  const res = await fetch(`${BASE_URL}/cart/`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  if (!res.ok) {
    throw new Error("Failed to fetch cart");
  }

  return res.json();
}
export async function addToCart(productId, quantity = 1) {
  const token = localStorage.getItem("token");

  const res = await fetch(`${BASE_URL}/cart/add`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ product_id: productId, quantity }),
  });

  if (!res.ok) {
    throw new Error("Failed to add to cart");
  }

  return res.json();
}

export async function removeFromCart(itemId) {
  const token = localStorage.getItem("token");

  const res = await fetch(`${BASE_URL}/cart/${itemId}`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${token}` },
  });

  if (!res.ok) {
    throw new Error("Failed to remove from cart");
  }

  return res.json();
}
