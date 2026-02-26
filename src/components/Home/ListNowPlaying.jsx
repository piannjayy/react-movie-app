import React, { useEffect, useReducer, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import TrailerModal from '../TrailerModal';

const initialState = {
  movies: [],
  loading: false,
  error: null,
};

const reducer = (state, action) => {
  switch (action.type) {
    case 'FETCH_REQUEST':
      return { ...state, loading: true, error: null };
    case 'FETCH_SUCCESS':
      return { ...state, loading: false, movies: action.payload };
    case 'FETCH_FAILURE':
      return { ...state, loading: false, error: action.payload };
    default:
      return state;
  }
};

const ListNowPlaying = () => {
  const [state, dispatch] = useReducer(reducer, initialState);
  const scrollContainerRef = useRef(null);
  const navigate = useNavigate();

  const [trailerOpen, setTrailerOpen] = useState(false);
  const [selectedVideoKey, setSelectedVideoKey] = useState(null);
  const [clickTimeout, setClickTimeout] = useState(null);

  useEffect(() => {
    const fetchNowPlayingMovies = async () => {
      dispatch({ type: 'FETCH_REQUEST' });
      try {
        const response = await fetch(
          'https://api.themoviedb.org/3/movie/now_playing?api_key=28fd68f4af938f0570807ba705fd2aba'
        );
        if (!response.ok) {
          throw new Error('Failed to fetch now playing movies');
        }
        const data = await response.json();

        // Fetch videos for each movie to get videoKey
        const moviesWithVideos = await Promise.all(data.results.map(async (movie) => {
          const videoResponse = await fetch(
            `https://api.themoviedb.org/3/movie/${movie.id}/videos?api_key=28fd68f4af938f0570807ba705fd2aba`
          );
          const videoData = await videoResponse.json();
          const trailer = videoData.results.find(
            video => video.type === 'Trailer' && video.site === 'YouTube'
          ) || videoData.results.find(
            video => video.type === 'Teaser' && video.site === 'YouTube'
          ) || videoData.results[0];
          return {
            ...movie,
            videoKey: trailer?.key || null
          };
        }));

        dispatch({ type: 'FETCH_SUCCESS', payload: moviesWithVideos });
      } catch (error) {
        dispatch({ type: 'FETCH_FAILURE', payload: error.message });
      }
    };
    fetchNowPlayingMovies();
  }, []);

  const handleCloseTrailer = () => {
    setTrailerOpen(false);
    setSelectedVideoKey(null);
  };

  const { movies, loading, error } = state;

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-purple-500 border-t-transparent"></div>
          <p className="mt-4 text-purple-200 text-lg">Loading now playing movies...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
        <div className="bg-red-500/10 border border-red-500/50 rounded-lg p-6 max-w-md">
          <p className="text-red-400">Error loading movies: {error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="py-4 px-4">
      <div className="max-w-7xl mx-auto">
        <p className="text-4xl font-bold text-white mb-4 text-left bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-400">
          Now Playing Movies
        </p>

        <div className="relative">
          {/* Scrollable Container */}
          <div
            ref={scrollContainerRef}
            className="flex gap-2 overflow-x-auto pb-4 snap-x snap-mandatory scrollbar-hide"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            {movies.map((movie) => (
              <div
                key={movie.id}
                className="flex-shrink-0 w-52 snap-center group/card cursor-pointer"
              >
                <div
                onClick={() => {
                  if (clickTimeout) {
                    clearTimeout(clickTimeout);
                    setClickTimeout(null);
                    navigate(`/movie/${movie.id}`);
                  } else {
                    const timeout = setTimeout(() => {
                      setSelectedVideoKey(movie.videoKey);
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
                      src={'https://image.tmdb.org/t/p/w500' + movie.poster_path}
                      alt={movie.title}
                      className="w-full h-full object-cover group-hover/card:scale-110 transition-transform duration-700"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/70 to-transparent opacity-60 group-hover/card:opacity-95 transition-opacity duration-300"></div>

                    {/* Rating Badge */}
                    {movie.vote_average && (
                      <div className="absolute top-3 right-3 bg-yellow-500/95 backdrop-blur-sm px-2 py-1 rounded-lg flex items-center gap-1 shadow-lg">
                        <svg
                          className="w-3 h-3 text-white"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                        <span className="text-white font-bold text-xs">
                          {movie.vote_average.toFixed(1)}
                        </span>
                      </div>
                    )}

                    {/* Default View - Title & Year */}
                    <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-slate-900 to-transparent group-hover/card:opacity-0 transition-opacity duration-300">
                      <h3 className="text-sm font-bold text-white line-clamp-2 mb-1">
                        {movie.title}
                      </h3>
                      <span className="inline-block px-2 py-0.5 bg-purple-500/30 text-purple-200 rounded text-xs border border-purple-500/40">
                        {movie.release_date
                          ? new Date(movie.release_date).getFullYear()
                          : 'N/A'}
                      </span>
                    </div>

                    {/* Hover View - Full Info */}
                    <div className="absolute inset-0 p-3 opacity-0 group-hover/card:opacity-100 transition-opacity duration-300 flex flex-col justify-end pointer-events-none">
                      <h3 className="text-sm font-bold text-white mb-1 line-clamp-2">
                        {movie.title}
                      </h3>

                      {movie.original_title !== movie.title && (
                        <p className="text-xs text-slate-400 italic mb-2 line-clamp-1">
                          {movie.original_title}
                        </p>
                      )}

                      <span className="inline-block mb-2 px-2 py-0.5 bg-purple-500/30 text-purple-200 rounded text-xs border border-purple-500/40 self-start">
                        {movie.release_date
                          ? new Date(movie.release_date).getFullYear()
                          : 'N/A'}
                      </span>

                      <p className="text-xs text-slate-300 line-clamp-4 leading-relaxed">
                        {movie.overview || 'No description available.'}
                      </p>
                    </div>
                  </div>
                </div>
              {movie.videoKey && (
                // Remove the separate Play Trailer button since single click opens trailer
                null
              )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ✅ ganti style jsx → style biasa */}
      <style>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
      `}</style>

      <TrailerModal isOpen={trailerOpen} onClose={handleCloseTrailer} videoKey={selectedVideoKey} />
    </div>
  );
};

export default ListNowPlaying;
