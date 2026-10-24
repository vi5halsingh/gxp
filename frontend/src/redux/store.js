import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slices/authSlice";
import adminReducer from "./slices/adminSlice";
import profileReducer from "./slices/profileSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    admin: adminReducer,
    profile: profileReducer,
  },
});

export default store;
