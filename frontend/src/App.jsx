import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import Navbar from "./components/Navbar";
import Auth from "./components/Auth";
import AdminDashboard from "./components/AdminDashboard";
import PendingApproval from "./components/PendingApproval";
import ProfileForm from "./components/ProfileForm";
import { fetchMe } from "./redux/slices/authSlice";

export default function App() {
  const dispatch = useDispatch();
  const { user, loading } = useSelector((state) => state.auth);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      dispatch(fetchMe());
    }
  }, [dispatch]);

  if (loading && !user && localStorage.getItem("token")) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 text-gray-500 font-medium">
        Loading session...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900">
      <Navbar />

      <main>
        {!user ? (
          <Auth />
        ) : user.role === "admin" ? (
          <AdminDashboard />
        ) : user.role === "pending" ? (
          <PendingApproval />
        ) : (
          <ProfileForm />
        )}
      </main>
    </div>
  );
}
