import React, { useEffect, useState, useRef, useCallback } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import FavoriteView from "./FavoriteView";

const API_KEY = "28fd68f4af938f0570807ba705fd2aba";
const BASE_URL = "https://api.themoviedb.org/3";
const SESSION_ID = "e2484df3f0cb523723d320daf44fcf0490a41cd9";
const ACCOUNT_ID = "22353090";

const Favorite = () => {
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const navigate = useNavigate();
  const scrollContainerRef = useRef(null);

  const fetchFavorites = useCallback(async () => {
    try {
      setLoading(true);
      const res = await axios.get(
        `${BASE_URL}/account/${ACCOUNT_ID}/favorite/movies`,
        {
          params: { api_key: API_KEY, session_id: SESSION_ID },
        }
      );
      setFavorites(res.data.results || []);
    } catch (err) {
      console.error("Gagal ambil favorites:", err);
      setError("Failed to load favorites");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchFavorites();
  }, [fetchFavorites]);

  const handleMovieClick = (id) => {
    navigate(`/movie/${id}`);
  };

  return (
    <FavoriteView
      favorites={favorites}
      loading={loading}
      error={error}
      scrollContainerRef={scrollContainerRef}
      onMovieClick={handleMovieClick}
    />
  );
};

export default Favorite;
