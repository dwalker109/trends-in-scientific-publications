import { configureStore } from "@reduxjs/toolkit";
import React from "react";
import "./App.css";
import Search from "./search/Search";
import rootReducer from "./setupRedux";
import Trends from "./trends/Trends";
import { Provider } from "react-redux";

const store = configureStore({ reducer: rootReducer });

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

const ReduxApp = () => (
  <Provider store={store}>
    <App />
  </Provider>
);

export default ReduxApp;
