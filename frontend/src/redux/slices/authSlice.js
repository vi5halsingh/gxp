import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { api } from "../../services/api";

// 1. Register Thunk
export const registerUser = createAsyncThunk(
  "auth/registerUser",
  async (userData, { rejectWithValue }) => {
    try {
      const res = await api.register(userData);
      if (!res.success) {
        return rejectWithValue(res.message || "Registration failed");
      }
      localStorage.setItem("token", res.token);
      return res.data;
    } catch (err) {
      return rejectWithValue(err.message || "Server error");
    }
  }
);

// 2. Login Thunk
export const loginUser = createAsyncThunk(
  "auth/loginUser",
  async (credentials, { rejectWithValue }) => {
    try {
      const res = await api.login(credentials);
      if (!res.success) {
        return rejectWithValue(res.message || "Login failed");
      }
      localStorage.setItem("token", res.token);
      return res.data;
    } catch (err) {
      return rejectWithValue(err.message || "Server error");
    }
  }
);

// 3. Fetch Current User Thunk
export const fetchMe = createAsyncThunk(
  "auth/fetchMe",
  async (_, { rejectWithValue }) => {
    try {
      const res = await api.getMe();
      if (!res.success || !res.data) {
        localStorage.removeItem("token");
        return rejectWithValue("Failed to fetch user");
      }
      return res.data;
    } catch (err) {
      localStorage.removeItem("token");
      return rejectWithValue(err.message || "Auth error");
    }
  }
);

const authSlice = createSlice({
  name: "auth",
  initialState: {
    user: null,
    loading: false,
    error: null,
  },
  reducers: {
    logout: (state) => {
      localStorage.removeItem("token");
      state.user = null;
      state.error = null;
    },
    clearAuthError: (state) => {
      state.error = null;
    },
    setUser: (state, action) => {
      state.user = action.payload;
    },
  },
  extraReducers: (builder) => {
    // Register
    builder
      .addCase(registerUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // Login
    builder
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // Fetch Me
    builder
      .addCase(fetchMe.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchMe.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
      })
      .addCase(fetchMe.rejected, (state) => {
        state.loading = false;
        state.user = null;
      });
  },
});

export const { logout, clearAuthError, setUser } = authSlice.actions;
export default authSlice.reducer;
