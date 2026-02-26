import React, { useEffect, useRef, useReducer, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import TrailerModal from '../TrailerModal';

const API_KEY = "28fd68f4af938f0570807ba705fd2aba";

const initialState = {
  trending: [],
  loading: true,
  error: null,
  mediaType: "all", // all | movie | tv
  timeWindow: "day", // day | week
};

const reducer = (state, action) => {
  switch (action.type) {
    case 'SET_TRENDING':
      return { ...state, trending: action.payload, loading: false, error: null };
    case 'SET_LOADING':
      return { ...state, loading: true, error: null };
    case 'SET_ERROR':
      return { ...state, loading: false, error: action.payload };
    case 'SET_MEDIA_TYPE':
      return { ...state, mediaType: action.payload };
    case 'SET_TIME_WINDOW':
      return { ...state, timeWindow: action.payload };
    default:
      return state;
  }
};

const ListTrending = () => {
  const [state, dispatch] = useReducer(reducer, initialState);
  const { trending, loading, error, mediaType, timeWindow } = state;

  const scrollContainerRef = useRef(null);
  const navigate = useNavigate();

  const [trailerOpen, setTrailerOpen] = useState(false);
  const [selectedVideoKey, setSelectedVideoKey] = useState(null);
  const [clickTimeout, setClickTimeout] = useState(null);

  useEffect(() => {
    const fetchTrending = async () => {
      dispatch({ type: 'SET_LOADING' });
      try {
        const res = await axios.get(
          `https://api.themoviedb.org/3/trending/${state.mediaType}/${state.timeWindow}?api_key=${API_KEY}&language=en-US`
        );

        // Fetch videos for each trending item to get videoKey
        const trendingWithVideos = await Promise.all(res.data.results.map(async (item) => {
          const videoResponse = await axios.get(
            `https://api.themoviedb.org/3/${item.media_type}/${item.id}/videos?api_key=${API_KEY}&language=en-US`
          );
          const videoData = videoResponse.data;
          const trailer = videoData.results.find(
            video => video.type === 'Trailer' && video.site === 'YouTube'
          ) || videoData.results.find(
            video => video.type === 'Teaser' && video.site === 'YouTube'
          ) || videoData.results[0];
          return {
            ...item,
            videoKey: trailer?.key || null
          };
        }));

        dispatch({ type: 'SET_TRENDING', payload: trendingWithVideos });
      } catch (err) {
        console.error("❌ Error fetching trending:", err);
        dispatch({ type: 'SET_ERROR', payload: "Failed to load trending movies." });
      }
    };

    fetchTrending();
  }, [state.mediaType, state.timeWindow]);

  const handleCloseTrailer = () => {
    setTrailerOpen(false);
    setSelectedVideoKey(null);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-purple-900 via-pink-900 to-purple-900">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-pink-500 border-t-transparent"></div>
          <p className="mt-4 text-pink-300 text-lg font-semibold">Loading trending...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-purple-900 via-pink-900 to-purple-900">
        <div className="bg-red-600/20 border border-red-600 rounded-lg p-6 max-w-md shadow-lg">
          <p className="text-red-400 font-semibold text-center">Error: {error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="py-4 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="text-4xl font-bold text-white mb-4 text-left bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-400">
          🔥 Trending Now
        </div>

        {/* Filter Tombol */}
        <div className="flex flex-wrap justify-center gap-3 mb-4">
          {/* MediaType */}
          {["all", "movie", "tv"].map((type) => (
            <button
              key={type}
              onClick={() => dispatch({ type: 'SET_MEDIA_TYPE', payload: type })}
              className={`px-4 py-2 rounded-xl text-sm font-semibold border transition-all duration-300 ${
                mediaType === type
                  ? "bg-purple-600 text-white border-purple-400 shadow-lg scale-105"
                  : "bg-slate-800 text-slate-300 border-slate-600 hover:bg-slate-700"
              }`}
            >
              {type === "all" ? "All" : type === "movie" ? "Movies" : "TV Shows"}
            </button>
          ))}

          {/* TimeWindow */}
          {["day", "week"].map((time) => (
            <button
              key={time}
              onClick={() => dispatch({ type: 'SET_TIME_WINDOW', payload: time })}
              className={`px-4 py-2 rounded-xl text-sm font-semibold border transition-all duration-300 ${
                timeWindow === time
                  ? "bg-pink-600 text-white border-pink-400 shadow-lg scale-105"
                  : "bg-slate-800 text-slate-300 border-slate-600 hover:bg-slate-700"
              }`}
            >
              {time === "day" ? "Today" : "This Week"}
            </button>
          ))}
        </div>

        {/* Cards */}
        <div className="relative">
          <div
            ref={scrollContainerRef}
            className="flex gap-2 overflow-x-auto pb-4 snap-x snap-mandatory scrollbar-hide"
            style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
          >
            {trending.map((item) => (
              <div
                key={item.id}
                className="flex-shrink-0 w-52 snap-center group/card cursor-pointer"
              >
                <div
                  onClick={() => {
                    if (clickTimeout) {
                      clearTimeout(clickTimeout);
                      setClickTimeout(null);
                      navigate(`/trending/${item.media_type}/${item.id}`);
                    } else {
                      const timeout = setTimeout(() => {
                        setSelectedVideoKey(item.videoKey);
                        setTrailerOpen(true);
                        setClickTimeout(null);
                      }, 250);
                      setClickTimeout(timeout);
                    }
                  }}
                  className="bg-slate-800/40 backdrop-blur-sm rounded-xl overflow-hidden shadow-lg hover:shadow-purple-500/40 transition-all duration-500 hover:scale-105 border border-slate-700/30 hover:border-purple-500/60 relative"
                >
                  <div className="relative h-72 overflow-hidden">
                    <img
                      src={
                        item.poster_path
                          ? "https://image.tmdb.org/t/p/w500" + item.poster_path
                          : "https://via.placeholder.com/300x450?text=No+Image"
                      }
                      alt={item.title || item.name}
                      className="w-full h-full object-cover group-hover/card:scale-110 transition-transform duration-700"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/70 to-transparent opacity-60 group-hover/card:opacity-95 transition-opacity duration-300"></div>

                    {/* Rating */}
                    {item.vote_average && (
                      <div className="absolute top-3 right-3 bg-yellow-500/95 backdrop-blur-sm px-2 py-1 rounded-lg flex items-center gap-1 shadow-lg">
                        <svg
                          className="w-3 h-3 text-white"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                        <span className="text-white font-bold text-xs">
                          {item.vote_average.toFixed(1)}
                        </span>
                      </div>
                    )}

                    {/* Default View */}
                    <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-slate-900 to-transparent group-hover/card:opacity-0 transition-opacity duration-300">
                      <h3 className="text-sm font-bold text-white line-clamp-2 mb-1">
                        {item.title || item.name}
                      </h3>
                      <span className="inline-block px-2 py-0.5 bg-purple-500/30 text-purple-200 rounded text-xs border border-purple-500/40">
                        {item.release_date
                          ? new Date(item.release_date).getFullYear()
                          : item.first_air_date
                          ? new Date(item.first_air_date).getFullYear()
                          : "N/A"}
                      </span>
                    </div>

                    {/* Hover View */}
                    <div className="absolute inset-0 p-3 opacity-0 group-hover/card:opacity-100 transition-opacity duration-300 flex flex-col justify-end pointer-events-none">
                      <h3 className="text-sm font-bold text-white mb-1 line-clamp-2">
                        {item.title || item.name}
                      </h3>
                      <span className="inline-block mb-2 px-2 py-0.5 bg-purple-500/30 text-purple-200 rounded text-xs border border-purple-500/40 self-start">
                        {item.release_date
                          ? new Date(item.release_date).getFullYear()
                          : item.first_air_date
                          ? new Date(item.first_air_date).getFullYear()
                          : "N/A"}
                      </span>
                      <p className="text-xs text-slate-300 line-clamp-4 leading-relaxed">
                        {item.overview || "No description available."}
                      </p>
                    </div>
                  </div>
                </div>
                {item.videoKey && (
                  // Remove the separate Play Trailer button since single click opens trailer
                  null
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      <style>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
      `}</style>

      <TrailerModal isOpen={trailerOpen} onClose={handleCloseTrailer} videoKey={selectedVideoKey} />
    </div>
  );
};

export default ListTrending;
