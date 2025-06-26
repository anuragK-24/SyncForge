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
      .then((res) => setProfiles(res.data.feed || []))
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
    setSwipeDirection("right");
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
    <div className="min-h-[95vh] w-full bg-gray-950 text-white relative overflow-hidden flex items-center justify-center px-4">
      {/* Notification Banner */}
      <AnimatePresence>
        {message && (
          <motion.div
            key={message}
            className={`fixed top-6 left-1/2 -translate-x-1/2 z-50 flex items-center gap-3 px-5 py-3 rounded-lg shadow-xl text-sm font-semibold text-white
              ${
                message.includes("ignored") || message.startsWith("❌")
                  ? "bg-gradient-to-r from-red-500 to-rose-600"
                  : message.includes("skipped") || message.startsWith("⏭️")
                  ? "bg-gradient-to-r from-gray-600 to-gray-800"
                  : "bg-gradient-to-r from-green-500 to-emerald-600"
              }`}
            initial={{ opacity: 0, y: -30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -30 }}
            transition={{ duration: 0.4 }}
          >
            <span className="text-xl">
              {message.startsWith("❌")
                ? "❌"
                : message.startsWith("⏭️")
                ? "⏭️"
                : "✅"}
            </span>
            <p>{message.replace(/^✅ |^❌ |^⏭️ /, "")}</p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Profile Card Area */}
      <div className="w-full max-w-xl mx-auto flex flex-col items-center justify-center gap-6">
        <div className="w-full max-w-xl mx-auto relative flex items-center justify-center">
          <AnimatePresence>
            {profiles.length > 0 && currentIndex < profiles.length ? (
              <ProfileCard
                key={profiles[currentIndex]._id}
                profile={profiles[currentIndex]}
                onSwipe={handleSwipe}
                swipeDirection={swipeDirection}
              />
            ) : (
              <motion.div
                initial={{ opacity: 0.5 }}
                animate={{ opacity: 1 }}
                className="text-center mt-20 text-gray-400"
              >
                🎉 No more profiles to show.
              </motion.div>
            )}
          </AnimatePresence>

          {/* Skip Button Overlay */}
          {currentIndex < profiles.length && (
            <motion.button
              onClick={handleSkip}
              whileTap={{ scale: 0.95 }}
              className="absolute bottom-45 left-1/2 -translate-x-1/2 bg-white text-purple-700 px-6 py-2 rounded-full font-semibold shadow-lg hover:bg-gray-100 transition z-50"
            >
              Skip
            </motion.button>
          )}
        </div>
      </div>
    </div>
  );
}
