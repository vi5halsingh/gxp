import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  fetchAllFields,
  fetchMyProfile,
  saveMyProfile,
  setFormField,
  clearProfileMessage,
} from "../redux/slices/profileSlice";

export default function ProfileForm() {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { fields, formData, loading, saving, error, successMessage } =
    useSelector((state) => state.profile);

  useEffect(() => {
    dispatch(fetchAllFields());
    dispatch(fetchMyProfile());
  }, [dispatch]);

  useEffect(() => {
    if (successMessage || error) {
      const timer = setTimeout(() => {
        dispatch(clearProfileMessage());
      }, 3500);
      return () => clearTimeout(timer);
    }
  }, [successMessage, error, dispatch]);

  const handleInputChange = (fieldName, value) => {
    dispatch(setFormField({ name: fieldName, value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(saveMyProfile(formData));
  };

  if (loading) {
    return (
      <div className="max-w-3xl mx-auto py-16 text-center text-gray-400">
        Loading profile form...
      </div>
    );
  }

  const userRole = user?.role; // "user" or "seller"
  const userFields = fields.filter((f) => f.role === "user");
  const sellerFields = fields.filter((f) => f.role === "seller");

  const renderField = (field, isAllowed) => {
    return (
      <div
        key={field._id}
        className={`p-4 rounded-lg border transition ${
          isAllowed
            ? "bg-white border-gray-200"
            : "bg-gray-50/80 border-gray-200/70"
        }`}
      >
        <div className="flex items-center justify-between mb-1.5">
          <label
            className={`text-sm font-medium ${
              isAllowed ? "text-gray-800" : "text-gray-500"
            }`}
          >
            {field.label}
            {isAllowed && field.required && (
              <span className="text-red-500 ml-1 font-semibold">*</span>
            )}
          </label>

          <span
            className={`text-[11px] px-2 py-0.5 rounded-full font-medium ${
              isAllowed
                ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                : "bg-gray-100 text-gray-400 border border-gray-200"
            }`}
          >
            {isAllowed ? "Editable by you" : `Locked (${field.role} only)`}
          </span>
        </div>

        {field.type === "textarea" ? (
          <textarea
            rows={3}
            value={formData[field.name] || ""}
            onChange={(e) =>
              isAllowed && handleInputChange(field.name, e.target.value)
            }
            disabled={!isAllowed}
            required={isAllowed && field.required}
            placeholder={
              isAllowed
                ? `Enter ${field.label.toLowerCase()}`
                : `Not editable by ${userRole} role`
            }
            className={`w-full px-3.5 py-2 rounded-lg text-sm transition ${
              isAllowed
                ? "bg-white border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                : "bg-gray-100 border border-gray-200 text-gray-400 cursor-not-allowed select-none"
            }`}
          />
        ) : (
          <input
            type={field.type || "text"}
            value={formData[field.name] || ""}
            onChange={(e) =>
              isAllowed && handleInputChange(field.name, e.target.value)
            }
            disabled={!isAllowed}
            required={isAllowed && field.required}
            placeholder={
              isAllowed
                ? `Enter ${field.label.toLowerCase()}`
                : `Not editable by ${userRole} role`
            }
            className={`w-full px-3.5 py-2 rounded-lg text-sm transition ${
              isAllowed
                ? "bg-white border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                : "bg-gray-100 border border-gray-200 text-gray-400 cursor-not-allowed select-none"
            }`}
          />
        )}

        {!isAllowed && (
          <p className="text-[11px] text-gray-400 mt-1 italic">
            This field is restricted to {field.role} accounts.
          </p>
        )}
      </div>
    );
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-10">
      <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-8">
        {/* Header */}
        <div className="border-b border-gray-100 pb-5 mb-6">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <div>
              <h2 className="text-xl font-bold text-gray-900">
                Complete Your Profile
              </h2>
              <p className="text-sm text-gray-500 mt-1">
                All profile fields are visible below. You can only edit fields
                assigned to your role (
                <span className="font-semibold capitalize text-gray-700">
                  {userRole}
                </span>
                ).
              </p>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs text-gray-500">Your Role:</span>
              <span
                className={`text-xs px-3 py-1 rounded-full font-bold uppercase tracking-wider ${
                  userRole === "seller"
                    ? "bg-blue-100 text-blue-700"
                    : "bg-green-100 text-green-700"
                }`}
              >
                {userRole}
              </span>
            </div>
          </div>
        </div>

        {/* Notifications */}
        {successMessage && (
          <div className="mb-6 p-4 rounded-lg text-sm font-medium border bg-green-50 text-green-800 border-green-200">
            {successMessage}
          </div>
        )}

        {error && (
          <div className="mb-6 p-4 rounded-lg text-sm font-medium border bg-red-50 text-red-800 border-red-200">
            {error}
          </div>
        )}

        {fields.length === 0 ? (
          <div className="py-12 text-center text-gray-500">
            <p className="font-medium text-gray-700">No profile fields defined yet</p>
            <p className="text-sm text-gray-400 mt-1">
              Admin has not added any form fields yet.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* User role section */}
            <div className="space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-gray-100">
                <div className="flex items-center gap-2">
                  <span
                    className={`w-2.5 h-2.5 rounded-full ${
                      userRole === "user" ? "bg-green-500" : "bg-gray-400"
                    }`}
                  ></span>
                  <h3 className="text-sm font-semibold text-gray-800 uppercase tracking-wide">
                    User Role Fields ({userFields.length})
                  </h3>
                </div>
                <span className="text-xs text-gray-400">
                  {userRole === "user" ? "✓ Allowed for your role" : "🔒 Read-only"}
                </span>
              </div>

              {userFields.length === 0 ? (
                <p className="text-xs text-gray-400 italic py-2">
                  No fields configured for User role.
                </p>
              ) : (
                <div className="grid grid-cols-1 gap-4">
                  {userFields.map((field) =>
                    renderField(field, userRole === "user")
                  )}
                </div>
              )}
            </div>

            {/* Seller role section */}
            <div className="space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-gray-100">
                <div className="flex items-center gap-2">
                  <span
                    className={`w-2.5 h-2.5 rounded-full ${
                      userRole === "seller" ? "bg-blue-500" : "bg-gray-400"
                    }`}
                  ></span>
                  <h3 className="text-sm font-semibold text-gray-800 uppercase tracking-wide">
                    Seller Role Fields ({sellerFields.length})
                  </h3>
                </div>
                <span className="text-xs text-gray-400">
                  {userRole === "seller" ? "✓ Allowed for your role" : "🔒 Read-only"}
                </span>
              </div>

              {sellerFields.length === 0 ? (
                <p className="text-xs text-gray-400 italic py-2">
                  No fields configured for Seller role.
                </p>
              ) : (
                <div className="grid grid-cols-1 gap-4">
                  {sellerFields.map((field) =>
                    renderField(field, userRole === "seller")
                  )}
                </div>
              )}
            </div>

            {/* Submit Button */}
            <div className="pt-4 border-t border-gray-100 flex items-center justify-between">
              <span className="text-xs text-gray-400">
                Submitting will only save values for your assigned (
                <span className="font-semibold text-gray-600">{userRole}</span>)
                fields.
              </span>
              <button
                type="submit"
                disabled={saving}
                className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-medium text-sm rounded-lg transition shadow-sm hover:shadow disabled:opacity-50"
              >
                {saving ? "Saving..." : "Save Profile"}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
