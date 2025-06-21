import React from 'react';

export default function TextAreaField({ name, value, onChange, placeholder }) {
  return (
    <textarea
      name={name}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      className="border p-3 rounded-lg w-full h-24"
    />
  );
}
