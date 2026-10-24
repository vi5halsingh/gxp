import React, { useState, useEffect } from "react";
import Navbar from "./components/Navbar";
import Auth from "./components/Auth";
import AdminDashboard from "./components/AdminDashboard";
import PendingApproval from "./components/PendingApproval";
import ProfileForm from "./components/ProfileForm";
import { api } from "./services/api";

export default function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Check existing session on mount
  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const res = await api.getMe();
        if (res.success && res.data) {
          setUser(res.data);
        } else {
          localStorage.removeItem("token");
        }
      } catch (err) {
        console.error("Auth check failed:", err);
        localStorage.removeItem("token");
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    setUser(null);
  };

  const handleAuthSuccess = (userData) => {
    setUser(userData);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 text-gray-500 font-medium">
        Loading...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900">
      <Navbar user={user} onLogout={handleLogout} />

      <main>
        {!user ? (
          <Auth onAuthSuccess={handleAuthSuccess} />
        ) : user.role === "admin" ? (
          <AdminDashboard />
        ) : user.role === "pending" ? (
          <PendingApproval
            user={user}
            onRoleUpdated={(updatedUser) => setUser(updatedUser)}
          />
        ) : (
          <ProfileForm user={user} />
        )}
      </main>
    </div>
  );
}
