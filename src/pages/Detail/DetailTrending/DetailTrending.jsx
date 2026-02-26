import React, { useEffect, useState } from "react";
import { useParams, useLocation } from "react-router-dom";
import axios from "axios";
import DetailTrendingView from "./DetailTrendingView";

const API_KEY = "28fd68f4af938f0570807ba705fd2aba";
const BASE_URL = "https://api.themoviedb.org/3";
const SESSION_ID = "e2484df3f0cb523723d320daf44fcf0490a41cd9";
const ACCOUNT_ID = "22353090";

const DetailTrending = () => {
  const { id } = useParams();
  const location = useLocation();
  const mediaType = location.state?.media_type || "movie"; 

  const [item, setItem] = useState(null);
  const [similar, setSimilar] = useState([]);
  const [cast, setCast] = useState([]);
  const [loading, setLoading] = useState(true);
  const [favorite, setFavorite] = useState(false);
  const [userRating, setUserRating] = useState(() => {
    const saved = localStorage.getItem(`rating_trending_${id}`);
    return saved ? parseFloat(saved) : null;
  });
  const [error, setError] = useState(null);

  // Reset rating when id changes
  useEffect(() => {
    const saved = localStorage.getItem(`rating_trending_${id}`);
    setUserRating(saved ? parseFloat(saved) : null);
  }, [id]);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);

      try {
        console.log(`🔎 Fetch detail for ${mediaType} id:`, id);

        const [itemRes, similarRes, castRes] = await Promise.all([
          axios.get(
            `https://api.themoviedb.org/3/${mediaType}/${id}?api_key=${API_KEY}&language=en-US`
          ),
          axios.get(
            `https://api.themoviedb.org/3/${mediaType}/${id}/similar?api_key=${API_KEY}&language=en-US`
          ),
          axios.get(
            `https://api.themoviedb.org/3/${mediaType}/${id}/credits?api_key=${API_KEY}&language=en-US`
          ),
        ]);

        setItem(itemRes.data);
        setSimilar(similarRes.data.results || []);
        setCast(castRes.data.cast || []);

        // Cek favorite status user untuk item ini
        try {
          const favRes = await axios.get(
            `${BASE_URL}/account/${ACCOUNT_ID}/favorite/${mediaType === "tv" ? "tv" : "movies"}`,
            {
              params: { api_key: API_KEY, session_id: SESSION_ID },
            }
          );
          const isFav = favRes.data.results.some((m) => m.id === itemRes.data.id);
          setFavorite(isFav);
        } catch (favErr) {
          console.error("Failed to fetch favorite status:", favErr);
          setFavorite(false);
        }
      } catch (err) {
        console.error(`❌ Error fetching ${mediaType} detail:`, err);
        setError("Failed to load data. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchData();
  }, [id, mediaType]);

  const toggleFavorite = async () => {
    try {
      const newFavorite = !favorite;
      setFavorite(newFavorite);

      await axios.post(
        `${BASE_URL}/account/${ACCOUNT_ID}/favorite`,
        {
          media_type: mediaType,
          media_id: Number(id),
          favorite: newFavorite,
        },
        {
          params: { api_key: API_KEY, session_id: SESSION_ID },
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      console.log(`Trending ${id} favorite status:`, newFavorite);
    } catch (err) {
      console.error("❌ Failed to update favorite:", err);
      alert("Failed to update favorite. Try again.");
      setFavorite(!favorite); // rollback state jika gagal
    }
  };

  const handleSetRating = (rating) => {
    setUserRating(rating);
    localStorage.setItem(`rating_trending_${id}`, rating.toString());
  };

  const clearRating = () => {
    setUserRating(null);
    localStorage.removeItem(`rating_trending_${id}`);
  };

  if (loading)
    return (
      <div className="flex items-center justify-center min-h-screen bg-slate-900 text-purple-400">
        Loading detail...
      </div>
    );

  if (error)
    return (
      <div className="flex items-center justify-center min-h-screen bg-slate-900">
        <p className="text-red-400">{error}</p>
      </div>
    );

  if (!item)
    return (
      <div className="flex items-center justify-center min-h-screen bg-slate-900">
        <p className="text-gray-400">Data not found</p>
      </div>
    );

  return (
    <DetailTrendingView
      item={item}
      similar={similar}
      cast={cast}
      favorite={favorite}
      toggleFavorite={toggleFavorite}
      userRating={userRating}
      setUserRating={handleSetRating}
      clearRating={clearRating}
      mediaType={mediaType}
    />
  );
};

export default DetailTrending;
