import React, { useEffect, useState } from "react";
import { motion, useMotionValue, useTransform } from "framer-motion";

export default function ProfileCard({ profile, onSwipe, swipeDirection }) {
  if (!profile) return null;

  const x = useMotionValue(0);
  const rotate = useTransform(x, [-300, 0, 300], [-15, 0, 15]);
  const [origin, setOrigin] = useState("top left");

  useEffect(() => {
    const unsubscribe = x.on("change", (latest) => {
      setOrigin(latest > 0 ? "top left" : "bottom left");
    });
    return () => unsubscribe();
  }, [x]);

  const bgImage = profile.photoURL || "/default-avatar.jpg";

  return (
    <motion.div
      className="relative w-full h-[90vh] sm:w-[350px] sm:h-[500px] sm:rounded-3xl overflow-hidden shadow-2xl"
      drag="x"
      dragConstraints={{ left: 0, right: 0 }}
      dragElastic={1}
      style={{
        x,
        rotate,
        transformOrigin: origin,
        backgroundImage: `url(${bgImage})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        borderRadius: "1.5rem",
      }}
      onDragEnd={(event, info) => {
        if (info.offset.x > 100) onSwipe("right");
        else if (info.offset.x < -100) onSwipe("left");
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
      {/* Dark Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent z-0"></div>

      {/* Content */}
      <div className="absolute bottom-0 w-full p-4 text-white z-10 backdrop-blur-sm bg-black/30 rounded-t-2xl">
        <h2 className="text-2xl font-bold">
          {profile.firstName} {profile.lastName}
        </h2>
        {profile.age && <p className="text-sm mt-1">Age: {profile.age}</p>}
        <p className="text-sm mt-2 text-white/90">
          {profile.about || "No bio provided"}
        </p>

        <div className="flex flex-wrap gap-2 mt-4">
          {(profile.skills || []).map((skill, i) => (
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
  );
}
