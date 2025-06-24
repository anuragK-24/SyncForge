import React, { useState } from "react";
import axios from "axios";
import InputField from "../components/InputField";
import { Link, useNavigate } from "react-router-dom";

export default function Login() {
  const API = import.meta.env.VITE_API_URL;

  const [formData, setFormData] = useState({
    emailId: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const navigate = useNavigate();
  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const response = await axios.post(`${API}/auth/login`, formData, {
      });

      setMessage("✅ Logged in successfully!");
      navigate("/feed");
      
    } catch (error) {
      console.error("Login error:", error);
      setMessage("❌ Login failed. Check credentials and try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-slate-100 to-indigo-100 px-4 py-12">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md bg-white/90 backdrop-blur-md p-8 rounded-2xl shadow-xl border border-indigo-200"
      >
        <h2 className="text-3xl font-bold text-center text-indigo-700 mb-4">
          Welcome Back 👋
        </h2>
        <p className="text-sm text-center text-gray-600 mb-6">
          Login to continue collaborating
        </p>

        <div className="space-y-4">
          <InputField
            label="Email"
            name="emailId"
            type="email"
            value={formData.emailId}
            onChange={handleChange}
            required
          />
          <InputField
            label="Password"
            name="password"
            type="password"
            value={formData.password}
            onChange={handleChange}
            required
          />
        </div>

        {message && (
          <p
            className={`text-center mt-4 text-sm ${
              message.includes("success") ? "text-green-600" : "text-red-600"
            }`}
          >
            {message}
          </p>
        )}

        <button
          type="submit"
          disabled={loading}
          className="mt-6 w-full bg-indigo-600 text-white py-3 rounded-full font-semibold text-lg hover:bg-indigo-700 transition duration-300 shadow-md disabled:opacity-50"
        >
          {loading ? "Logging in..." : "Login & Collaborate 💼"}
        </button>
        <p className="text-center mt-4 text-sm ">
          Don't have account ?{" "}
          <Link to="/register" className="hover:text-indigo-600 text-blue-800">
            Register
          </Link>
        </p>
      </form>
    </div>
  );
}
