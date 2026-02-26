// src/pages/Search/Search.jsx
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useSearchParams } from "react-router-dom";
import { fetchSearchMovies } from "../../reducer/searchReducer";
import SearchView from "./SearchView";
import { useTheme } from "../../context/ThemeContext";

const Search = () => {
  const dispatch = useDispatch();
  const { results, loading, error } = useSelector((state) => state.search);
  const [searchParams] = useSearchParams();
  const query = searchParams.get("query") || "";
  const { theme, toggleTheme } = useTheme();

  useEffect(() => {
    if (query) {
      dispatch(fetchSearchMovies(query));
    }
  }, [query, dispatch]);

  return (
    <div className={`min-h-screen ${theme === 'dark' ? 'bg-gray-900 text-white' : 'bg-white text-gray-900'}`}>
      <div className="flex justify-end p-4">
        <button
          className="btn btn-ghost"
          onClick={toggleTheme}
          aria-label="Toggle Dark Mode"
          title={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
        >
          {theme === 'light' ? (
            <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
            </svg>
          ) : (
            <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
            </svg>
          )}
        </button>
      </div>
      <SearchView
        results={results}
        loading={loading}
        error={error}
        query={query}
      />
    </div>
  );
};

export default Search;
