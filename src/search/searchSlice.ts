import { createSlice } from "@reduxjs/toolkit";

const searchSlice = createSlice({
  name: "search",
  initialState: [],
  reducers: {
    startSearch(state, action) {},
    resolvedSearch(state, action) {},
    deleteSearch(state, action) {}
  }
});

export const {
  startSearch,
  resolvedSearch,
  deleteSearch
} = searchSlice.actions;
export default searchSlice.reducer;
