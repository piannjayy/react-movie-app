import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchSearchMovies, clearSearch } from "../reducer/searchReducer";
import SearchPopup from "./Navbar/SearchPopup";
import { useTheme } from "../context/ThemeContext";

const Navbar = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [language, setLanguage] = useState("en");
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { results, loading, error } = useSelector((state) => state.search);
  const { theme, toggleTheme } = useTheme();

  const translations = {
    en: {
      searchPlaceholder: "Search movies...",
      home: "Home",
      favorite: "Favorite",
      toggleThemeLabel: `Switch to ${theme === 'light' ? 'dark' : 'light'} mode`,
      languageLabel: "Language"
    },
    id: {
      searchPlaceholder: "Cari film...",
      home: "Beranda",
      favorite: "Favorit",
      toggleThemeLabel: `Beralih ke mode ${theme === 'light' ? 'gelap' : 'terang'}`,
      languageLabel: "Bahasa"
    }
  };

  const t = translations[language];

  const handleInputChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    if (value.trim().length > 2) {
      dispatch(fetchSearchMovies(value.trim()));
    } else {
      dispatch(clearSearch());
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && searchTerm.trim()) {
      navigate(`/search?query=${searchTerm}`);
      setModalOpen(false);
      dispatch(clearSearch());
    }
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    dispatch(clearSearch());
  };

  return (
    <>
      <div className={`navbar shadow-sm ${theme === 'light' ? 'bg-white' : 'bg-black'}`}>
        <div className="flex-1 flex items-center gap-4 px-4">
          <span className="text-3xl font-extrabold tracking-widest text-yellow-400 uppercase" style={{ fontFamily: "'Arial Black', Arial, sans-serif" }}>
            ETAS MOVIE
          </span>
        </div>
        <div className="flex gap-6 items-center justify-end flex-1 px-4">
          <div className="relative w-72">
            <input
              type="text"
              className={`input input-bordered input-md w-full pl-14 rounded-2xl shadow-lg transition-colors duration-300 ${
                theme === 'light'
                  ? 'bg-white text-gray-900 placeholder-gray-500 border-yellow-400 focus:border-yellow-500 focus:ring-yellow-500'
                  : 'bg-gray-900 text-yellow-400 placeholder-yellow-300 border-yellow-600 focus:border-yellow-500 focus:ring-yellow-500'
              }`}
              placeholder={t.searchPlaceholder}
              value={searchTerm}
              onChange={handleInputChange}
              onKeyDown={handleKeyPress}
              onFocus={() => setModalOpen(true)}
            />
            <svg
              className={`w-6 h-6 absolute left-5 top-1/2 transform -translate-y-1/2 pointer-events-none ${
                theme === 'light' ? 'text-yellow-500' : 'text-yellow-400'
              }`}
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35m0 0A7.5 7.5 0 1110.5 3a7.5 7.5 0 016.15 13.65z" />
            </svg>
          </div>
          <Link to="/" className={`btn btn-ghost font-semibold text-lg ${theme === 'light' ? 'text-yellow-500 hover:text-yellow-600' : 'text-yellow-400 hover:text-yellow-300'}`}>
            {t.home}
          </Link>
          <Link to="/favorite" className={`btn btn-ghost font-semibold text-lg ${theme === 'light' ? 'text-yellow-500 hover:text-yellow-600' : 'text-yellow-400 hover:text-yellow-300'}`}>
            {t.favorite}
          </Link>
        </div>
        <div className="flex gap-4 items-center pr-4">
          <button
            className={`btn btn-ghost p-2 rounded-full transition-colors duration-300 ${
              theme === 'light' ? 'text-yellow-600 hover:text-yellow-700' : 'text-yellow-400 hover:text-yellow-300'
            }`}
            onClick={toggleTheme}
            aria-label="Toggle Dark Mode"
            title={t.toggleThemeLabel}
          >
            {theme === 'light' ? (
              <svg className="w-7 h-7" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
            ) : (
              <svg className="w-7 h-7" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
              </svg>
            )}
          </button>
          <select
            aria-label={t.languageLabel}
            className="select select-bordered select-sm w-auto bg-transparent text-yellow-400 border-yellow-400"
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
          >
            <option value="en">English</option>
            <option value="id">Indonesia</option>
          </select>
        </div>
      </div>
      <SearchPopup isOpen={modalOpen} onClose={handleCloseModal} results={results} loading={loading} error={error} searchTerm={searchTerm} handleInputChange={handleInputChange} handleKeyPress={handleKeyPress} />
    </>
  );
};

export default Navbar;
