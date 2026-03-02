// src/pages/Login.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { api } from "../services/api";

export default function Login({ onLogin }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("user");
  const navigate = useNavigate();

  const submit = async (e) => {
    e.preventDefault();
    try {
      const res = await api.login(username, password);
      if (res && res.token) {
        // response shape from your backend: { token, username, role }
        sessionStorage.setItem("electromart_token", res.token);
        const userObj = { username: res.username || username, role: (res.role || role).toLowerCase() };
        sessionStorage.setItem("electromart_user", JSON.stringify(userObj));
        onLogin(userObj);
        navigate(userObj.role === "ROLE_ADMIN" || userObj.role === "admin" ? "/admin" : "/");
      } else {
        alert(res?.error || "Login failed");
      }
    } catch (err) {
      console.error(err);
      alert("Login error");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 to-blue-50">
      <motion.form
        onSubmit={submit}
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md bg-white shadow-lg rounded-2xl p-8"
      >
        <h2 className="text-3xl font-bold text-center text-blue-600 mb-6">Welcome to Electromart</h2>

        <input
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="Username"
          className="w-full p-3 border rounded-lg mb-3 focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          className="w-full p-3 border rounded-lg mb-5 focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
        <button className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-lg transition">Login</button>
        <p className="text-xs text-gray-500 mt-3 text-center">Demo creds — admin/admin or user/user</p>
      </motion.form>
    </div>
  );
}
