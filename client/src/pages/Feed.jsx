import React, { useEffect, useState } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";

export default function Feed() {
  const API = import.meta.env.VITE_API_URL;
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

  const sendRequest = async (status, toUserId) => {
    try {
      await axios.post(
        `${API}/request/send/${status}/${toUserId}`,
        {},
        { withCredentials: true }
      );
      setMessage(`Request ${status} sent to ${toUserId}`);
    } catch (error) {
      console.error("Request Error:", error);
      setMessage("❌ Failed to send request.");
    }
  };

  const handleSwipe = (direction) => {
    const user = profiles[currentIndex];
    if (!user) return;

    if (direction === "right") {
      sendRequest("interested", user._id);
    } else if (direction === "left") {
      sendRequest("ignored", user._id);
    }

    setCurrentIndex((prev) => prev + 1);
  };

  return (
    <div className="min-h-screen bg-gradient-to-tr from-indigo-50 to-pink-100 flex items-center justify-center p-6">
      {message && (
        <p className="absolute top-4 text-center text-sm text-indigo-600">
          {message}
        </p>
      )}

      <div className="relative w-full max-w-lg h-[500px]">
        <AnimatePresence>
          {profiles.length > 0 && currentIndex < profiles.length ? (
            <motion.div
              key={profiles[currentIndex]._id}
              className="absolute w-full h-full bg-white rounded-2xl shadow-xl p-6 flex flex-col justify-between"
              drag="x"
              dragConstraints={{ left: 0, right: 0 }}
              dragElastic={1}
              onDragEnd={(event, info) => {
                if (info.offset.x > 100) {
                  handleSwipe("right");
                } else if (info.offset.x < -100) {
                  handleSwipe("left");
                }
              }}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.3 }}
            >
              <img
                src={profiles[currentIndex].photoURL}
                alt="User"
                className="w-full h-56 object-cover rounded-xl"
              />
              <div>
                <h2 className="text-2xl font-bold text-indigo-700">
                  {profiles[currentIndex].firstName}{" "}
                  {profiles[currentIndex].lastName},{" "}
                  {profiles[currentIndex].age}
                </h2>
                <p className="text-sm text-gray-600 mt-1">
                  {profiles[currentIndex].emailId}
                </p>
                <p className="text-gray-700 text-sm mt-2">
                  {profiles[currentIndex].about}
                </p>
                <div className="flex flex-wrap gap-2 mt-4">
                  {profiles[currentIndex].skills.map((skill, i) => (
                    <span
                      key={i}
                      className="bg-indigo-100 text-indigo-700 px-3 py-1 rounded-full text-xs font-medium"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
              <div className="flex justify-between px-4 mt-4">
                <span className="text-sm text-gray-500">
                  ⬅️ Swipe Left to Ignore
                </span>
                <span className="text-sm text-gray-500">
                  Swipe Right to Connect ➡️
                </span>
              </div>
            </motion.div>
          ) : (
            <div className="text-center mt-20 text-gray-500">
              🎉 No more profiles to show.
            </div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
