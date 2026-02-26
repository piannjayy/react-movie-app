import { combineReducers, configureStore } from "@reduxjs/toolkit";
import movieReducer from './reducer/movieSlice';
import searchReducer from './reducer/searchReducer';

const reducerTotal = combineReducers({
    movies: movieReducer,
    search: searchReducer,
});

const store = configureStore({
    reducer: reducerTotal,
});

export default store;