import { createSlice } from "@reduxjs/toolkit";

const filtersSlice = createSlice({
  name: "filters",
  initialState: {
    searchString: "",
    works: {
      clients: [],
      periods: [],
      names: [],
      phones: [],
      emails: [],
      materials: [],
    },
    quotes: {
      clients: [],
      periods: [],
      names: [],
      phones: [],
      emails: [],
      materials: [],
    },
  },
  reducers: {
    setSearchString(state, action) {
      state.searchString = action.payload;
    },
    setWorksFilters(state, action) {
      state.works = action.payload;
    },
    setQuotesFilters(state, action) {
      state.items = action.payload;
    },
  },
});

export const filtersActions = filtersSlice.actions;
export default filtersSlice.reducer;
