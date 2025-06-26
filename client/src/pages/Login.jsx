import React, { useState } from "react";
import axios from "axios";
import InputField from "../components/InputField";
import { Link, useNavigate } from "react-router-dom";

export default function Login({ setIsAuth }) {
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
        withCredentials: true,
        headers: {
          "Content-Type": "application/json",
        },
      });

      setMessage("✅ Logged in successfully!");
      setIsAuth(true);
      navigate("/feed", { replace: true });
    } catch (error) {
      console.error("Login error:", error);
      setMessage("❌ Login failed. Check credentials and try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-950 px-4 py-12 text-white">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md bg-gray-900/80 border border-gray-700 p-8 rounded-2xl shadow-2xl backdrop-blur"
      >
        <h2 className="text-3xl font-extrabold text-center text-indigo-400 mb-3">
          Welcome Back 👋
        </h2>
        <p className="text-sm text-center text-gray-400 mb-6">
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
            dark
          />
          <InputField
            label="Password"
            name="password"
            type="password"
            value={formData.password}
            onChange={handleChange}
            required
            dark
          />
        </div>

        {message && (
          <p
            className={`text-center mt-4 text-sm font-medium ${
              message.includes("success") ? "text-green-400" : "text-red-400"
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

        <p className="text-center mt-4 text-sm text-gray-400">
          Don't have an account?{" "}
          <Link
            to="/register"
            className="text-indigo-400 hover:underline hover:text-indigo-300"
          >
            Register
          </Link>
        </p>
      </form>
    </div>
  );
}
