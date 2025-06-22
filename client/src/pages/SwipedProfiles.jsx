import React, { useEffect, useState } from "react";
import axios from "axios";

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
    <div className="min-h-screen bg-gradient-to-r from-purple-100 to-pink-100 py-10 px-4">
      <div className="max-w-5xl mx-auto">
        <h2 className="text-4xl font-bold text-center text-purple-700 mb-8">
          Profiles You Swiped 👉
        </h2>

        {message && (
          <p className="text-center text-sm text-red-500">{message}</p>
        )}

        {loading ? (
          <p className="text-center text-gray-600">Loading...</p>
        ) : profiles.length === 0 ? (
          <p className="text-center text-gray-600">
            You haven't swiped anyone yet!
          </p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {profiles.map((user) => (
              <div
                key={user._id}
                className="bg-white p-6 rounded-2xl shadow-lg border hover:shadow-2xl transition"
              >
                <img
                  src={user.photoURL || "/default-avatar.png"}
                  alt={user.firstName}
                  className="w-24 h-24 rounded-full object-cover mx-auto mb-4 border"
                />
                <h3 className="text-xl font-semibold text-center text-purple-800">
                  {user.firstName} {user.lastName}
                </h3>
                <p className="text-sm text-center text-gray-500">
                  {user.gender}
                </p>
                <p className="mt-2 text-sm text-center text-gray-600">
                  {user.about}
                </p>
                <div className="flex flex-wrap justify-center gap-2 mt-3">
                  {(user.skills || []).map((skill, i) => (
                    <span
                      key={i}
                      className="bg-purple-200 text-purple-800 px-3 py-1 rounded-full text-xs"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
