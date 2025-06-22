import React, { useEffect, useState } from "react";
import axios from "axios";

export default function ConnectionRequests() {
  const API = import.meta.env.VITE_API_URL;
  const [requests, setRequests] = useState([]);
  const [message, setMessage] = useState("");

  const fetchRequests = async () => {
    try {
      const res = await axios.get(`${API}/user/pendingRequest`, {
        withCredentials: true,
      });
      setRequests(res.data.data);
    } catch (err) {
      console.error("Error fetching pending requests:", err);
      setMessage("Failed to load pending requests.");
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  const handleReview = async (status, requestedId) => {
    try {
      await axios.post(
        `${API}/request/review/${status}/${requestedId}`,
        {},
        { withCredentials: true }
      );
      setMessage(`Request ${status}`);
      setRequests((prev) => prev.filter((user) => user._id !== requestedId));
    } catch (error) {
      console.error("Error reviewing request:", error);
      setMessage("Something went wrong.");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 via-orange-100 to-pink-100 py-12 px-4">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-4xl font-extrabold text-center text-orange-700 mb-10 drop-shadow-md">
          🔔 Pending Connection Requests
        </h2>

        {message && (
          <p className="text-center text-md font-medium text-rose-600 mb-6">{message}</p>
        )}

        {requests.length === 0 ? (
          <div className="text-center text-gray-600 text-lg py-20">
            🎉 You have no pending requests at the moment.
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {requests.map((user) => (
              <div
                key={user._id}
                className="bg-white/60 backdrop-blur-xl p-6 rounded-3xl border border-orange-200 shadow-xl hover:shadow-2xl transition duration-300 transform hover:-translate-y-1"
              >
                <div className="flex items-center gap-4">
                  <img
                    src={user.photoURL || "/default-avatar.png"}
                    alt={user.firstName}
                    className="w-20 h-20 rounded-full object-cover border-2 border-orange-300 shadow-sm"
                  />
                  <div>
                    <h3 className="text-xl font-semibold text-orange-700">
                      {user.firstName} {user.lastName}
                    </h3>
                    <p className="text-sm text-gray-500">{user.gender}</p>
                  </div>
                </div>

                <p className="mt-4 text-gray-700 text-sm line-clamp-3">
                  {user.about || "No bio provided."}
                </p>

                <div className="flex flex-wrap gap-2 mt-4">
                  {(user.skills || []).map((skill, i) => (
                    <span
                      key={i}
                      className="bg-orange-100 text-orange-800 px-3 py-1 rounded-full text-xs font-medium"
                    >
                      {skill}
                    </span>
                  ))}
                </div>

                <div className="mt-6 flex gap-4">
                  <button
                    onClick={() => handleReview("accepted", user._id)}
                    className="flex-1 bg-gradient-to-r from-green-400 to-green-600 text-white py-2 rounded-full font-semibold hover:scale-105 transition"
                  >
                    Accept
                  </button>
                  <button
                    onClick={() => handleReview("rejected", user._id)}
                    className="flex-1 bg-gradient-to-r from-rose-400 to-red-500 text-white py-2 rounded-full font-semibold hover:scale-105 transition"
                  >
                    Reject
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
