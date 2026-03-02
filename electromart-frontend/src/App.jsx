import React, { useState, useEffect } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import AuthPage from "./pages/AuthPage";
import UserDashboard from "./pages/UserDashboard";
import AdminDashboard from "./pages/AdminDashboard";
import ProfilePage from "./pages/ProfilePage";
import Cart from "./pages/Cart";

export default function App() {
  const [user, setUser] = useState(() => {
    try {
      return JSON.parse(sessionStorage.getItem("electromart_user"));
    } catch {
      return null;
    }
  });

  useEffect(() => {
    if (user) {
      sessionStorage.setItem("electromart_user", JSON.stringify(user));
    } else {
      sessionStorage.removeItem("electromart_user");
    }
  }, [user]);

  return (
    <Routes>
      {/* AUTH */}
      <Route
        path="/auth"
        element={
          user
            ? <Navigate to={user.role === "admin" ? "/admin" : "/"} />
            : <AuthPage onLogin={setUser} />
        }
      />


      {/* USER */}
      <Route
        path="/"
        element={
          user ? (
            <UserDashboard user={user} onLogout={() => setUser(null)} />
          ) : (
            <Navigate to="/auth" replace />
          )
        }
      />

      {/* CART */}
      <Route
        path="/cart"
        element={
          user ? (
            <Cart user={user} onLogout={() => setUser(null)} />
          ) : (
            <Navigate to="/auth" replace />
          )
        }
      />

      {/* PROFILE */}
      <Route
        path="/profile"
        element={
          user ? (
            <ProfilePage user={user} onLogout={() => setUser(null)} />
          ) : (
            <Navigate to="/auth" replace />
          )
        }
      />

      {/* ADMIN */}
      <Route
        path="/admin"
        element={
          user?.role === "admin" ? (
            <AdminDashboard user={user} onLogout={() => setUser(null)} />
          ) : (
            <Navigate to="/auth" replace />
          )
        }
      />

      {/* FALLBACK */}
      <Route
        path="*"
        element={<Navigate to={user ? "/" : "/auth"} replace />}
      />
    </Routes>
  );
}
