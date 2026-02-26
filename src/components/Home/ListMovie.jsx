import React, { useEffect, useRef, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { fetchMovies, fetchGenres, setSelectedGenre, setCurrentPage } from '../../reducer/movieSlice';
import TrailerModal from '../TrailerModal';
import MovieCard from './MovieCard';

const ListMovie = () => {
  const dispatch = useDispatch();
  const { movies, genres, selectedGenre, currentPage, totalPages, loading, error } = useSelector((state) => state.movies);
  const navigate = useNavigate();

  const scrollContainerRef = useRef(null);
  const [trailerOpen, setTrailerOpen] = useState(false);
  const [selectedVideoKey, setSelectedVideoKey] = useState(null);
  const [clickTimeout, setClickTimeout] = useState(null);

  useEffect(() => {
    dispatch(fetchGenres());
  }, [dispatch]);

  useEffect(() => {
    dispatch(fetchMovies({ genre: selectedGenre, page: currentPage }));
  }, [dispatch, selectedGenre, currentPage]);

  const handleCloseTrailer = () => {
    setTrailerOpen(false);
    setSelectedVideoKey(null);
  };

  const handleOpenTrailer = (videoKey) => {
    setSelectedVideoKey(videoKey);
    setTrailerOpen(true);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-purple-900 via-pink-900 to-purple-900">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-pink-500 border-t-transparent"></div>
          <p className="mt-4 text-pink-300 text-lg font-semibold">Loading movies...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-purple-900 via-pink-900 to-purple-900">
        <div className="bg-red-600/20 border border-red-600 rounded-lg p-6 max-w-md shadow-lg">
          <p className="text-red-400 font-semibold text-center">Error loading movies: {error.message || error}</p>
        </div>
      </div>
    );
  }

  return (
    <React.Fragment>
      <div className="py-4 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-4xl font-bold text-white mb-4 text-left bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-400">
            Popular Movies
          </div>

          {/* Genre Filter */}
          <div className="flex flex-wrap gap-2 mb-4">
            <button
              onClick={() => dispatch(setSelectedGenre(''))}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                selectedGenre === ''
                  ? 'bg-purple-600 text-white'
                  : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
              }`}
            >
              All Genres
            </button>
            {genres.map((genre) => (
              <button
                key={genre.id}
                onClick={() => dispatch(setSelectedGenre(genre.id.toString()))}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  selectedGenre === genre.id.toString()
                    ? 'bg-purple-600 text-white'
                    : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                }`}
              >
                {genre.name}
              </button>
            ))}
          </div>

          <div className="relative">
            <div
              ref={scrollContainerRef}
              className="flex gap-2 overflow-x-auto pb-4 snap-x snap-mandatory scrollbar-hide"
              style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
            >
              {movies.map((movie) => (
                <MovieCard
                  key={movie.id}
                  movie={movie}
                  onOpenTrailer={handleOpenTrailer}
                  onNavigate={() => navigate(`/movie/${movie.id}`)}
                />
              ))}
            </div>
          </div>

          {/* Pagination moved below the movie cards */}
          <div className="flex justify-center items-center gap-2 mt-4">
            <button
              onClick={() => dispatch(setCurrentPage(Math.max(1, currentPage - 1)))}
              disabled={currentPage === 1}
              className="px-4 py-2 bg-slate-700 text-slate-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-600 transition-all"
            >
              Previous
            </button>
            <span className="text-white">
              Page {currentPage} of {totalPages}
            </span>
            <button
              onClick={() => dispatch(setCurrentPage(Math.min(totalPages, currentPage + 1)))}
              disabled={currentPage === totalPages}
              className="px-4 py-2 bg-slate-700 text-slate-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-600 transition-all"
            >
              Next
            </button>
          </div>
        </div>
      </div>

      <TrailerModal isOpen={trailerOpen} onClose={handleCloseTrailer} videoKey={selectedVideoKey} />
    </React.Fragment>
  );
};

export default ListMovie;
