import React from 'react';

export default function SelectField({ name, value, onChange, options = [] }) {
  return (
    <select
      name={name}
      value={value}
      onChange={onChange}
      className="border p-3 rounded-lg w-full"
    >
      <option value="">Select Gender</option>
      {options.map((opt) => (
        <option key={opt} value={opt}>{opt.charAt(0).toUpperCase() + opt.slice(1)}</option>
      ))}
    </select>
  );
}
