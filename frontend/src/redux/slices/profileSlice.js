import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { api } from "../../services/api";

// 1. Fetch form fields for user's assigned role
export const fetchRoleFields = createAsyncThunk(
  "profile/fetchRoleFields",
  async (role, { rejectWithValue }) => {
    try {
      const res = await api.getInputsByRole(role);
      if (!res.success) return rejectWithValue(res.message);
      return res.data;
    } catch (err) {
      return rejectWithValue(err.message || "Failed to fetch fields");
    }
  }
);

// 2. Fetch logged-in user's saved profile
export const fetchMyProfile = createAsyncThunk(
  "profile/fetchMyProfile",
  async (_, { rejectWithValue }) => {
    try {
      const res = await api.getMyProfile();
      if (!res.success) return rejectWithValue(res.message);
      return res.data?.data || {};
    } catch (err) {
      return rejectWithValue(err.message || "Failed to fetch profile");
    }
  }
);

// 3. Save profile form submission
export const saveMyProfile = createAsyncThunk(
  "profile/saveMyProfile",
  async (formData, { rejectWithValue }) => {
    try {
      const res = await api.saveProfile(formData);
      if (!res.success) return rejectWithValue(res.message);
      return res.data?.data || formData;
    } catch (err) {
      return rejectWithValue(err.message || "Failed to save profile");
    }
  }
);

const profileSlice = createSlice({
  name: "profile",
  initialState: {
    fields: [],
    formData: {},
    loading: false,
    saving: false,
    error: null,
    successMessage: null,
  },
  reducers: {
    setFormField: (state, action) => {
      const { name, value } = action.payload;
      state.formData[name] = value;
    },
    clearProfileMessage: (state) => {
      state.successMessage = null;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    // Fetch Fields
    builder
      .addCase(fetchRoleFields.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchRoleFields.fulfilled, (state, action) => {
        state.loading = false;
        state.fields = action.payload;
      })
      .addCase(fetchRoleFields.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // Fetch Profile
    builder.addCase(fetchMyProfile.fulfilled, (state, action) => {
      state.formData = action.payload || {};
    });

    // Save Profile
    builder
      .addCase(saveMyProfile.pending, (state) => {
        state.saving = true;
        state.error = null;
        state.successMessage = null;
      })
      .addCase(saveMyProfile.fulfilled, (state, action) => {
        state.saving = false;
        state.formData = action.payload;
        state.successMessage = "Your profile has been saved successfully!";
      })
      .addCase(saveMyProfile.rejected, (state, action) => {
        state.saving = false;
        state.error = action.payload;
      });
  },
});

export const { setFormField, clearProfileMessage } = profileSlice.actions;
export default profileSlice.reducer;
