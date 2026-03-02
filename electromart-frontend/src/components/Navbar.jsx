

import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ShoppingCart, LogOut, UserCircle, Sun, Moon } from "lucide-react";

export default function Navbar({ role, onLogout, cartCount = 0 }) {
  const navigate = useNavigate();
  const [theme, setTheme] = useState(localStorage.getItem("theme") || "light");

  useEffect(() => {
    if (theme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
    localStorage.setItem("theme", theme);
  }, [theme]);

  const toggleTheme = () => setTheme(theme === "light" ? "dark" : "light");

  return (
    <nav className="sticky top-0 z-50 backdrop-blur-md bg-white/80 dark:bg-gray-900/80 shadow-md border-b border-gray-200 dark:border-gray-800 transition-all">
      <div className="max-w-7xl mx-auto px-6 py-3 flex items-center justify-between">

        {/* Logo */}
        <h1
          onClick={() => navigate(role === "admin" ? "/admin" : "/")}
          className="text-2xl font-extrabold bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent cursor-pointer select-none tracking-wide"
        >
          ElectroMart
        </h1>

        <div className="flex items-center gap-6">

          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            className="p-2 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-200 hover:scale-110 hover:bg-gray-200 dark:hover:bg-gray-700 transition-all duration-300"
            title={theme === "light" ? "Switch to Dark Mode" : "Switch to Light Mode"}
          >
            {theme === "light" ? <Moon size={20} /> : <Sun size={20} />}
          </button>

          {/* Cart */}
          {role === "user" && (
            <button
              onClick={() => navigate("/cart")}
              className="relative text-gray-700 dark:text-gray-200 hover:text-blue-600 transition-transform hover:scale-110 duration-300"
              title="Cart"
            >
              <ShoppingCart size={22} />
              {cartCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-gradient-to-r from-red-500 to-pink-500 text-white text-xs px-1.5 py-0.5 rounded-full shadow-md animate-pulse">
                  {cartCount}
                </span>
              )}
            </button>
          )}

          {/* Profile */}
          <button
            onClick={() => navigate("/profile")}
            className="flex items-center gap-1 text-gray-700 dark:text-gray-200 hover:text-blue-600 hover:scale-105 transition-all duration-300"
            title="Profile"
          >
            <UserCircle size={22} />
            <span className="hidden sm:inline font-medium">Profile</span>
          </button>

          {/* Logout */}
          <button
            onClick={onLogout}
            className="flex items-center gap-1 text-gray-700 dark:text-gray-200 hover:text-red-500 hover:scale-105 transition-all duration-300"
            title="Logout"
          >
            <LogOut size={22} />
            <span className="hidden sm:inline font-medium">Logout</span>
          </button>
        </div>
      </div>
    </nav>
  );
}