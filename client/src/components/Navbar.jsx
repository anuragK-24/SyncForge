import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import axios from "axios";

axios.defaults.withCredentials = true;

export default function Navbar({ isAuth, setIsAuth }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();
  const API = import.meta.env.VITE_API_URL;

  const handleLogout = async () => {
    try {
      await axios.post(`${API}/auth/logout`, {}, { withCredentials: true });
    } catch (err) {
      // Optional: handle error
    } finally {
      setIsAuth(false);
      navigate("/login");
    }
  };

  return (
    <nav className="bg-gray-950 text-white shadow-md px-4 py-3 relative z-50">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-indigo-500 bg-clip-text text-transparent">
          <Link to="/">SyncForge</Link>
        </h1>

        {/* Hamburger Button */}
        <button
          className="sm:hidden text-2xl text-purple-400"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          {menuOpen ? "✖" : "☰"}
        </button>

        {/* Desktop Links */}
        <div className="hidden sm:flex space-x-6 text-sm font-medium items-center">
          {isAuth ? (
            <>
              <Link to="/feed" className="hover:text-purple-400 transition">
                Feed
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

      {/* Mobile Menu Overlay */}
      {menuOpen && (
        <div className="sm:hidden absolute top-full left-0 w-full bg-gray-900 shadow-lg py-4 px-6 space-y-4 text-sm font-medium">
          {isAuth ? (
            <>
              <Link
                to="/feed"
                className="block text-white hover:text-purple-400"
                onClick={() => setMenuOpen(false)}
              >
                Feed
              </Link>
              <Link
                to="/swipes"
                className="block text-white hover:text-purple-400"
                onClick={() => setMenuOpen(false)}
              >
                Swipes
              </Link>
              <Link
                to="/requests"
                className="block text-white hover:text-purple-400"
                onClick={() => setMenuOpen(false)}
              >
                Requests
              </Link>
              <Link
                to="/profile"
                className="block text-white hover:text-purple-400"
                onClick={() => setMenuOpen(false)}
              >
                Profile
              </Link>
              <button
                onClick={() => {
                  setMenuOpen(false);
                  handleLogout();
                }}
                className="block text-left text-red-400 hover:text-red-600"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className="block text-white hover:text-purple-400"
                onClick={() => setMenuOpen(false)}
              >
                Login
              </Link>
              <Link
                to="/register"
                className="block bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-md shadow text-center"
                onClick={() => setMenuOpen(false)}
              >
                Get Started
              </Link>
            </>
          )}
        </div>
      )}
    </nav>
  );
}
