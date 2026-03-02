

import React, { useEffect, useMemo, useState } from "react";
import Navbar from "../components/Navbar";
import CategoryScroller from "../components/CategoryScroller";
import ProductForm from "../components/ProductForm";
import { api } from "../services/api";
import { motion } from "framer-motion";
import {
  FaMobileAlt, FaLaptop, FaTv,
  FaHeadphones, FaClock, FaThLarge,
  FaBox, FaChartLine, FaUsers
} from "react-icons/fa";

export default function AdminDashboard({ user, onLogout }) {

  const [products, setProducts] = useState([]);
  const [filter, setFilter] = useState("all");
  const [editing, setEditing] = useState(null);
  const [loading, setLoading] = useState(false);
  const [section, setSection] = useState("products"); // 👈 important

  const categories = useMemo(() => [
    { name: "All", value: "all", icon: FaThLarge },
    { name: "Mobiles", value: "mobiles", icon: FaMobileAlt },
    { name: "Laptops", value: "laptops", icon: FaLaptop },
    { name: "Appliances", value: "appliances", icon: FaTv },
    { name: "Headphones", value: "headphones", icon: FaHeadphones },
    { name: "Watches", value: "watches", icon: FaClock },
  ], []);

  const loadProducts = async () => {
    setLoading(true);
    const res = await api.getProducts({ category: filter, page: 0, size: 50 });
    setProducts(res.content || []);
    setLoading(false);
  };

  useEffect(() => {
    loadProducts();
  }, [filter]);

  const handleSave = async (product) => {
    if (editing) {
      await api.updateProduct(editing.id, product);
    } else {
      await api.createProduct(product);
    }
    setEditing(null);
    await loadProducts();
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete product?")) return;
    await api.deleteProduct(id);
    await loadProducts();
  };

  return (
    <div className="min-h-screen flex bg-gray-100 dark:bg-gray-900">

      {/* SIDEBAR */}
      <aside className="w-64 bg-white dark:bg-gray-800 shadow-lg p-6 hidden md:block">
        <h2 className="text-2xl font-bold text-blue-600 mb-8">
          ElectroMart
        </h2>

        <nav className="space-y-4">

          <SidebarItem
            icon={<FaBox />}
            label="Products"
            active={section === "products"}
            onClick={() => setSection("products")}
          />

          <SidebarItem
            icon={<FaChartLine />}
            label="Analytics"
            active={section === "analytics"}
            onClick={() => setSection("analytics")}
          />

          <SidebarItem
            icon={<FaUsers />}
            label="Users"
            active={section === "users"}
            onClick={() => setSection("users")}
          />

        </nav>
      </aside>

      {/* MAIN CONTENT */}
      <div className="flex-1 flex flex-col">
        <Navbar role={user?.role} onLogout={onLogout} />

        <main className="p-6 max-w-7xl mx-auto w-full">

          {/* ================= PRODUCTS SECTION ================= */}
          {section === "products" && (
            <>
              {/* Hero */}
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-gradient-to-r from-blue-600 to-cyan-500 text-white p-6 rounded-2xl shadow-lg mb-8"
              >
                <h2 className="text-3xl font-bold">
                  Welcome back, {user?.username}
                </h2>
                <p className="mt-2 text-blue-100">
                  Manage products and monitor your store performance.
                </p>
              </motion.div>

              {/* Analytics Cards */}
              <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6 mb-10">
                <AnalyticsCard title="Total Products" value={products.length} />
                <AnalyticsCard title="Categories" value={categories.length - 1} />
                <AnalyticsCard title="Active Users" value="128" />
              </div>

              {/* Product Form */}
              <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-lg mb-8">
                <ProductForm onSave={handleSave} editing={editing} />
              </div>

              <CategoryScroller
                categories={categories}
                active={filter}
                onSelect={(v) => setFilter(v)}
              />

              {/* Product Grid */}
              <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mt-8">
                {loading
                  ? Array(8).fill().map((_, i) => <SkeletonCard key={i} />)
                  : products.map((p) => (
                    <motion.div
                      key={p.id}
                      whileHover={{ y: -5 }}
                      className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden flex flex-col"
                    >
                      <div className="h-40 bg-gray-100 dark:bg-gray-700 flex items-center justify-center">
                        <img
                          src={p.imageBase64}
                          alt={p.title}
                          className="h-full object-cover"
                        />
                      </div>

                      <div className="p-4 flex flex-col flex-grow">
                        <h4 className="font-semibold text-gray-800 dark:text-gray-100">
                          {p.title}
                        </h4>
                        <p className="text-blue-600 font-bold mt-1">
                          ₹{p.price}
                        </p>

                        <div className="flex justify-between mt-auto pt-4">
                          <button
                            onClick={() => setEditing(p)}
                            className="bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1 rounded-lg text-sm"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDelete(p.id)}
                            className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-lg text-sm"
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  ))}
              </div>
            </>
          )}

          {/* ================= ANALYTICS SECTION ================= */}
          {section === "analytics" && (
            <div className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-lg">
              <h2 className="text-2xl font-bold mb-4">Analytics Overview</h2>
              <p className="mb-2">📦 Total Products: {products.length}</p>
              <p className="mb-2">📂 Categories: {categories.length - 1}</p>
              <p>👥 Active Users: 128</p>
            </div>
          )}

          {/* ================= USERS SECTION ================= */}
          {section === "users" && (
            <div className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-lg">
              <h2 className="text-2xl font-bold mb-4">Users</h2>
              <p>User management coming soon...</p>
            </div>
          )}

        </main>
      </div>
    </div>
  );
}

/* Sidebar Item */
function SidebarItem({ icon, label, active, onClick }) {
  return (
    <div
      onClick={onClick}
      className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer transition 
      ${active
          ? "bg-blue-600 text-white"
          : "text-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-700"
        }`}
    >
      {icon}
      <span>{label}</span>
    </div>
  );
}

/* Analytics Card */
function AnalyticsCard({ title, value }) {
  return (
    <motion.div
      whileHover={{ scale: 1.05 }}
      className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-lg text-center"
    >
      <h4 className="text-gray-500 dark:text-gray-400">{title}</h4>
      <p className="text-3xl font-bold text-blue-600 mt-2">{value}</p>
    </motion.div>
  );
}

/* Loading Skeleton */
function SkeletonCard() {
  return (
    <div className="animate-pulse bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-4">
      <div className="h-40 bg-gray-300 dark:bg-gray-700 rounded mb-4"></div>
      <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded mb-2"></div>
      <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-1/2"></div>
    </div>
  );
}