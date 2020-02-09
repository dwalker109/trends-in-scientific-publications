import React from "react";
import "./App.css";
import Search from "./search/Search";
import Trends from "./trends/Trends";

const App = () => {
  return (
    <div className="App">
      <Search />
      <Trends />
    </div>
  );
};

export default App;
