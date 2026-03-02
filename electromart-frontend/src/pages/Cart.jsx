import React, { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import { api } from "../services/api";

export default function Cart({ user, onLogout }) {
  const [cart, setCart] = useState([]);

  const loadCart = async () => {
    try {
      const data = await api.getCart();
      setCart(Array.isArray(data) ? data : []);
    } catch (e) {
      console.error("Failed to load cart", e);
      setCart([]);
    }
  };

  useEffect(() => {
    loadCart();
  }, []);

  const updateQty = async (productId, newQty) => {
    if (newQty < 1) return;
    await api.upsertCartItem({ productId, qty: newQty });
    loadCart();
  };

  const remove = async (productId) => {
    await api.removeCartItem(productId);
    loadCart();
  };

  // ✅ TOTAL CALCULATION
  const total = cart.reduce(
    (sum, item) => sum + item.price * item.qty,
    0
  );

  return (
    <div className="min-h-screen">
      <Navbar role={user?.role} onLogout={onLogout} />

      <div className="max-w-4xl mx-auto p-4">
        <h1 className="text-2xl font-bold mb-4 text-white">Cart</h1>

        {cart.length === 0 ? (
          <div className="text-gray-600">No items in cart</div>
        ) : (
          <>
            <div className="space-y-3">
              {cart.map((item) => (
                <div
                  key={item.productId}
                  className="p-3 bg-white rounded shadow flex justify-between items-center"
                >
                  <div>
                    <div className="font-semibold">{item.name}</div>
                    <div className="text-sm text-gray-600">
                      ₹{item.price}
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => updateQty(item.productId, item.qty - 1)}
                      className="px-2 border"
                    >
                      -
                    </button>

                    <span>{item.qty}</span>

                    <button
                      onClick={() => updateQty(item.productId, item.qty + 1)}
                      className="px-2 border"
                    >
                      +
                    </button>

                    <button
                      onClick={() => remove(item.productId)}
                      className="ml-4 text-red-600"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div className="text-right font-bold mt-4">
              Total: ₹{total.toFixed(2)}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
