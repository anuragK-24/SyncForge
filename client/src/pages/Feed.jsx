// Feed.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import ProfileCard from "../components/ProfileCard";

export default function Feed() {
  const API = import.meta.env.VITE_API_URL;
  const [swipeDirection, setSwipeDirection] = useState("right");
  const [profiles, setProfiles] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [message, setMessage] = useState("");

  useEffect(() => {
    axios
      .get(`${API}/user/feed`, { withCredentials: true })
      .then((res) => {
        setProfiles(res.data.feed || []);
      })
      .catch((err) => {
        console.error("Error fetching users:", err);
        setMessage("Failed to load users.");
      });
  }, []);

  const handleSkip = () => {
    const user = profiles[currentIndex];
    if (user) {
      setMessage(`⏭️ You skipped ${user.firstName}`);
    }
    setSwipeDirection("right"); // Optional
    setCurrentIndex((prev) => prev + 1);
  };

  const sendRequest = async (status, toUserId, toUserName) => {
    try {
      await axios.post(
        `${API}/request/send/${status}/${toUserId}`,
        {},
        { withCredentials: true }
      );
      setMessage(`✅ Request "${status}" sent to ${toUserName}`);
    } catch (error) {
      console.error("Request Error:", error);
      setMessage("❌ Failed to send request.");
    }
  };

  const handleSwipe = (direction) => {
    const user = profiles[currentIndex];
    if (!user) return;

    if (direction === "right") {
      setSwipeDirection("right");
      sendRequest("interested", user._id, user.firstName);
    } else if (direction === "left") {
      setSwipeDirection("left");
      sendRequest("ignored", user._id, user.firstName);
      setMessage(`❌ You ignored ${user.firstName}`);
    }

    setCurrentIndex((prev) => prev + 1);
  };

  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => setMessage(""), 2000);
      return () => clearTimeout(timer);
    }
  }, [message]);

  return (
    <div className="h-[93vh] w-screen bg-black sm:bg-gradient-to-tr sm:from-indigo-50 sm:to-pink-100 relative overflow-hidden">
      <div className="absolute inset-0 flex items-center justify-center">
        {message && (
          <motion.div
            className={`z-50 absolute top-6 left-1/2 -translate-x-1/2 flex items-center gap-3 px-5 py-3 rounded-lg shadow-xl text-sm font-semibold text-white
  ${
    message.includes("ignored") || message.startsWith("❌")
      ? "bg-gradient-to-r from-red-500 to-rose-600"
      : message.includes("skipped") || message.startsWith("⏭️")
      ? "bg-gradient-to-r from-gray-500 to-gray-700"
      : "bg-gradient-to-r from-green-500 to-emerald-600"
  }`}
            initial={{ opacity: 0, y: -30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -30 }}
            transition={{ duration: 0.4 }}
          >
            <span className="text-xl">
              {message.includes("ignored") || message.startsWith("❌")
                ? "❌"
                : "✅"}
            </span>
            <p>{message.replace(/^✅ |^❌ /, "")}</p>
          </motion.div>
        )}

        <AnimatePresence>
          {profiles.length > 0 && currentIndex < profiles.length ? (
            <ProfileCard
              key={profiles[currentIndex]._id}
              profile={profiles[currentIndex]}
              onSwipe={handleSwipe}
              swipeDirection={swipeDirection}
            />
          ) : (
            <div className="text-center mt-20 text-gray-500">
              🎉 No more profiles to show.
            </div>
          )}
        </AnimatePresence>

        {/* Skip Button */}
        {currentIndex < profiles.length && (
          <button
            onClick={handleSkip}
            className="absolute bottom-8 left-1/2 -translate-x-1/2 px-5 py-2 bg-white text-black rounded-full font-semibold shadow-md hover:bg-gray-200 transition z-50"
          >
            Skip
          </button>
        )}
      </div>
    </div>
  );
}
