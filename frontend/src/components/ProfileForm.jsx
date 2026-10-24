import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  fetchRoleFields,
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
    if (user?.role) {
      dispatch(fetchRoleFields(user.role));
      dispatch(fetchMyProfile());
    }
  }, [user?.role, dispatch]);

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
      <div className="max-w-2xl mx-auto py-16 text-center text-gray-400">
        Loading profile form...
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-10">
      <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-8">
        <div className="border-b border-gray-100 pb-5 mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-gray-900">
                Complete Your {user?.role === "seller" ? "Seller" : "User"} Profile
              </h2>
              <p className="text-sm text-gray-500 mt-1">
                Please fill in the fields enabled by the Admin for your role.
              </p>
            </div>
            <span
              className={`text-xs px-3 py-1 rounded-full font-bold uppercase tracking-wider ${
                user?.role === "seller"
                  ? "bg-blue-100 text-blue-700"
                  : "bg-green-100 text-green-700"
              }`}
            >
              {user?.role}
            </span>
          </div>
        </div>

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
              Admin has not added any form fields for the "{user?.role}" role yet.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-5">
            {fields.map((field) => (
              <div key={field._id}>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {field.label}
                  {field.required && <span className="text-red-500 ml-1">*</span>}
                </label>

                {field.type === "textarea" ? (
                  <textarea
                    rows={3}
                    value={formData[field.name] || ""}
                    onChange={(e) =>
                      handleInputChange(field.name, e.target.value)
                    }
                    required={field.required}
                    placeholder={`Enter ${field.label.toLowerCase()}`}
                    className="w-full px-3.5 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                ) : (
                  <input
                    type={field.type || "text"}
                    value={formData[field.name] || ""}
                    onChange={(e) =>
                      handleInputChange(field.name, e.target.value)
                    }
                    required={field.required}
                    placeholder={`Enter ${field.label.toLowerCase()}`}
                    className="w-full px-3.5 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                )}
              </div>
            ))}

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
