import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  isSidebarOpen: false,
};

const miscSlice = createSlice({
  name: "misc",
  initialState,
  reducers: {
    setIsSidebarOpen: (state, action) => {
      state.isSidebarOpen = action.payload;
    }
  },
});

export default miscSlice;
export const {
  setIsSidebarOpen
} = miscSlice.actions;