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
      state.running = true;
      state.error = null;
      state.resultSet = null;
    },
    resolvedSearch(state, action) {
      state.resultSet = action.payload;
      state.running = false;
    },
    failedSearch(state, action) {
      state.running = false;
      state.error = action.payload;
    }
  }
});

export const {
  startedSearch,
  resolvedSearch,
  failedSearch
} = searchSlice.actions;

export default searchSlice.reducer;

/**
 * Thunk used to init the AJAX requests
 */
const doSearch = (term: string, dateStart: string, dateEnd: string) => async (
  dispatch: any
) => {
  dispatch(startedSearch("Started search"));

  if (Number(dateStart) > Number(dateEnd)) {
    return dispatch(
      failedSearch("'From' date must be less than or equal to 'To' date")
    );
  }

  try {
    const eSearchResult: any = await eSearch(term, dateStart, dateEnd);
    const eSummaryResult = await eSummary(eSearchResult);
    dispatch(resolvedSearch({ term, dateStart, dateEnd, eSummaryResult }));
  } catch (e) {
    dispatch(failedSearch(e.toString()));
  }
};

export { doSearch };
