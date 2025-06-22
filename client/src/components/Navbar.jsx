import { Link, useNavigate, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";

export default function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const loggedIn = document.cookie.includes("token=");
    setIsLoggedIn(loggedIn);
    setMenuOpen(false); // auto-close on route change
  }, [location]);

  const handleLogout = () => {
    document.cookie =
      "token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    setIsLoggedIn(false);
    navigate("/login");
  };

  return (
    <nav className="bg-white shadow-md px-4 py-3 relative z-50">
      <div className="flex justify-between items-center">
        <h1 className="text-xl sm:text-2xl font-bold text-indigo-600">
          SyncForge
        </h1>

        {/* Hamburger Button */}
        <button
          className="sm:hidden text-2xl text-indigo-600"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          {menuOpen ? "✖" : "☰"}
        </button>

        {/* Desktop Links */}
        <div className="hidden sm:flex space-x-6 text-sm font-medium">
          {isLoggedIn ? (
            <>
              <Link to="/feed" className="hover:text-indigo-600 text-gray-800">Feed</Link>
              <Link to="/swipes" className="hover:text-indigo-600 text-gray-800">Swipes</Link>
              <Link to="/requests" className="hover:text-indigo-600 text-gray-800">Requests</Link>
              <Link to="/profile" className="hover:text-indigo-600 text-gray-800">Profile</Link>
              <button onClick={handleLogout} className="text-red-500 hover:text-red-700">Logout</button>
            </>
          ) : (
            <>
              <Link to="/login" className="hover:text-indigo-600 text-gray-800">Login</Link>
              <Link to="/register" className="hover:text-indigo-600 text-gray-800">Register</Link>
            </>
          )}
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      {menuOpen && (
        <div className="sm:hidden absolute top-full left-0 w-full bg-white shadow-md py-4 px-6 space-y-4 text-sm font-medium">
          {isLoggedIn ? (
            <>
              <Link to="/feed" className="block text-gray-800" onClick={() => setMenuOpen(false)}>Feed</Link>
              <Link to="/swipes" className="block text-gray-800" onClick={() => setMenuOpen(false)}>Swipes</Link>
              <Link to="/requests" className="block text-gray-800" onClick={() => setMenuOpen(false)}>Requests</Link>
              <Link to="/profile" className="block text-gray-800" onClick={() => setMenuOpen(false)}>Profile</Link>
              <button onClick={handleLogout} className="block text-left text-red-500 hover:text-red-700">Logout</button>
            </>
          ) : (
            <>
              <Link to="/login" className="block text-gray-800" onClick={() => setMenuOpen(false)}>Login</Link>
              <Link to="/register" className="block text-gray-800" onClick={() => setMenuOpen(false)}>Register</Link>
            </>
          )}
        </div>
      )}
    </nav>
  );
}
