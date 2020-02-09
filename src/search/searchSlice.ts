import { createSlice } from "@reduxjs/toolkit";
import { eSearch, eSummary } from "./ncbiApi";
import { NcbiSummary } from "./ncbiApi";

export interface SearchState {
  running: boolean;
  error: string | null;
  resultSet: ResultSet | null;
}

export interface ResultSet {
  term: string;
  startDate: string;
  endDate: string;
  eSummaryResult: NcbiSummary[];
}

const initialState: SearchState = {
  running: false,
  error: null,
  resultSet: null
};

const searchSlice = createSlice({
  name: "search",
  initialState,
  reducers: {
    startedSearch(state, action) {
      console.log(action.payload);
      state.running = true;
    },
    resolvedSearch(state, action) {
      console.log(action.payload);
      state.resultSet = action.payload;
      state.running = false;
    },
    failedSearch(state, action) {
      console.log(action.payload);
      state.error = action.payload;
    },
    deleteSearch(state, action) {}
  }
});

export const {
  startedSearch,
  resolvedSearch,
  failedSearch,
  deleteSearch
} = searchSlice.actions;
export default searchSlice.reducer;

const doSearch = (term: string, dateStart: string, dateEnd: string) => async (
  dispatch: any
) => {
  dispatch(startedSearch("started search"));
  try {
    const eSearchResult: any = await eSearch(term, dateStart, dateEnd);
    const eSummaryResult = await eSummary(eSearchResult);
    dispatch(resolvedSearch({ term, dateStart, dateEnd, eSummaryResult }));
  } catch (e) {
    dispatch(failedSearch(e));
  }
};

export { doSearch };
