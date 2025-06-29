import { useEffect, useState } from "react";
import { Routes, Route, Navigate, BrowserRouter } from "react-router-dom";
import axios from "axios";

import ConnectionRequests from "./pages/ConnectionRequests";
import Feed from "./pages/Feed";
import Login from "./pages/Login";
import Profile from "./pages/Profile";
import Register from "./pages/Register";
import Navbar from "./components/Navbar.jsx";
import SwipedProfiles from "./pages/SwipedProfiles.jsx";
import LandingPage from "./pages/LandingPage.jsx";

axios.defaults.withCredentials = true; // Include cookies with requests

function App() {
  const [isAuth, setIsAuth] = useState(false);
  const [loading, setLoading] = useState(true);

  const API = import.meta.env.VITE_API_URL;

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await axios.get(`${API}/auth/status`);
        setIsAuth(res.data.authenticated);
      } catch (err) {
        setIsAuth(false);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  const PrivateRoute = ({ element }) => {
    if (loading) return <div className="text-center mt-20">Loading...</div>;
    return isAuth ? element : <Navigate to="/login" replace />;
  };

  return (
    <BrowserRouter>
      <Navbar isAuth={isAuth} setIsAuth={setIsAuth} />
      <Routes>
        {/* Public route: LandingPage for unauthenticated users */}
        <Route
          path="/"
          element={
            loading ? (
              <div className="text-center mt-20">Loading...</div>
            ) : (
              <LandingPage isAuth={isAuth} />
            )
          }
        />

        {/* Auth routes */}
        <Route
          path="/login"
          element={
            isAuth ? (
              <Navigate to="/feed" replace />
            ) : (
              <Login setIsAuth={setIsAuth} />
            )
          }
        />
        <Route
          path="/register"
          element={isAuth ? <Navigate to="/feed" replace /> : <Register />}
        />

        {/* Protected routes */}
        <Route path="/feed" element={<PrivateRoute element={<Feed />} />} />
        <Route
          path="/swipes"
          element={<PrivateRoute element={<SwipedProfiles />} />}
        />
        <Route
          path="/profile"
          element={<PrivateRoute element={<Profile />} />}
        />
        <Route
          path="/requests"
          element={<PrivateRoute element={<ConnectionRequests />} />}
        />

        {/* 404 fallback */}
        <Route
          path="*"
          element={
            <h1 className="text-center text-2xl mt-20 text-red-500">
              404 - Page Not Found
            </h1>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
