import React from "react";

export default function Footer() {
  return (
    <footer className="mt-12 bg-gray-100 dark:bg-gray-800 py-6 text-center text-gray-600 dark:text-gray-300 border-t dark:border-gray-700">
      <p className="text-sm">
        © {new Date().getFullYear()} <span className="font-semibold text-blue-600 dark:text-blue-400">ElectroMart</span>. 
        All rights reserved By <span className="font-semibold text-blue-600 dark:text-blue-400">Shivam Yogi</span>.
      </p>
      <div className="mt-2 space-x-4">
        <a href="#" className="hover:text-blue-500">About</a>
        <a href="#" className="hover:text-blue-500">Contact</a>
        <a href="#" className="hover:text-blue-500">Privacy Policy</a>
      </div>
    </footer>
  );
}
