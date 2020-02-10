import React from "react";
import "./App.css";
import Search from "./search/Search";
import Trends from "./trends/Trends";

const App = () => {
  return (
    <div className="App">
      <header>
        <h1>Trends in Scientific Publications</h1>
        <Search />
      </header>
      <main>
        <Trends />
      </main>
      <footer>Dan Walker, 2020</footer>
    </div>
  );
};

export default App;
