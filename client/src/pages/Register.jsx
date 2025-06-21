import React, { useState } from "react";
import axios from "axios";
import InputField from "../components/InputField";
import SelectField from "../components/SelectField";
import TextAreaField from "../components/TextAreaField";

export default function Register() {
  const API = import.meta.env.VITE_API_URL;

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    emailId: "",
    password: "",
    age: "",
    skills: "",
    gender: "",
    photoURL: "",
    about: "",
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const payload = {
        ...formData,
        skills: formData.skills
          .split(",")
          .map((skill) => skill.trim())
          .filter(Boolean),
        photoURL: formData.photoURL || undefined, // ✅ only send if not empty
      };

      const response = await axios.post(`${API}/auth/signup`, payload);
      setMessage("🎉 Profile created successfully! Start collaborating now.");
      console.log("Response:", response.data);
    } catch (error) {
      console.error("Error submitting form:", error);
      setMessage(
        "⚠️ Something went wrong. Please check your inputs or try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-slate-100 to-indigo-100 px-4 py-12">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-2xl bg-white/90 backdrop-blur-md p-10 rounded-2xl shadow-xl border border-indigo-200"
      >
        <h2 className="text-4xl font-extrabold text-center text-indigo-700 mb-6">
          Join the Developer Network 💻🚀
        </h2>
        <p className="text-center text-gray-600 mb-8 text-sm">
          Connect with like-minded developers. Build cool stuff. Launch
          together.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <InputField
            label="First Name"
            name="firstName"
            value={formData.firstName}
            onChange={handleChange}
            required
          />
          <InputField
            label="Last Name"
            name="lastName"
            value={formData.lastName}
            onChange={handleChange}
            required
          />
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
          <InputField
            label="Age"
            name="age"
            type="number"
            value={formData.age}
            onChange={handleChange}
          />
          <InputField
            label="Tech Skills (comma separated)"
            name="skills"
            value={formData.skills}
            onChange={handleChange}
          />
          <SelectField
            name="gender"
            value={formData.gender}
            onChange={handleChange}
            options={["male", "female", "other"]}
          />
          <InputField
            label="Photo URL (optional)"
            name="photoURL"
            type="url"
            value={formData.photoURL}
            onChange={handleChange}
          />
        </div>

        <div className="mt-6">
          <TextAreaField
            name="about"
            value={formData.about}
            onChange={handleChange}
            placeholder="Tell the dev community about yourself, projects, and interests 👨‍💻"
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
          className="mt-8 w-full bg-indigo-600 text-white py-3 rounded-full font-semibold text-lg hover:bg-indigo-700 transition-all duration-300 shadow-md disabled:opacity-50"
        >
          {loading ? "Creating Profile..." : "Register & Collaborate Now 🔧"}
        </button>
      </form>
    </div>
  );
}
