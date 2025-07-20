import { AdminSidebar, GetLocalStorage } from "@/utils/localStorage";
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  isSidebarOpen:  GetLocalStorage({key:AdminSidebar}) || false,
  isAdmin: false,
  isLoading:true,
};

const adminSlice = createSlice({
  name: "admin",
  initialState,
  reducers: {
    login: (state, action) => {
      state.isAdmin = true;
      state.isLoading = false;
    },
    logout: (state, action) => {
      state.isAdmin = false;
      state.isLoading = false;
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