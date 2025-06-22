import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import ConnectionRequests from "./pages/ConnectionRequests";
import Feed from "./pages/Feed";
import Login from "./pages/Login";
import Profile from "./pages/Profile";
import Register from "./pages/Register";
// import Feed from "./pages/Feed"; 
import Navbar from "./components/Navbar.jsx";

// 🔒 Auth check
const isAuthenticated = () => document.cookie.includes("token");

// 🔐 Route wrapper
const PrivateRoute = ({ element }) => {
  return isAuthenticated() ? element : <Navigate to="/login" replace />;
};

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Navigate to="/feed" />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Protected Routes */}
        <Route path="/feed" element={<PrivateRoute element={<Feed />} />} />
        {/* <Route path="/swipe" element={<PrivateRoute element={<SwipeFeed />} />} /> */}
        <Route path="/profile" element={<PrivateRoute element={<Profile />} />} />
        <Route path="/requests" element={<PrivateRoute element={<ConnectionRequests />} />} />

        {/* Fallback */}
        <Route path="*" element={<h1 className="text-center text-2xl mt-20 text-red-500">404 - Page Not Found</h1>} />
      </Routes>
    </Router>
  );
}

export default App;
