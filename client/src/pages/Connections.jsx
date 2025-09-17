import React, { useEffect, useState } from "react";
import axios from "axios";
import { FaEnvelope, FaRegCopy } from "react-icons/fa";
import { motion } from "framer-motion";

export default function Connections() {
  const API = import.meta.env.VITE_API_URL;
  const [connections, setConnections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  useEffect(() => {
    axios
      .get(`${API}/api/user/connections`, { withCredentials: true })
      .then((res) => setConnections(res.data.data || []))
      .catch((err) => {
        console.error("Error fetching connections:", err);
        setMessage("❌ Failed to fetch connections.");
        setTimeout(() => setMessage(""), 2000);
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="min-h-screen bg-gray-950 text-white py-12 px-4 relative">
      {/* Toast Message */}
      {message && (
        <div className="fixed top-5 left-1/2 transform -translate-x-1/2 bg-red-600 text-white text-sm px-4 py-2 rounded-md shadow-lg z-50">
          {message}
        </div>
      )}

      <div className="max-w-6xl mx-auto">
        <h2 className="text-4xl font-extrabold text-center bg-gradient-to-r from-indigo-400 to-purple-500 text-transparent bg-clip-text mb-10">
          Your Connections 🤝
        </h2>

        {loading ? (
          <p className="text-center text-gray-400">Loading...</p>
        ) : connections.length === 0 ? (
          <p className="text-center text-gray-500">
            You have no connections yet.
          </p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {connections.map((user) => (
              <motion.div
                key={user._id}
                className="bg-gradient-to-br from-purple-900 via-purple-800 to-indigo-900 p-6 rounded-2xl shadow-lg border border-white/10 hover:scale-[1.03] transition-all duration-300"
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

                {user.age && (
                  <p className="text-sm text-center text-purple-300 mt-1">
                    Age: {user.age}
                  </p>
                )}

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

                {user.emailId ? (
                  <div className="flex justify-center gap-4 mt-5 text-sm flex-wrap">
                    <a
                      href={`mailto:${user.emailId}`}
                      className="flex items-center gap-2 bg-indigo-500 hover:bg-indigo-600 transition text-white px-4 py-2 rounded-full shadow"
                    >
                      <FaEnvelope className="text-base" />
                      Email
                    </a>
                    <button
                      onClick={() => {
                        navigator.clipboard.writeText(user.emailId);
                        setMessage("📋 Email copied to clipboard!");
                        setTimeout(() => setMessage(""), 500);
                      }}
                      className="flex items-center gap-2 bg-indigo-500 hover:bg-indigo-600 transition text-white px-4 py-2 rounded-full shadow"
                    >
                      <FaRegCopy className="text-base" />
                      Copy
                    </button>
                  </div>
                ) : (
                  <p className="text-red-400 text-xs mt-3 text-center">
                    No email available
                  </p>
                )}
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
