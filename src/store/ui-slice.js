import { createSlice } from "@reduxjs/toolkit";

const uiSlice = createSlice({
  name: "ui",
  initialState: {
    page: "works",
    form: {
      action: null,
      item: null
    },
    isLoading: false,
    isTouchDevice: "ontouchstart" in window || navigator.msMaxTouchPoints > 0,
  },
  reducers: {
    setPage(state, action) {
      state.page = action.payload;
    },
    setForm(state, action) {
      state.form = action.payload;
    },
    setIsLoading(state, action) {
      state.isLoading = action.payload;
    }
  },
});

export const uiActions = uiSlice.actions;
export default uiSlice.reducer;
