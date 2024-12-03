import { createSlice } from "@reduxjs/toolkit";
import italia from "italia";

let province = [];
italia.comuni.regioni.forEach((regione) => {
  province = [...province, ...regione.province];
});
province.sort((a, b) =>
  a.nome.localeCompare(b.nome, "it", { sensitivity: "base" })
);

let comuni = [];
province.forEach((provincia) => {
  const comuniProvincia = provincia.comuni.map((comune) => ({
    ...comune,
    provincia: provincia.code,
  }));

  comuni = [...comuni, ...comuniProvincia];
});
comuni.sort((a, b) =>
  a.nome.localeCompare(b.nome, "it", { sensitivity: "base" })
);

const clientsSlice = createSlice({
  name: "clients",
  initialState: {
    province: province,
    comuni: comuni,
    items: []
  },
  reducers: {
    setItems(state, action) {
      state.items = action.payload;
    },
    addItem(state, action) {
      state.items.push(action.payload);
    },
    editItem(state, action) {
      const itemIndex = state.items.findIndex(it => it.id === action.payload.id);
      if (itemIndex >= 0) {
        state.items[itemIndex] = action.payload;
      }
    },
  },
});

export const clientsActions = clientsSlice.actions;
export default clientsSlice.reducer;
