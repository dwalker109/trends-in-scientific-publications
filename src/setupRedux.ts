import { combineReducers } from "@reduxjs/toolkit";
import searchReducer from "./search/searchSlice";

export default combineReducers({ search: searchReducer });
