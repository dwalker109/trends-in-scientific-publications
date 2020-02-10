import React, { FC, useState } from "react";
import { doSearch } from "./searchSlice";
import { useDispatch, useSelector } from "react-redux";

const Search: FC = () => {
  const [term, setTerm] = useState("");
  const [dateStart, setDateStart] = useState("");
  const [dateEnd, setDateEnd] = useState("");

  const running = useSelector((state: any) => state.search.running);
  const dispatch = useDispatch();

  return (
    <div className="Search">
      <form
        onSubmit={e => {
          e.preventDefault();
          dispatch(doSearch(term, dateStart, dateEnd));
        }}
      >
        <label htmlFor="term">Term</label>
        <input
          name="term"
          value={term}
          disabled={running}
          required={true}
          onChange={e => setTerm(e.target.value)}
        />
        <label htmlFor="date-start">Start</label>
        <input
          name="date-start"
          value={dateStart}
          disabled={running}
          required={true}
          pattern="^\d{4}$"
          onChange={e => setDateStart(e.target.value)}
        />
        <label htmlFor="date-end">End</label>
        <input
          name="date-end"
          value={dateEnd}
          disabled={running}
          required={true}
          pattern="^\d{4}$"
          onChange={e => setDateEnd(e.target.value)}
        />
        <input type="submit" value="Go" disabled={running} />
      </form>
      {running && <span className="Search-running">Search in progress...</span>}
    </div>
  );
};

export default Search;
