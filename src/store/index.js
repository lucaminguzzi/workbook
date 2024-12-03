import { configureStore } from "@reduxjs/toolkit";
import itemsSlice from "./items-slice";
import uiSlice from "./ui-slice";
import clientsSlice from "./clients-slice";
import filtersSlice from "./filters-slice";

const store = configureStore({
  reducer: {
    items: itemsSlice,
    ui: uiSlice,
    clients: clientsSlice,
    filters: filtersSlice
  },
});

export default store;
