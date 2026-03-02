import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function AuthPage({ onLogin }) {
  const nav = useNavigate();
  const [isAdminMode, setIsAdminMode] = useState(false);
  const [isSignup, setIsSignup] = useState(false);
  const [form, setForm] = useState({ username: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const role = isAdminMode ? "admin" : "user";
    const url = isSignup
      ? "http://localhost:8080/api/auth/signup"
      : "http://localhost:8080/api/auth/login";

    try {
      const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: form.username,
          password: form.password,
          role: role,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Authentication failed");
        setLoading(false);
        return;
      }

      // ✅ Save JWT
      sessionStorage.setItem("token", data.token);

      // ✅ Save user in App.jsx state
      onLogin({
        username: data.username,
        role: data.role.replace("ROLE_", "").toLowerCase(),
      });

      nav(role === "admin" ? "/admin" : "/");
    } catch (err) {
      setError("Backend not reachable. Is Spring Boot running?");
    } finally {
      setLoading(false);
    }
  };

  return (
  <div className="min-h-screen relative bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center p-6">
    {/* Role toggle */}
    <div className="absolute top-6 right-6 z-10 pointer-events-auto">
      <button
        onClick={() => setIsAdminMode(prev => !prev)}
        className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition"
      >
        Switch to {isAdminMode ? "User" : "Admin"}
      </button>
    </div>

    <div className="w-full max-w-3xl grid grid-cols-1 md:grid-cols-2 gap-6 relative z-0">
      {/* Branding */}
      <div className="hidden md:flex flex-col justify-center bg-blue-600 text-white p-8 rounded-xl shadow-lg">
        <h2 className="text-3xl font-bold">ElectroMart</h2>
        <p className="mt-4">
          {isAdminMode ? "Admin" : "User"} {isSignup ? "Signup" : "Login"}
        </p>
        <p className="mt-6 text-sm opacity-90">
          Secure login using Spring Boot & MySQL
        </p>
      </div>

      {/* Form */}
      <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md">
        <h3 className="text-xl font-semibold mb-4">
          {isAdminMode ? "Admin" : "User"} {isSignup ? "Signup" : "Login"}
        </h3>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm mb-1">Username</label>
            <input
              value={form.username}
              onChange={(e) =>
                setForm({ ...form, username: e.target.value })
              }
              className="w-full px-3 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600"
              required
            />
          </div>

          <div>
            <label className="block text-sm mb-1">Password</label>
            <input
              type="password"
              value={form.password}
              onChange={(e) =>
                setForm({ ...form, password: e.target.value })
              }
              className="w-full px-3 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600"
              required
            />
          </div>

          {error && <div className="text-red-500 text-sm">{error}</div>}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-60"
          >
            {loading ? "Please wait..." : isSignup ? "Create Account" : "Login"}
          </button>
        </form>

        <div className="mt-4 text-sm text-gray-600 dark:text-gray-300">
          {isSignup ? "Already have an account?" : "New here?"}
          <button
            onClick={() => setIsSignup(prev => !prev)}
            className="ml-2 text-blue-600"
          >
            {isSignup ? "Login" : "Signup"}
          </button>
        </div>
      </div>
    </div>
  </div>
);
}
