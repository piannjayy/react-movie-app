import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import DetailViewSeries from "./DetailSeriesView";

const API_KEY = "28fd68f4af938f0570807ba705fd2aba";
const BASE_URL = "https://api.themoviedb.org/3";
const SESSION_ID = "e2484df3f0cb523723d320daf44fcf0490a41cd9";
const ACCOUNT_ID = "22353090";

const DetailSeries = () => {
  const { id } = useParams();
  const [series, setSeries] = useState(null);
  const [similar, setSimilar] = useState([]);
  const [cast, setCast] = useState([]);
  const [loading, setLoading] = useState(true);
  const [favorite, setFavorite] = useState(false);
  const [userRating, setUserRating] = useState(() => {
    const saved = localStorage.getItem(`rating_series_${id}`);
    return saved ? parseFloat(saved) : null;
  });

  // Reset rating ketika id berubah
  useEffect(() => {
    const saved = localStorage.getItem(`rating_series_${id}`);
    setUserRating(saved ? parseFloat(saved) : null);
  }, [id]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        console.log("Fetch detail for series id:", id);

        const seriesRes = await axios.get(
          `${BASE_URL}/tv/${id}?api_key=${API_KEY}&language=en-US`
        );
        const similarRes = await axios.get(
          `${BASE_URL}/tv/${id}/similar?api_key=${API_KEY}&language=en-US`
        );
        const castRes = await axios.get(
          `${BASE_URL}/tv/${id}/credits?api_key=${API_KEY}&language=en-US`
        );

        setSeries(seriesRes.data);
        setSimilar(similarRes.data.results);
        setCast(castRes.data.cast);

        // Cek apakah series ini sudah jadi favorite user
        const favRes = await axios.get(
          `${BASE_URL}/account/${ACCOUNT_ID}/favorite/tv`,
          {
            params: { api_key: API_KEY, session_id: SESSION_ID },
          }
        );
        const isFav = favRes.data.results.some(
          (s) => s.id === seriesRes.data.id
        );
        setFavorite(isFav);
      } catch (err) {
        console.error("Error fetching series detail:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  const toggleFavorite = async () => {
    try {
      const newFavorite = !favorite;
      setFavorite(newFavorite);

      await axios.post(
        `${BASE_URL}/account/${ACCOUNT_ID}/favorite`,
        {
          media_type: "tv",
          media_id: Number(id),
          favorite: newFavorite,
        },
        {
          params: { api_key: API_KEY, session_id: SESSION_ID },
        }
      );

      console.log(`Series ${id} favorite status:`, newFavorite);
    } catch (err) {
      console.error("❌ Failed to update favorite:", err);
      alert("Failed to update favorite. Try again.");
      setFavorite(!favorite); // rollback state kalau gagal
    }
  };

  const handleSetRating = (rating) => {
    setUserRating(rating);
    localStorage.setItem(`rating_series_${id}`, rating.toString());
  };

  const clearRating = () => {
    setUserRating(null);
    localStorage.removeItem(`rating_series_${id}`);
  };

  if (loading) return <p className="text-center text-purple-400">Loading...</p>;

  return (
    <DetailViewSeries
      series={series}
      similar={similar}
      cast={cast}
      favorite={favorite}
      toggleFavorite={toggleFavorite}
      userRating={userRating}
      setUserRating={handleSetRating}
      clearRating={clearRating}
    />
  );
};

export default DetailSeries;
