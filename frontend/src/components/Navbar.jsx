import React from "react";

export default function Navbar({ user, onLogout }) {
  const getRoleBadge = (role) => {
    switch (role) {
      case "admin":
        return "bg-purple-100 text-purple-800 border border-purple-300";
      case "seller":
        return "bg-blue-100 text-blue-800 border border-blue-300";
      case "user":
        return "bg-green-100 text-green-800 border border-green-300";
      default:
        return "bg-amber-100 text-amber-800 border border-amber-300";
    }
  };

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="text-xl font-bold text-gray-900 tracking-tight">
            Vidya<span className="text-indigo-600">GXP</span>
          </span>
          <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full font-medium">
            Role Portal
          </span>
        </div>

        {user && (
          <div className="flex items-center gap-4">
            <div className="text-right hidden sm:block">
              <p className="text-sm font-semibold text-gray-800 leading-tight">
                {user.name}
              </p>
              <p className="text-xs text-gray-500">{user.email}</p>
            </div>

            <span
              className={`text-xs px-2.5 py-1 rounded-full font-semibold uppercase tracking-wider ${getRoleBadge(
                user.role
              )}`}
            >
              {user.role}
            </span>

            <button
              onClick={onLogout}
              className="text-sm px-3.5 py-1.5 rounded-md font-medium text-gray-700 hover:text-red-600 hover:bg-red-50 border border-gray-300 hover:border-red-200 transition"
            >
              Logout
            </button>
          </div>
        )}
      </div>
    </header>
  );
}
