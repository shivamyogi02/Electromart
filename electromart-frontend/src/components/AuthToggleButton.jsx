import React from "react";

export default function AuthToggleButton({ isAdmin, setIsAdmin }) {
  return (
    <div className="absolute top-6 right-6">
      <button
        onClick={() => setIsAdmin(!isAdmin)}
        className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
      >
        Switch to {isAdmin ? "User" : "Admin"}
      </button>
    </div>
  );
}
