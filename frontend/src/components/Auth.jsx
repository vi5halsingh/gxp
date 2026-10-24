import React, { useState } from "react";
import { api } from "../services/api";

export default function Auth({ onAuthSuccess }) {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError("");
    setMessage("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setMessage("");

    try {
      if (isLogin) {
        const res = await api.login({
          email: formData.email,
          password: formData.password,
        });

        if (res.success) {
          localStorage.setItem("token", res.token);
          onAuthSuccess(res.data);
        } else {
          setError(res.message || "Login failed");
        }
      } else {
        const res = await api.register(formData);

        if (res.success) {
          localStorage.setItem("token", res.token);
          setMessage(res.message);
          onAuthSuccess(res.data);
        } else {
          setError(res.message || "Registration failed");
        }
      }
    } catch (err) {
      setError("Server connection failed. Is backend running?");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md bg-white rounded-xl shadow-lg border border-gray-100 p-8">
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900">
            {isLogin ? "Welcome Back" : "Create an Account"}
          </h2>
          <p className="text-sm text-gray-500 mt-1">
            {isLogin
              ? "Sign in to access your portal"
              : "Register to request role access from Admin"}
          </p>
        </div>

        {/* Tab switch */}
        <div className="flex bg-gray-100 p-1 rounded-lg mb-6">
          <button
            type="button"
            onClick={() => {
              setIsLogin(true);
              setError("");
              setMessage("");
            }}
            className={`flex-1 py-2 text-sm font-semibold rounded-md transition ${
              isLogin
                ? "bg-white text-gray-900 shadow-sm"
                : "text-gray-500 hover:text-gray-800"
            }`}
          >
            Sign In
          </button>
          <button
            type="button"
            onClick={() => {
              setIsLogin(false);
              setError("");
              setMessage("");
            }}
            className={`flex-1 py-2 text-sm font-semibold rounded-md transition ${
              !isLogin
                ? "bg-white text-gray-900 shadow-sm"
                : "text-gray-500 hover:text-gray-800"
            }`}
          >
            Register
          </button>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg">
            {error}
          </div>
        )}

        {message && (
          <div className="mb-4 p-3 bg-green-50 border border-green-200 text-green-700 text-sm rounded-lg">
            {message}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {!isLogin && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Full Name
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="John Doe"
                required
                className="w-full px-3.5 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email Address
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="you@example.com"
              required
              className="w-full px-3.5 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Password
            </label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="••••••••"
              required
              className="w-full px-3.5 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 px-4 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-lg text-sm transition shadow-sm hover:shadow disabled:opacity-50"
          >
            {loading
              ? "Please wait..."
              : isLogin
              ? "Sign In"
              : "Register Account"}
          </button>
        </form>
      </div>
    </div>
  );
}
