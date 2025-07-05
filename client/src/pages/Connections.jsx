import React, { useEffect, useState } from "react";
import axios from "axios";
import { FaEnvelope } from "react-icons/fa";

export default function Connections() {
  const API = import.meta.env.VITE_API_URL;
  const [connections, setConnections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  useEffect(() => {
    axios
      .get(`${API}/user/connections`, { withCredentials: true })
      .then((res) => {
        setConnections(res.data.data || []);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching connections:", err);
        setMessage("❌ Failed to fetch connections.");
        setTimeout(() => setMessage(""), 2000);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="text-center mt-20 text-gray-600 text-lg">Loading...</div>
    );
  }

  if (!loading && connections.length === 0) {
    return (
      <div className="text-center mt-20 text-gray-500 text-lg">
        You have no connections yet.
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 p-6 relative">
      {/* Floating message (toast style) */}
      {message && (
        <div className="fixed top-5 left-1/2 transform -translate-x-1/2 bg-green-100 text-green-800 px-4 py-2 rounded-lg shadow-md z-50 transition-all duration-300">
          {message}
        </div>
      )}

      <h2 className="text-3xl font-bold text-center text-gray-800 mb-6">
        Your Connections
      </h2>

      <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
        {connections.map((user) => (
          <div
            key={user._id}
            className="bg-white rounded-2xl shadow-lg p-6 flex flex-col items-center text-center hover:scale-105 transition-transform duration-300"
          >
            <img
              src={user.photoURL}
              alt={user.firstName}
              className="w-24 h-24 rounded-full object-cover border-4 border-indigo-200 mb-4"
            />
            <h3 className="text-xl font-semibold text-gray-800 mb-1">
              {user.firstName} {user.lastName}
            </h3>

            {user.age && (
              <p className="text-sm text-gray-500 mb-1">Age: {user.age}</p>
            )}
            <p className="text-sm text-gray-700 mb-3 italic">{user.about}</p>

            {user.skills.length > 0 && (
              <div className="flex flex-wrap justify-center gap-2 mb-4">
                {user.skills.map((skill, i) => (
                  <span
                    key={i}
                    className="bg-indigo-100 text-indigo-700 text-xs px-3 py-1 rounded-full"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            )}

            {/* Copy Email Button */}
            {user.emailId ? (
              <button
                onClick={() => {
                  navigator.clipboard.writeText(user.emailId);
                  setMessage("📋 Email copied to clipboard!");
                  setTimeout(() => setMessage(""), 500);
                }}
                className="flex items-center gap-2 text-indigo-600 text-sm hover:underline mt-auto"
              >
                <FaEnvelope /> Copy Email
              </button>
            ) : (
              <p className="text-red-500 text-sm mt-2">No email available</p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
