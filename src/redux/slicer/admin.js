import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  isSidebarOpen: false,
  isAdmin: false,
};

const adminSlice = createSlice({
  name: "admin",
  initialState,
  reducers: {
    login: (state, action) => {
      state.isAdmin = true;
    },
    logout: (state, action) => {
      state.isAdmin = false;
    },
    setIsSidebarOpen: (state, action) => {
      state.isSidebarOpen = action.payload;
    }
  },
});

export default adminSlice;
export const {
  setIsSidebarOpen,login,logout
} = adminSlice.actions;