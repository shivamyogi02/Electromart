import React from "react";

export default function CategoryScroller({ categories, active, onSelect }) {
  return (
    <div className="flex overflow-x-auto gap-4 pb-3 no-scrollbar mt-2">
      {categories.map((cat) => (
        <button
          key={cat.value}
          onClick={() => onSelect(cat.value)} // 👈 FIXED
          className={`flex flex-col items-center min-w-[70px] focus:outline-none transition-transform ${
            active === cat.value ? "scale-105" : ""
          }`}
        >
          <div
            className={`w-16 h-16 rounded-full flex items-center justify-center border ${
              active === cat.value
                ? "bg-blue-600 text-white border-blue-600"
                : "bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-200 border-gray-300 dark:border-gray-700"
            }`}
          >
            {cat.icon ? <cat.icon size={22} /> : <span>{cat.name[0]}</span>}
          </div>
          <span
            className={`text-sm mt-1 ${
              active === cat.value ? "text-blue-600 font-medium" : "text-gray-700 dark:text-gray-200"
            }`}
          >
            {cat.name}
          </span>
        </button>
      ))}
    </div>
  );
}
