import React, { useEffect, useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";

export default function SwipedProfiles() {
  const API = import.meta.env.VITE_API_URL;
  const [profiles, setProfiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  useEffect(() => {
    axios
      .get(`${API}/user/swipes`, { withCredentials: true })
      .then((res) => setProfiles(res.data.data))
      .catch((err) => {
        console.error("Fetch error:", err);
        setMessage("Failed to load swiped profiles.");
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="min-h-screen bg-gray-950 text-white py-12 px-4">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-4xl font-extrabold text-center bg-gradient-to-r from-purple-400 to-indigo-500 text-transparent bg-clip-text mb-10">
          Profiles You Swiped 👉
        </h2>

        {message && (
          <p className="text-center text-sm text-red-400 mb-4">{message}</p>
        )}

        {loading ? (
          <p className="text-center text-gray-400">Loading...</p>
        ) : profiles.length === 0 ? (
          <p className="text-center text-gray-500">
            You haven't swiped anyone yet!
          </p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {profiles.map((user) => (
              <motion.div
                key={user._id}
                className="bg-gradient-to-br from-purple-900 via-purple-800 to-indigo-900 p-6 rounded-2xl shadow-xl hover:scale-105 transition-all duration-300 border border-white/10"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
              >
                <img
                  src={user.photoURL || "/default-avatar.png"}
                  alt={user.firstName}
                  className="w-24 h-24 rounded-full object-cover mx-auto mb-4 border-4 border-white/20"
                />
                <h3 className="text-xl font-bold text-center text-white">
                  {user.firstName} {user.lastName}
                </h3>
                <p className="text-sm text-center text-purple-300 mt-1">
                  {user.gender}
                </p>
                <p className="mt-3 text-sm text-center text-gray-300">
                  {user.about || "No bio provided"}
                </p>
                <div className="flex flex-wrap justify-center gap-2 mt-4">
                  {(user.skills || []).map((skill, i) => (
                    <span
                      key={i}
                      className="bg-white/10 text-white px-3 py-1 rounded-full text-xs font-medium"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
