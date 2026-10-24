import React, { useState, useEffect } from "react";
import { api } from "../services/api";

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState("users"); // "users" | "fields"
  const [users, setUsers] = useState([]);
  const [fields, setFields] = useState([]);
  const [loading, setLoading] = useState(false);
  const [notification, setNotification] = useState({ type: "", text: "" });

  // New field state
  const [newField, setNewField] = useState({
    label: "",
    role: "user",
    type: "text",
    required: true,
  });

  const showNotification = (type, text) => {
    setNotification({ type, text });
    setTimeout(() => setNotification({ type: "", text: "" }), 3500);
  };

  const loadData = async () => {
    setLoading(true);
    try {
      const [usersRes, fieldsRes] = await Promise.all([
        api.getAllUsers(),
        api.getAllInputs(),
      ]);

      if (usersRes.success) setUsers(usersRes.data);
      if (fieldsRes.success) setFields(fieldsRes.data);
    } catch (err) {
      showNotification("error", "Failed to load dashboard data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleAssignRole = async (userId, role) => {
    try {
      const res = await api.assignRole(userId, role);
      if (res.success) {
        showNotification("success", `Role '${role}' assigned successfully!`);
        setUsers((prev) =>
          prev.map((u) => (u._id === userId ? { ...u, role: role } : u))
        );
      } else {
        showNotification("error", res.message || "Failed to assign role");
      }
    } catch (err) {
      showNotification("error", "Error assigning role");
    }
  };

  const handleAddField = async (e) => {
    e.preventDefault();
    if (!newField.label.trim()) return;

    try {
      const res = await api.createInput(newField);
      if (res.success) {
        showNotification("success", "Input field created successfully!");
        setFields((prev) => [...prev, res.data]);
        setNewField({
          label: "",
          role: newField.role,
          type: "text",
          required: true,
        });
      } else {
        showNotification("error", res.message || "Failed to add field");
      }
    } catch (err) {
      showNotification("error", "Error creating input field");
    }
  };

  const handleDeleteField = async (id) => {
    if (!window.confirm("Are you sure you want to delete this field?")) return;
    try {
      const res = await api.deleteInput(id);
      if (res.success) {
        showNotification("success", "Input field deleted");
        setFields((prev) => prev.filter((f) => f._id !== id));
      } else {
        showNotification("error", res.message || "Failed to delete field");
      }
    } catch (err) {
      showNotification("error", "Error deleting field");
    }
  };

  const userFields = fields.filter((f) => f.role === "user");
  const sellerFields = fields.filter((f) => f.role === "seller");

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Admin Control Panel</h1>
          <p className="text-sm text-gray-500 mt-1">
            Assign user roles and configure dynamic profile form fields.
          </p>
        </div>

        {/* Tab Controls */}
        <div className="flex bg-gray-100 p-1 rounded-lg self-start">
          <button
            onClick={() => setActiveTab("users")}
            className={`px-4 py-2 text-sm font-semibold rounded-md transition ${
              activeTab === "users"
                ? "bg-white text-gray-900 shadow-sm"
                : "text-gray-500 hover:text-gray-900"
            }`}
          >
            Users & Roles ({users.length})
          </button>
          <button
            onClick={() => setActiveTab("fields")}
            className={`px-4 py-2 text-sm font-semibold rounded-md transition ${
              activeTab === "fields"
                ? "bg-white text-gray-900 shadow-sm"
                : "text-gray-500 hover:text-gray-900"
            }`}
          >
            Role Form Fields ({fields.length})
          </button>
        </div>
      </div>

      {notification.text && (
        <div
          className={`mb-6 p-4 rounded-lg text-sm font-medium border ${
            notification.type === "success"
              ? "bg-green-50 text-green-800 border-green-200"
              : "bg-red-50 text-red-800 border-red-200"
          }`}
        >
          {notification.text}
        </div>
      )}

      {loading ? (
        <div className="text-center py-16 text-gray-400">Loading data...</div>
      ) : activeTab === "users" ? (
        /* USERS MANAGEMENT SECTION */
        <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200 bg-gray-50 flex justify-between items-center">
            <h2 className="text-base font-semibold text-gray-800">
              Registered Users
            </h2>
            <span className="text-xs text-gray-500">
              Assign User or Seller role to pending registrations
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-sm">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200 text-gray-500 uppercase text-xs tracking-wider">
                  <th className="px-6 py-3 font-semibold">User</th>
                  <th className="px-6 py-3 font-semibold">Email</th>
                  <th className="px-6 py-3 font-semibold">Current Role</th>
                  <th className="px-6 py-3 font-semibold text-right">Assign Role</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {users.length === 0 ? (
                  <tr>
                    <td colSpan="4" className="px-6 py-8 text-center text-gray-400">
                      No users found.
                    </td>
                  </tr>
                ) : (
                  users.map((u) => (
                    <tr key={u._id} className="hover:bg-gray-50/70 transition">
                      <td className="px-6 py-4 font-medium text-gray-900">
                        {u.name}
                      </td>
                      <td className="px-6 py-4 text-gray-600">{u.email}</td>
                      <td className="px-6 py-4">
                        <span
                          className={`inline-block px-2.5 py-0.5 text-xs font-semibold rounded-full uppercase tracking-wider ${
                            u.role === "admin"
                              ? "bg-purple-100 text-purple-700"
                              : u.role === "seller"
                              ? "bg-blue-100 text-blue-700"
                              : u.role === "user"
                              ? "bg-green-100 text-green-700"
                              : "bg-amber-100 text-amber-700"
                          }`}
                        >
                          {u.role}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        {u.role === "admin" ? (
                          <span className="text-xs text-gray-400 italic">
                            System Admin
                          </span>
                        ) : (
                          <div className="inline-flex gap-2">
                            <button
                              onClick={() => handleAssignRole(u._id, "user")}
                              className={`px-3 py-1 text-xs font-medium rounded border transition ${
                                u.role === "user"
                                  ? "bg-green-600 text-white border-green-600"
                                  : "border-gray-300 text-gray-700 hover:bg-green-50 hover:text-green-700 hover:border-green-300"
                              }`}
                            >
                              User
                            </button>
                            <button
                              onClick={() => handleAssignRole(u._id, "seller")}
                              className={`px-3 py-1 text-xs font-medium rounded border transition ${
                                u.role === "seller"
                                  ? "bg-blue-600 text-white border-blue-600"
                                  : "border-gray-300 text-gray-700 hover:bg-blue-50 hover:text-blue-700 hover:border-blue-300"
                              }`}
                            >
                              Seller
                            </button>
                          </div>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        /* DYNAMIC FORM FIELDS MANAGEMENT SECTION */
        <div className="space-y-8">
          {/* Create new field */}
          <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
            <h2 className="text-base font-semibold text-gray-800 mb-4">
              Add Form Field for a Role
            </h2>
            <form onSubmit={handleAddField} className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  Field Label
                </label>
                <input
                  type="text"
                  placeholder="e.g. Phone Number, Shop Address"
                  value={newField.label}
                  onChange={(e) =>
                    setNewField({ ...newField, label: e.target.value })
                  }
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  For Role
                </label>
                <select
                  value={newField.role}
                  onChange={(e) =>
                    setNewField({ ...newField, role: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="user">User</option>
                  <option value="seller">Seller</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  Input Type
                </label>
                <select
                  value={newField.type}
                  onChange={(e) =>
                    setNewField({ ...newField, type: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="text">Text</option>
                  <option value="number">Number</option>
                  <option value="email">Email</option>
                  <option value="date">Date</option>
                  <option value="textarea">Textarea (Multiline)</option>
                </select>
              </div>

              <div>
                <button
                  type="submit"
                  className="w-full py-2 px-4 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium rounded-lg transition shadow-sm"
                >
                  + Add Field
                </button>
              </div>
            </form>
          </div>

          {/* Fields Columns: User vs Seller */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* User role fields */}
            <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
              <div className="flex items-center justify-between mb-4 pb-2 border-b border-gray-100">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-green-500"></span>
                  <h3 className="font-semibold text-gray-800 text-base">
                    User Profile Fields ({userFields.length})
                  </h3>
                </div>
                <span className="text-xs text-gray-500">
                  Visible to "User" role
                </span>
              </div>

              {userFields.length === 0 ? (
                <p className="text-xs text-gray-400 py-6 text-center italic">
                  No fields enabled for User role yet.
                </p>
              ) : (
                <ul className="space-y-2">
                  {userFields.map((f) => (
                    <li
                      key={f._id}
                      className="flex items-center justify-between p-3 bg-gray-50 border border-gray-200 rounded-lg"
                    >
                      <div>
                        <p className="text-sm font-semibold text-gray-800">
                          {f.label}
                        </p>
                        <p className="text-xs text-gray-500">
                          key: <code className="text-indigo-600">{f.name}</code> | type:{" "}
                          <span className="capitalize">{f.type}</span>
                        </p>
                      </div>
                      <button
                        onClick={() => handleDeleteField(f._id)}
                        className="text-xs text-red-600 hover:text-red-800 hover:bg-red-50 p-1.5 rounded transition"
                        title="Delete field"
                      >
                        Delete
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {/* Seller role fields */}
            <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
              <div className="flex items-center justify-between mb-4 pb-2 border-b border-gray-100">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-blue-500"></span>
                  <h3 className="font-semibold text-gray-800 text-base">
                    Seller Profile Fields ({sellerFields.length})
                  </h3>
                </div>
                <span className="text-xs text-gray-500">
                  Visible to "Seller" role
                </span>
              </div>

              {sellerFields.length === 0 ? (
                <p className="text-xs text-gray-400 py-6 text-center italic">
                  No fields enabled for Seller role yet.
                </p>
              ) : (
                <ul className="space-y-2">
                  {sellerFields.map((f) => (
                    <li
                      key={f._id}
                      className="flex items-center justify-between p-3 bg-gray-50 border border-gray-200 rounded-lg"
                    >
                      <div>
                        <p className="text-sm font-semibold text-gray-800">
                          {f.label}
                        </p>
                        <p className="text-xs text-gray-500">
                          key: <code className="text-indigo-600">{f.name}</code> | type:{" "}
                          <span className="capitalize">{f.type}</span>
                        </p>
                      </div>
                      <button
                        onClick={() => handleDeleteField(f._id)}
                        className="text-xs text-red-600 hover:text-red-800 hover:bg-red-50 p-1.5 rounded transition"
                        title="Delete field"
                      >
                        Delete
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
