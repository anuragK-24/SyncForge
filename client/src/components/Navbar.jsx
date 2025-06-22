import { Link, useNavigate, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";

export default function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // Check auth state on route change
  useEffect(() => {
    const loggedIn = document.cookie.includes("token=");
    setIsLoggedIn(loggedIn);
  }, [location]);

  const handleLogout = () => {
    document.cookie = "token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    setIsLoggedIn(false);
    navigate("/login");
  };

  return (
    <nav className="bg-white shadow-md px-6 py-4 flex justify-between items-center">
      <h1 className="text-2xl font-bold text-indigo-600">SyncForge</h1>
      <div className="space-x-6 text-sm font-medium">
        {isLoggedIn ? (
          <>
            <Link to="/feed" className="hover:text-indigo-600 text-gray-800">
              Feed
            </Link>
            <Link to="/swipes" className="hover:text-indigo-600 text-gray-800">
              Swipes
            </Link>
            <Link
              to="/requests"
              className="hover:text-indigo-600 text-gray-800"
            >
              Requests
            </Link>
            <Link to="/profile" className="hover:text-indigo-600 text-gray-800">
              Profile
            </Link>
            <button
              onClick={handleLogout}
              className="text-red-500 hover:text-red-700"
            >
              Logout
            </button>
          </>
        ) : (
          <>
            <Link to="/login" className="hover:text-indigo-600 text-gray-800">
              Login
            </Link>
            <Link
              to="/register"
              className="hover:text-indigo-600 text-gray-800"
            >
              Register
            </Link>
          </>
        )}
      </div>
    </nav>
  );
}
