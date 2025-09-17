import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import {
  FiHome,
  FiUsers,
  FiHeart,
  FiUser,
  FiLogOut,
  FiLogIn,
  FiLink,
} from "react-icons/fi";
import { FaUserPlus } from "react-icons/fa";
import axios from "axios";

axios.defaults.withCredentials = true;

export default function Navbar({ isAuth, setIsAuth }) {
  const navigate = useNavigate();
  const API = import.meta.env.VITE_API_URL;

  const handleLogout = async () => {
    try {
      await axios.post(`${API}/api/auth/logout`, {}, { withCredentials: true });
    } catch (err) {
      // Optional error handling
    } finally {
      setIsAuth(false);
      navigate("/login");
    }
  };

  return (
    <>
      {/* Top Navbar for Desktop */}
      <nav className="bg-gray-950 text-white shadow-md px-4 py-3 relative z-50 hidden sm:block">
        <div className="flex justify-between items-center flex-wrap">
          <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-indigo-500 bg-clip-text text-transparent">
            <Link to="/">SyncForge</Link>
          </h1>

          <div className="flex space-x-6 text-sm font-medium items-center mt-2 sm:mt-0">
            {isAuth ? (
              <>
                <Link to="/feed" className="hover:text-purple-400 transition">
                  Feed
                </Link>
                <Link to="/connections" className="hover:text-purple-400 transition">
                  Connections
                </Link>
                <Link to="/swipes" className="hover:text-purple-400 transition">
                  Swipes
                </Link>
                <Link to="/requests" className="hover:text-purple-400 transition">
                  Requests
                </Link>
                <Link to="/profile" className="hover:text-purple-400 transition">
                  Profile
                </Link>
                <button
                  onClick={handleLogout}
                  className="text-red-400 hover:text-red-600 transition"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="hover:text-purple-400 transition">
                  Login
                </Link>
                <Link
                  to="/register"
                  className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-1.5 rounded-md shadow transition"
                >
                  Get Started
                </Link>
              </>
            )}
          </div>
        </div>
      </nav>

      {/* Mobile Bottom Navbar */}
      <div className="sm:hidden fixed bottom-0 left-0 right-0 bg-gray-900 border-t border-gray-800 flex justify-around py-2 z-50 text-white">
        {isAuth ? (
          <>
            <Link to="/feed" className="flex flex-col items-center text-xs hover:text-purple-400">
              <FiHome className="text-xl mb-0.5" />
              Feed
            </Link>
            <Link to="/connections" className="flex flex-col items-center text-xs hover:text-purple-400">
              <FiLink className="text-xl mb-0.5" />
              Connections
            </Link>
            <Link to="/swipes" className="flex flex-col items-center text-xs hover:text-purple-400">
              <FiHeart className="text-xl mb-0.5" />
              Swipes
            </Link>
            <Link to="/requests" className="flex flex-col items-center text-xs hover:text-purple-400">
              <FiUsers className="text-xl mb-0.5" />
              Requests
            </Link>
            <Link to="/profile" className="flex flex-col items-center text-xs hover:text-purple-400">
              <FiUser className="text-xl mb-0.5" />
              Profile
            </Link>
            <button
              onClick={handleLogout}
              className="flex flex-col items-center text-xs text-red-400 hover:text-red-600"
            >
              <FiLogOut className="text-xl mb-0.5" />
              Logout
            </button>
          </>
        ) : (
          <>
            <Link to="/login" className="flex flex-col items-center text-xs hover:text-purple-400">
              <FiLogIn className="text-xl mb-0.5" />
              Login
            </Link>
            <Link
              to="/register"
              className="flex flex-col items-center text-xs hover:text-purple-400"
            >
              <FaUserPlus className="text-xl mb-0.5" />
              Register
            </Link>
          </>
        )}
      </div>
    </>
  );
}
