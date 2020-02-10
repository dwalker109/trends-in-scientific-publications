import React, { FC, useState } from "react";
import { doSearch } from "./searchSlice";
import { useDispatch, useSelector } from "react-redux";
import "./Search.css";

const Search: FC = () => {
  const [term, setTerm] = useState("");
  const [dateStart, setDateStart] = useState("");
  const [dateEnd, setDateEnd] = useState("");

  const running = useSelector((state: any) => state.search.running);
  const error = useSelector((state: any) => state.search.error);
  const hasResults = useSelector((state: any) =>
    Boolean(state.search.resultSet)
  );

  const dispatch = useDispatch();

  return (
    <div className="Search">
      <form
        onSubmit={e => {
          e.preventDefault();
          dispatch(doSearch(term, dateStart, dateEnd));
        }}
      >
        <div>
          <label htmlFor="term">Term</label>
          <input
            id="term"
            value={term}
            disabled={running}
            required={true}
            onChange={e => setTerm(e.target.value)}
          />
        </div>
        <div>
          <label htmlFor="date-start">From</label>
          <input
            id="date-start"
            value={dateStart}
            disabled={running}
            required={true}
            pattern="^\d{4}$"
            placeholder="YYYY"
            maxLength={4}
            onChange={e => setDateStart(e.target.value)}
          />
        </div>
        <div>
          <label htmlFor="date-end">To</label>
          <input
            id="date-end"
            value={dateEnd}
            disabled={running}
            required={true}
            pattern="^\d{4}$"
            placeholder="YYYY"
            maxLength={4}
            onChange={e => setDateEnd(e.target.value)}
          />
        </div>
        <input
          className="Search-submit"
          type="submit"
          value="Go"
          disabled={running}
        />
      </form>
      <div className="Search-messages">
        {!running && !error && !hasResults && (
          <span className="Search-intro">
            Use the fields above to search PubMed for a disease area
          </span>
        )}
        {running && (
          <span className="Search-running">
            Search in progress <img src="/loading.svg" alt="loading" />
          </span>
        )}
        {error && (
          <span className="Search-error">
            An error occurred during search: {error}
          </span>
        )}
      </div>
    </div>
  );
};

export default Search;
