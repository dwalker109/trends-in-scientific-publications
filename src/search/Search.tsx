import React, { FC, useState } from "react";
import { doSearch } from "./searchSlice";
import { useDispatch } from "react-redux";

const Search: FC = () => {
  const [term, setTerm] = useState(""),
    [dateStart, setDateStart] = useState(""),
    [dateEnd, setDateEnd] = useState("");

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
          onChange={e => setTerm(e.target.value)}
        />
        <label htmlFor="date-start">Start</label>
        <input
          name="date-start"
          value={dateStart}
          onChange={e => setDateStart(e.target.value)}
        />
        <label htmlFor="date-end">End</label>
        <input
          name="date-end"
          value={dateEnd}
          onChange={e => setDateEnd(e.target.value)}
        />
        <input type="submit" value="Go" />
      </form>
    </div>
  );
};

export default Search;
