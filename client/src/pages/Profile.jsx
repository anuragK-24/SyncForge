import React, { useEffect, useState } from "react";
import axios from "axios";

export default function Profile() {
  const API = import.meta.env.VITE_API_URL;
  const [profile, setProfile] = useState(null);
  const [formData, setFormData] = useState({
    photoURL: "",
    about: "",
    gender: "",
    age: "",
    skills: "",
  });
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios
      .get(`${API}/user/profile`, { withCredentials: true })
      .then((res) => {
        setProfile(res.data);
        setFormData({
          photoURL: res.data.photoURL || "",
          about: res.data.about || "",
          gender: res.data.gender || "",
          age: res.data.age || "",
          skills: (res.data.skills || []).join(", "),
        });
      })
      .catch((err) => {
        console.error("Error fetching profile:", err);
        setMessage("Failed to load profile.");
      })
      .finally(() => setLoading(false));
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");

    const skillArray = formData.skills
      .split(",")
      .map((s) => s.trim())
      .filter((s) => s);

    if (skillArray.length > 10) {
      setMessage("❌ You can have at most 10 skills.");
      return;
    }

    try {
      const response = await axios.patch(
        `${API}/user/profileUpdate/${profile._id}`,
        {
          photoURL: formData.photoURL,
          about: formData.about,
          gender: formData.gender,
          age: formData.age,
          skills: skillArray,
        },
        { withCredentials: true }
      );
      setMessage("✅ Profile updated successfully!");
      setProfile(response.data);
    } catch (error) {
      console.error("Update error:", error);
      setMessage("❌ Failed to update profile.");
    }
  };

  if (loading) {
    return (
      <p className="text-center mt-10 text-gray-600 animate-pulse">
        Loading profile...
      </p>
    );
  }

  if (!profile) {
    return (
      <p className="text-center mt-10 text-red-600">No profile found.</p>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-r from-violet-100 via-pink-100 to-rose-100 px-4 py-12">
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 bg-white/60 backdrop-blur-xl border border-gray-200 rounded-3xl shadow-2xl p-8">
        {/* Profile Card */}
        <div className="flex flex-col items-center justify-center text-center">
          <img
            src={formData.photoURL || "/default-avatar.png"}
            alt="Profile"
            className="w-36 h-36 rounded-full object-cover border-4 border-indigo-300 shadow-lg"
          />
          <h2 className="text-2xl font-bold mt-4 text-indigo-800">
            {profile.firstName} {profile.lastName}
          </h2>
          <p className="text-sm text-gray-500">{profile.emailId}</p>
          <div className="mt-4 flex flex-wrap justify-center gap-2">
            {(profile.skills || []).map((skill, i) => (
              <span
                key={i}
                className="bg-indigo-100 text-indigo-700 px-3 py-1 rounded-full text-xs font-medium"
              >
                {skill}
              </span>
            ))}
          </div>
        </div>

        {/* Edit Form */}
        <form
          onSubmit={handleSubmit}
          className="md:col-span-2 space-y-6 mt-6 md:mt-0"
        >
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Photo URL
            </label>
            <input
              type="url"
              name="photoURL"
              value={formData.photoURL}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              About
            </label>
            <textarea
              name="about"
              rows={3}
              value={formData.about}
              onChange={handleChange}
              placeholder="Tell us about your developer journey..."
              className="w-full px-4 py-2 border rounded-xl resize-none shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Gender
              </label>
              <select
                name="gender"
                value={formData.gender}
                onChange={handleChange}
                className="w-full px-4 py-2 border rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
              >
                <option value="">Select</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Age
              </label>
              <input
                type="number"
                name="age"
                value={formData.age}
                onChange={handleChange}
                className="w-full px-4 py-2 border rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Skills (comma separated)
            </label>
            <input
              type="text"
              name="skills"
              value={formData.skills}
              onChange={handleChange}
              placeholder="e.g., React.js, Node.js, MongoDB"
              className="w-full px-4 py-2 border rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
            />
          </div>

          {message && (
            <p
              className={`text-center text-sm ${
                message.includes("✅")
                  ? "text-green-600"
                  : "text-red-600"
              }`}
            >
              {message}
            </p>
          )}

          <button
            type="submit"
            className="w-full bg-gradient-to-r from-indigo-500 to-purple-600 text-white py-3 rounded-full font-semibold shadow-md hover:scale-105 transition-all duration-300"
          >
            Save Changes
          </button>
        </form>
      </div>
    </div>
  );
}
