import React from "react";

const Search = () => {
  return (
    <div className="Search">
      <form>
        <label htmlFor="term">Term</label>
        <input name="term" />
        <label htmlFor="date-start">Start</label>
        <input name="date-start" />
        <label htmlFor="date-end">End</label>
        <input name="date-end" />
      </form>
    </div>
  );
};

export default Search;
