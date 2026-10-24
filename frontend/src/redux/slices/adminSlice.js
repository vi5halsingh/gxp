import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { api } from "../../services/api";

// 1. Fetch All Users
export const fetchAllUsers = createAsyncThunk(
  "admin/fetchAllUsers",
  async (_, { rejectWithValue }) => {
    try {
      const res = await api.getAllUsers();
      if (!res.success) return rejectWithValue(res.message);
      return res.data;
    } catch (err) {
      return rejectWithValue(err.message || "Failed to fetch users");
    }
  }
);

// 2. Assign Role to User
export const assignUserRole = createAsyncThunk(
  "admin/assignUserRole",
  async ({ userId, role }, { rejectWithValue }) => {
    try {
      const res = await api.assignRole(userId, role);
      if (!res.success) return rejectWithValue(res.message);
      return res.data; // updated user
    } catch (err) {
      return rejectWithValue(err.message || "Failed to assign role");
    }
  }
);

// 3. Fetch All Dynamic Input Fields
export const fetchAllFields = createAsyncThunk(
  "admin/fetchAllFields",
  async (_, { rejectWithValue }) => {
    try {
      const res = await api.getAllInputs();
      if (!res.success) return rejectWithValue(res.message);
      return res.data;
    } catch (err) {
      return rejectWithValue(err.message || "Failed to fetch fields");
    }
  }
);

// 4. Create Dynamic Input Field
export const createField = createAsyncThunk(
  "admin/createField",
  async (fieldData, { rejectWithValue }) => {
    try {
      const res = await api.createInput(fieldData);
      if (!res.success) return rejectWithValue(res.message);
      return res.data;
    } catch (err) {
      return rejectWithValue(err.message || "Failed to create field");
    }
  }
);

// 5. Delete Dynamic Input Field
export const deleteField = createAsyncThunk(
  "admin/deleteField",
  async (fieldId, { rejectWithValue }) => {
    try {
      const res = await api.deleteInput(fieldId);
      if (!res.success) return rejectWithValue(res.message);
      return fieldId;
    } catch (err) {
      return rejectWithValue(err.message || "Failed to delete field");
    }
  }
);

const adminSlice = createSlice({
  name: "admin",
  initialState: {
    users: [],
    fields: [],
    loading: false,
    error: null,
    message: null,
  },
  reducers: {
    clearAdminMessage: (state) => {
      state.message = null;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    // Fetch Users
    builder
      .addCase(fetchAllUsers.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchAllUsers.fulfilled, (state, action) => {
        state.loading = false;
        state.users = action.payload;
      })
      .addCase(fetchAllUsers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // Assign Role
    builder
      .addCase(assignUserRole.fulfilled, (state, action) => {
        const updatedUser = action.payload;
        state.users = state.users.map((u) =>
          u._id === updatedUser._id ? updatedUser : u
        );
        state.message = `Role assigned successfully to ${updatedUser.name}`;
      })
      .addCase(assignUserRole.rejected, (state, action) => {
        state.error = action.payload;
      });

    // Fetch Fields
    builder
      .addCase(fetchAllFields.fulfilled, (state, action) => {
        state.fields = action.payload;
      })
      .addCase(fetchAllFields.rejected, (state, action) => {
        state.error = action.payload;
      });

    // Create Field
    builder
      .addCase(createField.fulfilled, (state, action) => {
        state.fields.push(action.payload);
        state.message = "Form field added successfully";
      })
      .addCase(createField.rejected, (state, action) => {
        state.error = action.payload;
      });

    // Delete Field
    builder
      .addCase(deleteField.fulfilled, (state, action) => {
        state.fields = state.fields.filter((f) => f._id !== action.payload);
        state.message = "Form field deleted";
      })
      .addCase(deleteField.rejected, (state, action) => {
        state.error = action.payload;
      });
  },
});

export const { clearAdminMessage } = adminSlice.actions;
export default adminSlice.reducer;
