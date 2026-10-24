const API_BASE = "http://localhost:3000/api";

const getHeaders = () => {
  const token = localStorage.getItem("token");
  return {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
};

export const api = {
  // Auth & User
  register: async (userData) => {
    const res = await fetch(`${API_BASE}/user/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(userData),
    });
    return res.json();
  },

  login: async (credentials) => {
    const res = await fetch(`${API_BASE}/user/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(credentials),
    });
    return res.json();
  },

  getMe: async () => {
    const res = await fetch(`${API_BASE}/user/me`, {
      headers: getHeaders(),
    });
    return res.json();
  },

  getAllUsers: async () => {
    const res = await fetch(`${API_BASE}/user/all`, {
      headers: getHeaders(),
    });
    return res.json();
  },

  assignRole: async (userId, role) => {
    const res = await fetch(`${API_BASE}/user/${userId}/role`, {
      method: "PATCH",
      headers: getHeaders(),
      body: JSON.stringify({ role }),
    });
    return res.json();
  },

  // Dynamic Input Fields
  getInputsByRole: async (role) => {
    const res = await fetch(`${API_BASE}/input/role/${role}`, {
      headers: getHeaders(),
    });
    return res.json();
  },

  getAllInputs: async () => {
    const res = await fetch(`${API_BASE}/input/all`, {
      headers: getHeaders(),
    });
    return res.json();
  },

  createInput: async (fieldData) => {
    const res = await fetch(`${API_BASE}/input`, {
      method: "POST",
      headers: getHeaders(),
      body: JSON.stringify(fieldData),
    });
    return res.json();
  },

  deleteInput: async (id) => {
    const res = await fetch(`${API_BASE}/input/${id}`, {
      method: "DELETE",
      headers: getHeaders(),
    });
    return res.json();
  },

  // Profile Data
  getMyProfile: async () => {
    const res = await fetch(`${API_BASE}/profile/me`, {
      headers: getHeaders(),
    });
    return res.json();
  },

  saveProfile: async (data) => {
    const res = await fetch(`${API_BASE}/profile`, {
      method: "POST",
      headers: getHeaders(),
      body: JSON.stringify({ data }),
    });
    return res.json();
  },
};
