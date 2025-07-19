import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  isLoginDialog: false,
};

const miscSlice = createSlice({
  name: "misc",
  initialState,
  reducers: {
    setIsLoginDialog: (state, action) => {
      state.isLoginDialog = action.payload;
    }
  },
});

export default miscSlice;
export const {
  setIsLoginDialog
} = miscSlice.actions;