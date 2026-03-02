
import React from "react";
import { motion } from "framer-motion";

export default function ProductCard({ product, onAdd }) {
  return (
    <motion.div
      whileHover={{ y: -8 }}
      transition={{ type: "spring", stiffness: 200 }}
      className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden flex flex-col"
    >
      {/* Image Section */}
      <div className="h-52 bg-gray-100 dark:bg-gray-700 flex items-center justify-center overflow-hidden">
        <img
          src={product.image}
          alt={product.title}
          className="h-full object-contain p-4 transition-transform duration-300 hover:scale-105"
        />
      </div>

      {/* Content */}
      <div className="p-5 flex flex-col flex-grow">
        <h3 className="font-semibold text-lg text-gray-800 dark:text-gray-100">
          {product.title}
        </h3>

        <p className="text-gray-500 dark:text-gray-400 text-sm mt-2 flex-grow">
          {product.description || "No description available"}
        </p>

        <div className="flex items-center justify-between mt-4">
          <div className="text-xl font-bold text-blue-600">
            ₹{product.price}
          </div>

          <button
            onClick={() => onAdd(product)}
            className="bg-gradient-to-r from-blue-600 to-cyan-500 hover:opacity-90 text-white px-4 py-2 rounded-lg text-sm shadow-md transition-all duration-300"
          >
            Add to Cart
          </button>
        </div>
      </div>
    </motion.div>
  );
}