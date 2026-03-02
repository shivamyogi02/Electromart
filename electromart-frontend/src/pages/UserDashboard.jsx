// src/pages/UserDashboard.jsx
import React, { useEffect, useMemo, useState } from "react";
import Navbar from "../components/Navbar";
import CategoryScroller from "../components/CategoryScroller";
import ProductCard from "../components/ProductCard";
import Footer from "../components/Footer";
import { api } from "../services/api";
import { FaMobileAlt, FaLaptop, FaTv, FaHeadphones, FaClock, FaThLarge } from "react-icons/fa";
import { MdArrowBackIos, MdArrowForwardIos } from "react-icons/md";

export default function UserDashboard({ user, onLogout }) {
  const [productsPage, setProductsPage] = useState({ content: [], totalPages: 1, number: 0 });
  const [cartCount, setCartCount] = useState(0);
  const [filter, setFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(0);
  const productsPerPage = 8;

  const categories = useMemo(() => [
    { name: "All", value: "all", icon: FaThLarge },
    { name: "Mobiles", value: "mobiles", icon: FaMobileAlt },
    { name: "Laptops", value: "laptops", icon: FaLaptop },
    { name: "Appliances", value: "appliances", icon: FaTv },
    { name: "Headphones", value: "headphones", icon: FaHeadphones },
    { name: "Watches", value: "watches", icon: FaClock },
  ], []);

  useEffect(() => {
  const init = async () => {
    try {
      await loadProducts();

      // Load cart count ONLY if user exists
      if (user) {
        const c = await api.getCart();
        setCartCount(
          Array.isArray(c)
            ? c.reduce((s, i) => s + (i.qty || 0), 0)
            : 0
        );
      }
    } catch (err) {
      console.error("Dashboard init failed", err);
      setCartCount(0); // prevent crash
    }
  };

  init();
}, [filter, currentPage, user]);


  const loadProducts = async () => {
    try {
      const pageData = await api.getProducts({ category: filter, page: currentPage, size: productsPerPage });
      setProductsPage(pageData);
    } catch (err) {
      console.error("Failed to load products", err);
    }
  };

  const handleAdd = async (p) => {
    try {
      // upsert cart item: adjust qty if exists -> here we create qty:1
      await api.upsertCartItem({ productId: p.id, qty: 1 });
      const c = await api.getCart();
      setCartCount(Array.isArray(c) ? c.reduce((s,i)=>s+(i.qty||0),0) : 0);
    } catch (err) {
      console.error(err);
      alert("Add to cart failed. Login required?");
    }
  };

  const products = productsPage.content || [];
  const totalPages = productsPage.totalPages || 1;
  const pageNumber = productsPage.number || currentPage;

  return (
    <div className="min-h-screen flex flex-col dark:bg-gray-900 relative z-10 pointer-events-auto">
      <Navbar role={user?.role} onLogout={onLogout} cartCount={cartCount} />

      <main className="flex-grow max-w-7xl mx-auto px-6 py-4">
        <h1 className="text-2xl font-semibold mb-4 text-gray-800 dark:text-gray-100">
          Welcome, <span className="text-blue-600 dark:text-blue-400">{user?.username}</span>
        </h1>

        <CategoryScroller categories={categories} active={filter} onSelect={(value) => { setFilter(value); setCurrentPage(0); }} />

        <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mt-6">
          {products.length > 0 ? products.map(p => <ProductCard key={p.id} product={{
            id: p.id, title: p.title || p.name || "", price: p.price, description: p.description,
            image: p.imageBase64 || p.image || ""
          }} onAdd={handleAdd} />)
            : <div className="col-span-full text-center text-gray-500 dark:text-gray-400">No products found.</div>}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center items-center gap-3 mt-8">
            <button onClick={() => setCurrentPage(Math.max(0, pageNumber - 1))} disabled={pageNumber === 0}
              className={`p-2 rounded-full ${pageNumber === 0 ? "text-gray-400 cursor-not-allowed" : "text-blue-600"}`}>
              <MdArrowBackIos size={18} />
            </button>
            <div className="text-gray-700 dark:text-gray-200">Page <strong>{pageNumber + 1}</strong> of <strong>{totalPages}</strong></div>
            <button onClick={() => setCurrentPage(Math.min(totalPages - 1, pageNumber + 1))} disabled={pageNumber === totalPages - 1}
              className={`p-2 rounded-full ${pageNumber === totalPages - 1 ? "text-gray-400 cursor-not-allowed" : "text-blue-600"}`}>
              <MdArrowForwardIos size={18} />
            </button>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
