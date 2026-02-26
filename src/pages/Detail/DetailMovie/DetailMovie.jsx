import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import DetailMovieView from "./DetailMovieView";
import TrailerModal from "../../../components/TrailerModal";

const API_KEY = "28fd68f4af938f0570807ba705fd2aba";
const BASE_URL = "https://api.themoviedb.org/3";
const SESSION_ID = "e2484df3f0cb523723d320daf44fcf0490a41cd9";
const ACCOUNT_ID = "22353090";

const DetailMovie = () => {
  const { id } = useParams();
  const [movie, setMovie] = useState(null);
  const [similar, setSimilar] = useState([]);
  const [cast, setCast] = useState([]);
  const [favorite, setFavorite] = useState(false);
  const [userRating, setUserRating] = useState(() => {
    const saved = localStorage.getItem(`rating_${id}`);
    return saved ? parseFloat(saved) : null;
  });

  const [trailerOpen, setTrailerOpen] = useState(false);
  const [selectedVideoKey, setSelectedVideoKey] = useState(null);

  // Reset rating when id changes
  useEffect(() => {
    const saved = localStorage.getItem(`rating_${id}`);
    setUserRating(saved ? parseFloat(saved) : null);
  }, [id]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // ================== Fetch Data ==================
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);

      try {
        const [movieRes, similarRes, castRes, videoRes] = await Promise.all([
          axios.get(`${BASE_URL}/movie/${id}?api_key=${API_KEY}&language=en-US`),
          axios.get(`${BASE_URL}/movie/${id}/similar?api_key=${API_KEY}&language=en-US`),
          axios.get(`${BASE_URL}/movie/${id}/credits?api_key=${API_KEY}&language=en-US`),
          axios.get(`${BASE_URL}/movie/${id}/videos?api_key=${API_KEY}&language=en-US`),
        ]);

        // Find trailer video
        const videoData = videoRes.data;
        const trailer = videoData.results.find(
          video => video.type === 'Trailer' && video.site === 'YouTube'
        ) || videoData.results.find(
          video => video.type === 'Teaser' && video.site === 'YouTube'
        ) || videoData.results[0];

        const movieWithTrailer = {
          ...movieRes.data,
          videoKey: trailer?.key || null
        };

        setMovie(movieWithTrailer);
        setSimilar(similarRes.data.results || []);
        setCast(castRes.data.cast || []);

        // Cek favorite status user untuk movie ini
        if (ACCOUNT_ID && SESSION_ID) {
          try {
            const favRes = await axios.get(
              `${BASE_URL}/account/${ACCOUNT_ID}/favorite/movies`,
              {
                params: { api_key: API_KEY, session_id: SESSION_ID },
              }
            );
            const isFav = favRes.data.results.some((m) => m.id === movieRes.data.id);
            setFavorite(isFav);
          } catch (favErr) {
            console.error("Failed to fetch favorite status:", favErr);
            setFavorite(false);
          }
        }

      } catch (err) {
        console.error("❌ Error fetching movie data:", err);
        setError("Failed to load movie data. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchData();
  }, [id]);

  // ================== Favorite Toggle ==================
  const toggleFavorite = async () => {
    try {
      const newFavorite = !favorite;
      setFavorite(newFavorite);

      await axios.post(
        `${BASE_URL}/account/${ACCOUNT_ID}/favorite`,
        {
          media_type: "movie",
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

      console.log(`Movie ${id} favorite status:`, newFavorite);
    } catch (err) {
      console.error("❌ Failed to update favorite:", err);
      alert("Failed to update favorite. Try again.");
      setFavorite(!favorite); // rollback state jika gagal
    }
  };

  // ================== Rating Handler ==================
  const handleSetRating = (rating) => {
    setUserRating(rating);
    localStorage.setItem(`rating_${id}`, rating.toString());
  };

  const clearRating = () => {
    setUserRating(null);
    localStorage.removeItem(`rating_${id}`);
  };

  // ================== Trailer Handler ==================
  const handlePlayTrailer = () => {
    if (movie?.videoKey) {
      setSelectedVideoKey(movie.videoKey);
      setTrailerOpen(true);
    }
  };

  const handleCloseTrailer = () => {
    setTrailerOpen(false);
    setSelectedVideoKey(null);
  };

  // ================== UI Handling ==================
  if (loading) return <div className="flex items-center justify-center min-h-screen bg-slate-900 text-purple-400">Loading movie detail...</div>;
  if (error) return <div className="flex items-center justify-center min-h-screen bg-slate-900"><p className="text-red-400">{error}</p></div>;
  if (!movie) return <div className="flex items-center justify-center min-h-screen bg-slate-900"><p className="text-gray-400">Movie not found.</p></div>;

  return (
    <>
      <DetailMovieView
        movie={movie}
        similar={similar}
        cast={cast}
        favorite={favorite}
        toggleFavorite={toggleFavorite}
        userRating={userRating}
        setUserRating={handleSetRating}
        clearRating={clearRating}
        onPlayTrailer={handlePlayTrailer}
      />
      <TrailerModal isOpen={trailerOpen} onClose={handleCloseTrailer} videoKey={selectedVideoKey} />
    </>
  );
};

export default DetailMovie;
