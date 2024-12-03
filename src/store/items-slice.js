import { createSlice } from "@reduxjs/toolkit";

const itemsSlice = createSlice({
  name: "items",
  initialState: {
    items: [],
    workStates: [
      { value: 0, label: "Da svolgere" },
      { value: 1, label: "Svolto" },
      { value: 2, label: "Annullato" },
    ],
    quoteStates: [
      { value: 0, label: "Da confermare" },
      { value: 1, label: "Confermato" },
      { value: 2, label: "Annullato" },
    ],
  },
  reducers: {
    setItems(state, action) {
      state.items = action.payload.items;
    },
    addItem(state, action) {
      state.items.push(action.payload);
    },
    editItem(state, action) {
      const itemIndex = state.items.findIndex(
        (it) => it.id === action.payload.id
      );
      if (itemIndex >= 0 && state.items.length > itemIndex) {
        state.items[itemIndex] = action.payload;
      }
    },
    removeItem(state, action) {
      const itemIndex = state.items.findIndex((it) => it.id === action.payload);
      if (itemIndex >= 0) {
        const item = state.items.find((it) => it.id === action.payload);
        state.items.splice(itemIndex, 1);

        if (item.quote) {
          const quoteIndex = state.items.findIndex(
            (it) => it.type === "quote" && it.id === item.quote
          );
          if (quoteIndex >= 0) {
            const { work, ...rest } = state.items[quoteIndex];
            state.items[quoteIndex] = rest;
          }
        }
        if (item.work) {
          const workIndex = state.items.findIndex(
            (it) => it.type === "work" && it.id === item.work
          );
          if (workIndex >= 0) {
            const { quote, ...rest } = state.items[workIndex];
            state.items[workIndex] = rest;
          }
        }
      }
    },
  },
});

export const itemsActions = itemsSlice.actions;
export default itemsSlice.reducer;
