import React from "react";

export default function TextAreaField({
  name,
  value,
  onChange,
  placeholder = "",
  rows = 4,
  required = false,
  dark = false,
  label = "About"
}) {
  return (
    <div>
      <label
        htmlFor={name}
        className={`block text-sm font-medium mb-1 ${
          dark ? "text-gray-300" : "text-gray-700"
        }`}
      >
        {label}
      </label>
      <textarea
        id={name}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        rows={rows}
        required={required}
        className={`w-full px-4 py-2 border rounded-xl resize-none shadow-sm focus:outline-none focus:ring-2 ${
          dark
            ? "bg-gray-800 text-white border-gray-600 focus:ring-indigo-500"
            : "bg-white text-gray-900 border-gray-300 focus:ring-indigo-400"
        }`}
      />
    </div>
  );
}
