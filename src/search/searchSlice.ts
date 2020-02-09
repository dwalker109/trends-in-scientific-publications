import { createSlice } from "@reduxjs/toolkit";
import { eSearch, eSummary } from "./ncbiApi";

interface SearchState {
  running: boolean;
  resultSets: ResultSet[];
}

interface ResultSet {
  term: string;
  startDate: string;
  endDate: string;
}

const initialState: SearchState = {
  running: false,
  resultSets: []
};

const searchSlice = createSlice({
  name: "search",
  initialState,
  reducers: {
    startedSearch(state, action) {
      console.log(action.payload);
    },
    resolvedSearch(state, action) {
      console.log(action.payload);
    },
    failedSearch(state, action) {
      console.log(action.payload);
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
    dispatch(resolvedSearch(eSummaryResult));
  } catch (e) {
    dispatch(failedSearch(e));
  }
};

export { doSearch };
