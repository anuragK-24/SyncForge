import React from 'react';

export default function InputField({ label, name, type = 'text', value, onChange, required = false }) {
  return (
    <input
      type={type}
      name={name}
      placeholder={label}
      value={value}
      onChange={onChange}
      required={required}
      className="border p-3 rounded-lg w-full"
    />
  );
}
