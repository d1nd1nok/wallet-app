import { createSlice } from "@reduxjs/toolkit";

const authSlice = createSlice({
  name: "auth",
  initialState: {
    user: localStorage.getItem("user") || null,
    userId: localStorage.getItem("userId") || null,
    token: localStorage.getItem("token") || null,
  },
  reducers: {
    loginSuccess: (state, action) => {
      state.user = action.payload.user;
      state.userId = action.payload.userId;
      state.token = action.payload.token;

      localStorage.setItem("user", action.payload.user);
      localStorage.setItem("userId", action.payload.userId);
      localStorage.setItem("token", action.payload.token);
    },
    logout: (state) => {
      state.user = null;
      state.userId = null;
      state.token = null;

      localStorage.removeItem("user");
      localStorage.removeItem("userId");
      localStorage.removeItem("token");
    },
  },
});

export const { loginSuccess, logout } = authSlice.actions;
export default authSlice.reducer;
