// src/services/api.js
const API_URL = "http://localhost:8080";

function authHeaders() {
  const token = sessionStorage.getItem("token"); // ✅ FIXED
  return token ? { Authorization: `Bearer ${token}` } : {};
}

export const api = {
  // ---------- AUTH ----------
  login: async (payload) => {
    const res = await fetch(`${API_URL}/api/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    return res.json();
  },

  signup: async (payload) => {
    const res = await fetch(`${API_URL}/api/auth/signup`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    return res.json();
  },

  // ---------- PROFILE ----------
  getProfile: async () => {
    const res = await fetch(`${API_URL}/api/profile`, {
      headers: { ...authHeaders() },
    });
    if (!res.ok) throw new Error("Profile load failed");
    return res.json();
  },

  updateProfile: async (payload) => {
    const res = await fetch(`${API_URL}/api/profile`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        ...authHeaders(),
      },
      body: JSON.stringify(payload),
    });
    if (!res.ok) throw new Error("Profile update failed");
    return res.json();
  },

  // ---------- PRODUCTS ----------
  getProducts: async ({ category = "all", page = 0, size = 8 }) => {
    const q = new URLSearchParams({ category, page, size }).toString();
    const res = await fetch(`${API_URL}/api/products?${q}`);
    if (!res.ok) throw new Error("Fetch failed");
    return res.json();
  },

  createProduct: async (product) => {
    const res = await fetch(`${API_URL}/api/products`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...authHeaders(),
      },
      body: JSON.stringify(product),
    });
    if (!res.ok) throw new Error("Create failed");
    return res.json();
  },

  updateProduct: async (id, product) => {
    const res = await fetch(`${API_URL}/api/products/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        ...authHeaders(),
      },
      body: JSON.stringify(product),
    });
    if (!res.ok) throw new Error("Update failed");
    return res.json();
  },

  deleteProduct: async (id) => {
    const res = await fetch(`${API_URL}/api/products/${id}`, {
      method: "DELETE",
      headers: { ...authHeaders() },
    });
    if (!res.ok) throw new Error("Delete failed");
  },
    // ---------- CART ----------
  getCart: async () => {
    const res = await fetch(`${API_URL}/api/cart`, {
      headers: { ...authHeaders() },
    });
    if (!res.ok) throw new Error("Cart fetch failed");
    return res.json();
  },

  upsertCartItem: async (payload) => {
  const res = await fetch(`${API_URL}/api/cart`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...authHeaders(),
    },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    throw new Error("Add to cart failed");
  }

  // ✅ handle empty response safely
  const text = await res.text();
  return text ? JSON.parse(text) : null;
},

  removeCartItem: async (productId) => {
    const res = await fetch(`${API_URL}/api/cart/${productId}`, {
      method: "DELETE",
      headers: { ...authHeaders() },
    });
    if (!res.ok) throw new Error("Remove cart item failed");
  },
};
