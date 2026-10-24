import React, { useState } from "react";
import { api } from "../services/api";

export default function PendingApproval({ user, onRoleUpdated }) {
  const [checking, setChecking] = useState(false);
  const [info, setInfo] = useState("");

  const handleRefresh = async () => {
    setChecking(true);
    setInfo("");
    try {
      const res = await api.getMe();
      if (res.success && res.data) {
        if (res.data.role !== "pending") {
          onRoleUpdated(res.data);
        } else {
          setInfo("Role is still pending assignment by Admin.");
        }
      }
    } catch (err) {
      setInfo("Could not refresh status. Please try again.");
    } finally {
      setChecking(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto mt-16 px-4">
      <div className="bg-white border border-amber-200 rounded-2xl p-8 shadow-sm text-center">
        <div className="w-16 h-16 bg-amber-50 text-amber-500 rounded-full flex items-center justify-center mx-auto mb-4 border border-amber-100">
          <svg
            className="w-8 h-8"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        </div>

        <h3 className="text-xl font-bold text-gray-900 mb-2">
          Role Assignment Pending
        </h3>
        <p className="text-gray-600 text-sm leading-relaxed mb-6">
          Hello <span className="font-semibold text-gray-900">{user.name}</span>,
          your registration was successful! An Admin will review your account
          and assign you either the <span className="font-medium text-indigo-600">User</span> or{" "}
          <span className="font-medium text-indigo-600">Seller</span> role.
          Once assigned, you will be able to complete your profile form.
        </p>

        {info && (
          <p className="text-xs text-amber-700 bg-amber-50 border border-amber-200 py-2 px-3 rounded-lg mb-4">
            {info}
          </p>
        )}

        <button
          onClick={handleRefresh}
          disabled={checking}
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-amber-500 hover:bg-amber-600 text-white text-sm font-semibold rounded-lg shadow-sm transition disabled:opacity-50"
        >
          {checking ? "Checking..." : "Refresh Status"}
        </button>
      </div>
    </div>
  );
}
