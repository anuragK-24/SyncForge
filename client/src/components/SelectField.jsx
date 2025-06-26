import React from "react";

export default function SelectField({ name, value, onChange, options = [], dark = false }) {
  return (
    <div>
      <label
        htmlFor={name}
        className={`block text-sm font-medium mb-1 ${
          dark ? "text-gray-300" : "text-gray-700"
        }`}
      >
        Select Gender
      </label>
      <select
        id={name}
        name={name}
        value={value}
        onChange={onChange}
        className={`w-full px-4 py-2 rounded-xl border shadow-sm focus:outline-none focus:ring-2 ${
          dark
            ? "bg-gray-800 text-white border-gray-600 focus:ring-indigo-500"
            : "bg-white text-gray-900 border-gray-300 focus:ring-indigo-400"
        }`}
      >
        <option value="">Select</option>
        {options.map((opt) => (
          <option key={opt} value={opt}>
            {opt.charAt(0).toUpperCase() + opt.slice(1)}
          </option>
        ))}
      </select>
    </div>
  );
}
