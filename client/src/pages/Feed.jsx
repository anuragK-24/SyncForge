import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  motion,
  AnimatePresence,
  useMotionValue,
  useTransform,
  useAnimationFrame,
} from "framer-motion";

export default function Feed() {
  const API = import.meta.env.VITE_API_URL;
  const [swipeDirection, setSwipeDirection] = useState("right");
  const [profiles, setProfiles] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [message, setMessage] = useState("");
  const [origin, setOrigin] = useState("top left"); // for tilt

  const x = useMotionValue(0);
  const rotate = useTransform(x, [-300, 0, 300], [-15, 0, 15]);

  // Monitor x value to change transformOrigin on the fly
  useEffect(() => {
    const unsubscribe = x.on("change", (latest) => {
      setOrigin(latest > 0 ? "top left" : "bottom left");
    });
    return () => unsubscribe();
  }, [x]);

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
            <motion.div
              key={profiles[currentIndex]._id}
              className="relative w-full h-full sm:w-[350px] sm:h-[90%] sm:rounded-3xl overflow-hidden shadow-xl"
              drag="x"
              dragConstraints={{ left: 0, right: 0 }}
              dragElastic={1}
              style={{
                x,
                rotate,
                transformOrigin: origin,
                backgroundImage: `url(${profiles[currentIndex].photoURL})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
              }}
              onDragEnd={(event, info) => {
                if (info.offset.x > 100) {
                  handleSwipe("right");
                } else if (info.offset.x < -100) {
                  handleSwipe("left");
                }
              }}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{
                opacity: 0,
                scale: 0.95,
                rotate: swipeDirection === "right" ? 15 : -15,
              }}
              transition={{ duration: 0.3 }}
            >
              {/* Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent"></div>

              {/* Content */}
              <div className="absolute bottom-0 w-full p-5 text-white z-10">
                {/* <p className="text-sm text-white/80 mb-1">📍 California, USA</p> */}
                <h2 className="text-3xl font-bold">
                  {profiles[currentIndex].firstName}{" "}
                  {profiles[currentIndex].lastName}
                </h2>
                {profiles[currentIndex].age && (
                  <p className="text-sm mt-1">
                    Age: {profiles[currentIndex].age}
                  </p>
                )}
                <p className="text-sm mt-2 text-white/90">
                  {profiles[currentIndex].about || "No bio provided"}
                </p>

                <div className="flex flex-wrap gap-2 mt-4">
                  {profiles[currentIndex].skills.map((skill, i) => (
                    <span
                      key={i}
                      className="bg-white/20 border border-white/30 text-white px-3 py-1 rounded-full text-xs font-medium backdrop-blur-sm"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
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
