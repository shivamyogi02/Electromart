// src/pages/Profile.jsx
import React, { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { api } from "../services/api";

export default function Profile({ user, onLogout }) {
  const [profile, setProfile] = useState({
    username: "",
    email: "",
    role: "",
    avatar: "",
  });

  const [preview, setPreview] = useState("");

  // 🔹 LOAD PROFILE FROM BACKEND
  useEffect(() => {
    const load = async () => {
      try {
        const data = await api.getProfile();
        setProfile({
          username: data.username,
          email: data.email || "",
          role: data.role.replace("ROLE_", "").toLowerCase(),
          avatar: data.avatarBase64 || "",
        });
        setPreview(data.avatarBase64 || "");
      } catch (e) {
        console.error(e);
      }
    };
    load();
  }, []);

  const handleChange = (e) => {
    setProfile({ ...profile, [e.target.name]: e.target.value });
  };

  // 🔹 FILE UPLOAD
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreview(reader.result);
      setProfile({ ...profile, avatar: reader.result });
    };
    reader.readAsDataURL(file);
  };

  // 🔹 SAVE TO BACKEND
  const handleSave = async (e) => {
    e.preventDefault();
    try {
      await api.updateProfile({
        email: profile.email,
        avatarBase64: profile.avatar, // ✅ MATCH BACKEND
      });
      alert("Profile updated successfully!");
    } catch (err) {
      console.error(err);
      alert("Profile update failed");
    }
  };

  return (
    <div className="min-h-screen flex flex-col dark:bg-gray-900">
      <Navbar role={profile.role} onLogout={onLogout} />

      <main className="flex-grow max-w-3xl mx-auto px-6 py-6">
        <h2 className="text-2xl font-semibold mb-4 text-white">
          {profile.role === "admin" ? "Admin Profile" : "User Profile"}
        </h2>

        <form onSubmit={handleSave} className="bg-white dark:bg-gray-800 p-6 rounded shadow">
          <div className="flex justify-center mb-6">
            <label className="cursor-pointer">
              {preview ? (
                <img src={preview} className="w-32 h-32 rounded-full object-cover" />
              ) : (
                <div className="w-32 h-32 rounded-full bg-gray-200 flex items-center justify-center">
                  Upload
                </div>
              )}
              <input type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
            </label>
          </div>

          <input
            name="username"
            value={profile.username}
            readOnly
            className="w-full p-2 mb-3 border rounded bg-gray-100"
          />

          <input
            name="email"
            value={profile.email}
            onChange={handleChange}
            placeholder="Email"
            className="w-full p-2 mb-3 border rounded"
          />

          <input
            value={profile.role}
            readOnly
            className="w-full p-2 mb-4 border rounded bg-gray-100"
          />

          <button className="bg-blue-600 text-white px-4 py-2 rounded">
            Save Profile
          </button>
        </form>
      </main>

      <Footer />
    </div>
  );
}
