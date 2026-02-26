import { useReducer, useEffect, useState, useRef } from "react";
import { Info, Play, ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";
import TrailerModal from "./TrailerModal";
import { useSound } from "../context/SoundContext";

const initialState = {
  movies: [],
  currentIndex: 0,
  loading: true,
  error: false,
};

function videoReducer(state, action) {
  switch (action.type) {
    case "SET_MOVIES":
      return {
        ...state,
        movies: action.payload,
        loading: false,
      };
    case "SET_ERROR":
      return { ...state, error: true, loading: false };
    case "NEXT_VIDEO":
      return {
        ...state,
        currentIndex: (state.currentIndex + 1) % state.movies.length,
      };
    case "PREV_VIDEO":
      return {
        ...state,
        currentIndex:
          state.currentIndex === 0
            ? state.movies.length - 1
            : state.currentIndex - 1,
      };
    case "SET_INDEX":
      return {
        ...state,
        currentIndex: action.payload,
      };
    default:
      return state;
  }
}

export default function HeroVideo() {
  const [state, dispatch] = useReducer(videoReducer, initialState);
  const [trailerOpen, setTrailerOpen] = useState(false);
  const [selectedVideoKey, setSelectedVideoKey] = useState(null);
  const { trailerMuted, toggleTrailerSound } = useSound();
  const playerRef = useRef(null);
  const [ytApiReady, setYtApiReady] = useState(false);

  const currentMovie = state.movies[state.currentIndex];

  // Ambil API key dari environment variable
  const TMDB_API_KEY = import.meta.env.VITE_KEY_TMDB;

  // Array ID film yang akan ditampilkan
  const MOVIE_IDS = [550, 27205, 299536, 122]; // Fight Club, Inception, Avengers Infinity War, The Lord of the Rings

  useEffect(() => {
    fetchMovies();
  }, []);

  // Auto slide setiap 1 menit
  useEffect(() => {
    if (state.movies.length > 0) {
      const interval = setInterval(() => {
        dispatch({ type: "NEXT_VIDEO" });
      }, 60000);

      return () => clearInterval(interval);
    }
  }, [state.movies.length]);

  // Load YouTube API
  useEffect(() => {
    if (!window.YT) {
      window.onYouTubeIframeAPIReady = () => {
        setYtApiReady(true);
      };
      const script = document.createElement('script');
      script.src = 'https://www.youtube.com/iframe_api';
      script.async = true;
      document.body.appendChild(script);
    } else {
      setYtApiReady(true);
    }
  }, []);

  // Create player when currentMovie changes and API is ready
  useEffect(() => {
    if (currentMovie && currentMovie.videoKey && ytApiReady && window.YT && window.YT.Player) {
      if (playerRef.current) {
        playerRef.current.destroy();
      }
      playerRef.current = new window.YT.Player(`player-${currentMovie.id}`, {
        videoId: currentMovie.videoKey,
        playerVars: {
          autoplay: 1,
          controls: 0,
          showinfo: 0,
          rel: 0,
          playsinline: 1,
          enablejsapi: 1,
          mute: 1,
        },
        events: {
          onReady: (event) => {
            if (!trailerMuted) {
              event.target.unMute();
            }
          },
        },
      });
    }
  }, [currentMovie, ytApiReady]);

  // Handle mute toggle
  useEffect(() => {
    if (playerRef.current && playerRef.current.mute && playerRef.current.unMute) {
      if (trailerMuted) {
        playerRef.current.mute();
      } else {
        playerRef.current.unMute();
      }
    }
  }, [trailerMuted]);

  const fetchMovies = async () => {
    try {
      const headers = {
        Authorization: `Bearer ${TMDB_API_KEY}`,
        "Content-Type": "application/json",
      };

      const moviePromises = MOVIE_IDS.map(async (id) => {
        // Fetch movie details
        const movieResponse = await fetch(
          `https://api.themoviedb.org/3/movie/${id}`,
          { headers }
        );
        const movieData = await movieResponse.json();

        // Fetch movie videos
        const videoResponse = await fetch(
          `https://api.themoviedb.org/3/movie/${id}/videos`,
          { headers }
        );
        const videoData = await videoResponse.json();

        // Cari trailer
        const trailer =
          videoData.results.find(
            (video) => video.type === "Trailer" && video.site === "YouTube"
          ) ||
          videoData.results.find(
            (video) => video.type === "Teaser" && video.site === "YouTube"
          ) ||
          videoData.results[0];

        return {
          ...movieData,
          videoKey: trailer?.key || null,
        };
      });

      const moviesData = await Promise.all(moviePromises);
      dispatch({
        type: "SET_MOVIES",
        payload: moviesData.filter((m) => m.videoKey),
      });
    } catch (error) {
      console.error("Error fetching movies:", error);
      dispatch({ type: "SET_ERROR" });
    }
  };

  const handleClickDetail = (movieId) => {
    const movie = state.movies.find((m) => m.id === movieId);
    if (movie && movie.videoKey) {
      setSelectedVideoKey(movie.videoKey);
      setTrailerOpen(true);
    }
  };

  const handleCloseTrailer = () => {
    setTrailerOpen(false);
    setSelectedVideoKey(null);
  };

  const handleDotClick = (index, e) => {
    e.stopPropagation();
    dispatch({ type: "SET_INDEX", payload: index });
  };

  if (state.loading) {
    return (
      <div className="w-full h-screen bg-black flex items-center justify-center">
        <div className="animate-pulse">
          <div className="w-16 h-16 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
        </div>
      </div>
    );
  }

  if (state.error || state.movies.length === 0) {
    return (
      <div className="w-full h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <p className="text-white text-xl mb-2">Error loading movies</p>
          <p className="text-gray-400">Please check your API key</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <div
        className="relative w-full h-screen bg-black overflow-hidden cursor-pointer group"
        onClick={() => handleClickDetail(currentMovie.id)}
      >
        {/* YouTube Video Background - Autoplay */}
        {currentMovie.videoKey && (
          <div
            id={`player-${currentMovie.id}`}
            className="absolute top-1/2 left-1/2 w-screen h-screen"
            style={{
              transform: "translate(-50%, -50%) scale(1.5)",
              minWidth: "100vw",
              minHeight: "100vh",
            }}
          />
        )}

        {/* Sound Toggle Button on Background */}
  <button
    onClick={(e) => {
      e.stopPropagation();
      toggleTrailerSound();
    }}
    aria-label={trailerMuted ? "Unmute Sound" : "Mute Sound"}
    title={trailerMuted ? "Unmute Sound" : "Mute Sound"}
    className="absolute bottom-4 right-4 z-50 p-2 rounded-full bg-black bg-opacity-50 text-white hover:bg-opacity-75 transition"
  >
    {trailerMuted ? (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-6 w-6"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={2}
      >
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 5L4 9H2v6h2l5 4V5z" />
        <line x1="18" y1="6" x2="6" y2="18" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ) : (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-6 w-6"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={2}
      >
        <path strokeLinecap="round" strokeLinejoin="round" d="M11 5L6 9H2v6h4l5 4V5z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M15.54 8.46a5 5 0 010 7.07" />
      </svg>
    )}
  </button>

        {/* Backdrop Image Fallback */}
        {!currentMovie.videoKey && currentMovie.backdrop_path && (
          <img
            key={`backdrop-${currentMovie.id}`}
            src={`https://image.tmdb.org/t/p/original${currentMovie.backdrop_path}`}
            alt={currentMovie.title}
            className="absolute top-0 left-0 w-full h-full object-cover"
          />
        )}

        {/* Overlay Gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent" />

        {/* Hover Overlay */}
        <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

        {/* Content Container */}
        <div className="relative z-10 h-full flex flex-col justify-end p-8 md:p-16">
          {/* Movie Info */}
          <div className="max-w-4xl">
            <h1 className="text-5xl md:text-7xl font-bold text-white mb-4 transform group-hover:scale-105 transition-transform duration-300">
              {currentMovie.title}
            </h1>

            <p className="text-lg md:text-xl text-gray-200 mb-6 line-clamp-3 max-w-3xl">
              {currentMovie.overview}
            </p>

            {/* Movie Meta */}
            <div className="flex items-center gap-4 text-gray-300 mb-8 flex-wrap">
              {currentMovie.vote_average && (
                <span className="bg-yellow-500 text-black px-3 py-1 rounded font-bold text-sm">
                  ⭐ {currentMovie.vote_average.toFixed(1)}
                </span>
              )}
              {currentMovie.release_date && (
                <span className="font-semibold">
                  {new Date(currentMovie.release_date).getFullYear()}
                </span>
              )}
              {currentMovie.genres && currentMovie.genres.length > 0 && (
                <>
                  <span>•</span>
                  <span>
                    {currentMovie.genres
                      .slice(0, 3)
                      .map((g) => g.name)
                      .join(", ")}
                  </span>
                </>
              )}
              {currentMovie.runtime && (
                <>
                  <span>•</span>
                  <span>{currentMovie.runtime} min</span>
                </>
              )}
            </div>

            {/* Click Info */}
            <div className="flex items-center gap-3 text-white bg-white/10 backdrop-blur-sm px-6 py-3 rounded-lg w-fit group-hover:bg-white/20 transition-all duration-300">
              <Info className="w-5 h-5" />
              <Link to={`/movie/${currentMovie.id}`} className="font-medium">
                Click to see details
              </Link>
              <ChevronRight className="w-5 h-5 transform group-hover:translate-x-2 transition-transform duration-300" />
            </div>
          </div>

          {/* Dots Navigation */}
          <div className="flex items-center gap-3 mt-8">
            {state.movies.map((movie, index) => (
              <button
                key={movie.id}
                onClick={(e) => handleDotClick(index, e)}
                className={`h-1 rounded-full transition-all duration-300 ${
                  index === state.currentIndex
                    ? "w-12 bg-white"
                    : "w-8 bg-white/50 hover:bg-white/70"
                }`}
                aria-label={`Go to video ${index + 1}`}
              />
            ))}
          </div>
        </div>

        {/* Playing Indicator */}
        <div className="absolute top-8 right-8 flex items-center gap-2 bg-red-600 text-white px-4 py-2 rounded-full text-sm font-semibold">
          <Play className="w-4 h-4" fill="currentColor" />
          <span>
            Now Playing {state.currentIndex + 1}/{state.movies.length}
          </span>
        </div>
      </div>
      <TrailerModal
        isOpen={trailerOpen}
        onClose={handleCloseTrailer}
        videoKey={selectedVideoKey}
      />
    </>
  );
}
