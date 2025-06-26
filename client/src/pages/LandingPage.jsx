import { Link } from "react-router-dom";
import { motion } from "framer-motion";
// import Lottie from "lottie-react";
// import aboutAnimation from "../assets/swipe.json";

export default function LandingPage({ isAuth }) {
  return (
    <div className="min-h-screen bg-gray-950 text-white flex flex-col">
      {/* Navbar */}
      <div className="h-16" />

      {/* Hero */}
      <main className="flex-grow flex flex-col items-center justify-center text-center px-4">
        <motion.h2
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-4xl md:text-6xl font-extrabold mb-6 bg-gradient-to-r from-purple-400 to-indigo-500 bg-clip-text text-transparent"
        >
          Discover. Connect. Collaborate.
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.6 }}
          className="text-gray-300 max-w-2xl text-lg md:text-xl mb-8"
        >
          SyncForge matches you with like-minded developers to build cool things
          together.
        </motion.p>
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.4, duration: 0.4 }}
        >
          {isAuth ? (
            <Link
              to="/feed"
              className="bg-white text-purple-700 hover:bg-gray-100 font-bold px-6 py-3 rounded-xl shadow-lg transition"
            >
              Go to Feed
            </Link>
          ) : (
            <Link
              to="/register"
              className="bg-white text-purple-700 hover:bg-gray-100 font-bold px-6 py-3 rounded-xl shadow-lg transition"
            >
              Join the Community
            </Link>
          )}
        </motion.div>
      </main>

      {/* <Lottie
        animationData={aboutAnimation}
      /> */}
      {/* Footer */}
      <footer className="text-center py-4 text-sm text-gray-500 border-t border-gray-800">
        &copy; {new Date().getFullYear()} SyncForge. Built for Devs.
      </footer>
    </div>
  );
}
