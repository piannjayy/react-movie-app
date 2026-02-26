import React from 'react';
import { useNavigate } from 'react-router-dom';

const MovieCard = ({
  movie,
  mediaType = 'movie',
  onOpenTrailer,
  onNavigate,
}) => {
  const navigate = useNavigate();

  const handleClick = () => {
    if (onNavigate) {
      onNavigate(movie);
    } else {
      navigate(`/${mediaType}/${movie.id}`);
    }
  };

  const handleTrailerClick = (e) => {
    e.stopPropagation();
    if (onOpenTrailer) {
      onOpenTrailer(movie.videoKey);
    }
  };

  const title = movie.title || movie.name || 'Untitled';
  const originalTitle = movie.original_title || movie.original_name || '';
  const releaseDate = movie.release_date || movie.first_air_date || '';
  const year = releaseDate ? new Date(releaseDate).getFullYear() : 'N/A';
  const rating = movie.vote_average;

  return (
    <div
      className="flex-shrink-0 w-52 snap-center group/card cursor-pointer"
      onClick={handleClick}
    >
      <div className="bg-slate-800/40 backdrop-blur-sm rounded-xl overflow-hidden shadow-lg hover:shadow-purple-500/40 transition-all duration-500 hover:scale-105 border border-slate-700/30 hover:border-purple-500/60 relative flex flex-col">
        <div className="relative h-72 overflow-hidden">
          <img
            src={
              movie.poster_path
                ? 'https://image.tmdb.org/t/p/w500' + movie.poster_path
                : 'https://via.placeholder.com/300x450?text=No+Image'
            }
            alt={title}
            className="w-full h-full object-cover group-hover/card:scale-110 transition-transform duration-700"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/70 to-transparent opacity-60 group-hover/card:opacity-95 transition-opacity duration-300"></div>

          {/* Rating Badge */}
          {rating && (
            <div className="absolute top-3 right-3 bg-yellow-500/95 backdrop-blur-sm px-2 py-1 rounded-lg flex items-center gap-1 shadow-lg">
              <svg
                className="w-3 h-3 text-white"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
              <span className="text-white font-bold text-xs">{rating.toFixed(1)}</span>
            </div>
          )}

          {/* Default View - Title & Year */}
          <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-slate-900 to-transparent group-hover/card:opacity-0 transition-opacity duration-300">
            <h3 className="text-sm font-bold text-white line-clamp-2 mb-1">{title}</h3>
            <span className="inline-block px-2 py-0.5 bg-purple-500/30 text-purple-200 rounded text-xs border border-purple-500/40">
              {year}
            </span>
          </div>

          {/* Hover View - Full Info */}
          <div className="absolute inset-0 p-3 opacity-0 group-hover/card:opacity-100 transition-opacity duration-300 flex flex-col justify-end pointer-events-none">
            <h3 className="text-sm font-bold text-white mb-1 line-clamp-2">{title}</h3>
            {originalTitle && originalTitle !== title && (
              <p className="text-xs text-slate-400 italic mb-2 line-clamp-1">{originalTitle}</p>
            )}
            <span className="inline-block mb-2 px-2 py-0.5 bg-purple-500/30 text-purple-200 rounded text-xs border border-purple-500/40 self-start">
              {year}
            </span>
            <p className="text-xs text-slate-300 line-clamp-4 leading-relaxed">
              {movie.overview || 'No description available.'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MovieCard;
