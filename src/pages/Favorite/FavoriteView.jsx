import React, { memo } from "react";

function FavoriteView({
  favorites,
  loading,
  error,
  scrollContainerRef,
  onMovieClick,
}) {
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-slate-900">
        <p className="text-purple-300 animate-pulse">Loading favorites...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-slate-900">
        <p className="text-red-400">{error}</p>
      </div>
    );
  }

  if (!favorites || favorites.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-slate-900">
        <p className="text-gray-400">You don’t have any favorite movies yet.</p>
      </div>
    );
  }

  return (
    <div className="py-8 px-4">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold text-white mb-8 text-center bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-400">
          Your Favorite Movies
        </h1>

        <div className="relative">
          <div
            ref={scrollContainerRef}
            className="flex gap-4 overflow-x-auto pb-4 snap-x snap-mandatory scrollbar-hide"
            style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
          >
            {favorites.map((movie) => (
              <div
                key={movie.id}
                onClick={() => onMovieClick(movie.id)}
                className="flex-shrink-0 w-52 snap-center group/card cursor-pointer"
              >
                <div className="bg-slate-800/40 backdrop-blur-sm rounded-xl overflow-hidden shadow-lg hover:shadow-purple-500/40 transition-all duration-500 hover:scale-105 border border-slate-700/30 hover:border-purple-500/60 relative">
                  <div className="relative h-72 overflow-hidden">
                    <img
                      src={
                        movie.poster_path
                          ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
                          : "/no-image.jpg"
                      }
                      alt={movie.title}
                      className="w-full h-full object-cover group-hover/card:scale-110 transition-transform duration-700"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/70 to-transparent opacity-60 group-hover/card:opacity-95 transition-opacity duration-300"></div>

                    {/* Rating Badge */}
                    {movie.vote_average && (
                      <div className="absolute top-3 right-3 bg-yellow-500/95 backdrop-blur-sm px-2 py-1 rounded-lg flex items-center gap-1 shadow-lg">
                        ⭐
                        <span className="text-white font-bold text-xs">
                          {movie.vote_average.toFixed(1)}
                        </span>
                      </div>
                    )}

                    {/* Default View */}
                    <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-slate-900 to-transparent group-hover/card:opacity-0 transition-opacity duration-300">
                      <h3 className="text-sm font-bold text-white line-clamp-2 mb-1">
                        {movie.title}
                      </h3>
                      <span className="inline-block px-2 py-0.5 bg-purple-500/30 text-purple-200 rounded text-xs border border-purple-500/40">
                        {movie.release_date
                          ? new Date(movie.release_date).getFullYear()
                          : "N/A"}
                      </span>
                    </div>

                    {/* Hover View */}
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
                          : "N/A"}
                      </span>
                      <p className="text-xs text-slate-300 line-clamp-4 leading-relaxed">
                        {movie.overview || "No description available."}
                      </p>
                    </div>
                  </div>
                </div>
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
    </div>
  );
}

export default memo(FavoriteView);
