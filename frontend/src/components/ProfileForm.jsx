import React, { useState, useEffect } from "react";
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

  // Track real-time permission warnings per field ID
  const [permissionWarnings, setPermissionWarnings] = useState({});

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

  const handleInputChange = (field, value) => {
    const isAllowed = field.role === user?.role;
    if (!isAllowed) {
      setPermissionWarnings((prev) => ({ ...prev, [field._id]: true }));
      return;
    }
    dispatch(setFormField({ name: field.name, value }));
  };

  const handleFieldInteraction = (field) => {
    const isAllowed = field.role === user?.role;
    if (!isAllowed) {
      setPermissionWarnings((prev) => ({ ...prev, [field._id]: true }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(saveMyProfile(formData));
  };

  if (loading) {
    return (
      <div className="max-w-2xl mx-auto py-16 text-center text-gray-400">
        Loading profile details...
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-10">
      <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-8">
        {/* Header - Neutral, no roles shown */}
        <div className="border-b border-gray-100 pb-5 mb-6">
          <h2 className="text-xl font-bold text-gray-900">
            Profile Details
          </h2>
          <p className="text-sm text-gray-500 mt-1">
            Please fill out the form fields below to complete your profile.
          </p>
        </div>

        {/* Success / Error Messages */}
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
            <p className="font-medium text-gray-700">No profile fields defined</p>
            <p className="text-sm text-gray-400 mt-1">
              There are currently no fields available to fill.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-5">
            {fields.map((field) => {
              const isAllowed = field.role === user?.role;
              const hasWarning = !!permissionWarnings[field._id];

              return (
                <div key={field._id} className="space-y-1">
                  <label className="block text-sm font-medium text-gray-700">
                    {field.label}
                    {isAllowed && field.required && (
                      <span className="text-red-500 ml-1">*</span>
                    )}
                  </label>

                  {field.type === "textarea" ? (
                    <textarea
                      rows={3}
                      value={formData[field.name] || ""}
                      onChange={(e) =>
                        handleInputChange(field, e.target.value)
                      }
                      onFocus={() => handleFieldInteraction(field)}
                      onClick={() => handleFieldInteraction(field)}
                      onKeyDown={(e) => {
                        if (!isAllowed && e.key !== "Tab") {
                          e.preventDefault();
                          handleFieldInteraction(field);
                        }
                      }}
                      readOnly={!isAllowed}
                      required={isAllowed && field.required}
                      placeholder={`Enter ${field.label.toLowerCase()}`}
                      className={`w-full px-3.5 py-2 border rounded-lg text-sm transition ${
                        hasWarning
                          ? "border-red-400 bg-red-50/20 text-gray-700 focus:outline-none focus:ring-2 focus:ring-red-200"
                          : "border-gray-300 bg-white text-gray-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      }`}
                    />
                  ) : (
                    <input
                      type={field.type || "text"}
                      value={formData[field.name] || ""}
                      onChange={(e) =>
                        handleInputChange(field, e.target.value)
                      }
                      onFocus={() => handleFieldInteraction(field)}
                      onClick={() => handleFieldInteraction(field)}
                      onKeyDown={(e) => {
                        if (!isAllowed && e.key !== "Tab") {
                          e.preventDefault();
                          handleFieldInteraction(field);
                        }
                      }}
                      readOnly={!isAllowed}
                      required={isAllowed && field.required}
                      placeholder={`Enter ${field.label.toLowerCase()}`}
                      className={`w-full px-3.5 py-2 border rounded-lg text-sm transition ${
                        hasWarning
                          ? "border-red-400 bg-red-50/20 text-gray-700 focus:outline-none focus:ring-2 focus:ring-red-200"
                          : "border-gray-300 bg-white text-gray-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      }`}
                    />
                  )}

                  {/* Real-time permission warning message */}
                  {hasWarning && (
                    <div className="flex items-center gap-1.5 mt-1 text-xs text-red-600 font-medium">
                      <svg
                        className="w-4 h-4 shrink-0 text-red-500"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                          clipRule="evenodd"
                        />
                      </svg>
                      <span>You do not have permission to edit this field.</span>
                    </div>
                  )}
                </div>
              );
            })}

            {/* Submit button */}
            <div className="pt-4 border-t border-gray-100 flex justify-end">
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
