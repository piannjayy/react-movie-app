import React, { useState, useRef } from "react";
import { Link } from "react-router-dom";
import audioFile from "../../../assets/audio/Fall_For_Eternity.mp3";

const IMG_URL = "https://image.tmdb.org/t/p/w500";
const PLACEHOLDER = "/no-image.jpg";

const DetailMovieView = ({
  movie,
  similar,
  cast,
  favorite,
  toggleFavorite,
  userRating,
  setUserRating,
  clearRating,
  onPlayTrailer,
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef(null);

  if (!movie) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
        <p className="text-white text-xl">Movie not found.</p>
      </div>
    );
  }

  const togglePlay = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Hero Section */}
      <div className="relative h-[500px] overflow-hidden">
        <img
          src={
            movie.backdrop_path ? IMG_URL + movie.backdrop_path : PLACEHOLDER
          }
          alt={movie.original_title}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/80 to-transparent"></div>

        <div className="absolute bottom-0 left-0 right-0 p-8">
          <div className="max-w-7xl mx-auto flex gap-6">
            {/* Poster */}
            <div className="hidden md:block flex-shrink-0">
              <img
                src={
                  movie.poster_path ? IMG_URL + movie.poster_path : PLACEHOLDER
                }
                alt={movie.original_title}
                className="w-64 rounded-xl shadow-2xl border-2 border-purple-500/30"
              />
            </div>

            {/* Info */}
            <div className="flex-grow">
              <h1 className="text-5xl font-bold text-white mb-3 drop-shadow-lg">
                {movie.original_title}
              </h1>

              <p className="text-lg md:text-xl text-gray-200 mb-6 line-clamp-3 max-w-3xl">
                {movie.overview}
              </p>

              <div className="flex items-center gap-4 mb-4 flex-wrap">
                <div className="flex items-center gap-2 bg-yellow-500/90 px-3 py-1.5 rounded-lg">
                  <svg
                    className="w-5 h-5 text-white"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                  <span className="text-white font-bold">
                    {movie.vote_average?.toFixed(1)}
                  </span>
                </div>

                {/* User Rating Input */}
                <div className="flex items-center gap-2 bg-slate-800/50 px-3 py-1.5 rounded-lg border border-slate-700/50">
                  <span className="text-white font-semibold">Your Rating:</span>
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      onClick={() => setUserRating(star)}
                      className={`text-white text-xl ${
                        userRating >= star ? "text-yellow-400" : "text-gray-400"
                      }`}
                      aria-label={`Rate ${star} star${star > 1 ? "s" : ""}`}
                    >
                      ★
                    </button>
                  ))}
                {userRating && (
                  <button
                    onClick={() => clearRating()}
                    className="text-white text-sm bg-red-500 px-2 py-1 rounded ml-2 hover:bg-red-600"
                    aria-label="Clear rating"
                  >
                    ✕
                  </button>
                )}
                </div>

                <span className="px-3 py-1.5 bg-purple-500/30 text-purple-200 rounded-lg border border-purple-500/50 font-semibold">
                  {movie.release_date}
                </span>

                <span className="px-3 py-1.5 bg-slate-800/50 text-slate-200 rounded-lg border border-slate-700/50">
                  {movie.status}
                </span>

                <button
                  onClick={toggleFavorite}
                  className={`px-4 py-1.5 rounded-lg font-semibold transition-all duration-300 ${
                    favorite
                      ? "bg-red-500 text-white hover:bg-red-600"
                      : "bg-slate-800/50 text-slate-200 border border-slate-700/50 hover:border-red-500/50 hover:text-red-400"
                  }`}
                >
                  {favorite ? "❤ Favorited" : "🤍 Add to Favorite"}
                </button>

                {movie.videoKey && (
                  <button
                    onClick={onPlayTrailer}
                    className="px-4 py-1.5 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-semibold transition-all duration-300 flex items-center gap-2"
                  >
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                    </svg>
                    Play Trailer
                  </button>
                )}

                <button
                  onClick={togglePlay}
                  className="px-4 py-1.5 bg-green-600 hover:bg-green-700 text-white rounded-lg font-semibold transition-all duration-300 flex items-center gap-2"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    {isPlaying ? (
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zM7 8a1 1 0 012 0v4a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v4a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                    ) : (
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                    )}
                  </svg>
                  {isPlaying ? "Pause Song" : "Play Song"}
                </button>
              </div>

              <div className="flex flex-wrap gap-2 mb-4">
                {movie.genres?.map((g) => (
                  <span
                    key={g.id}
                    className="px-3 py-1 bg-purple-500/20 text-purple-300 rounded-full text-sm border border-purple-500/30"
                  >
                    {g.name}
                  </span>
                ))}
              </div>

              {movie.seasons && movie.seasons.length > 0 && (
                <div className="mb-4">
                  <span className="text-purple-300 font-semibold">
                    Seasons:
                  </span>{" "}
                  {movie.seasons.length}
                </div>
              )}

              <p className="text-slate-300 text-lg leading-relaxed max-w-3xl">
                {movie.overview}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Movie Details */}
      <div className="max-w-7xl mx-auto px-8 py-8">
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          <div className="bg-slate-800/40 backdrop-blur-sm rounded-xl p-6 border border-slate-700/30">
            <h3 className="text-xl font-bold text-white mb-4">Movie Details</h3>
            <div className="space-y-3 text-slate-300">
              <p>
                <span className="text-purple-400 font-semibold">
                  Popularity:
                </span>{" "}
                {movie.popularity}
              </p>
              <p>
                <span className="text-purple-400 font-semibold">Language:</span>{" "}
                {movie.spoken_languages?.map((l) => l.english_name).join(", ")}
              </p>
              <p>
                <span className="text-purple-400 font-semibold">
                  Production:
                </span>{" "}
                {movie.production_companies?.map((c) => c.name).join(", ")}
              </p>
              {movie.homepage && (
                <a
                  href={movie.homepage}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-block mt-2 text-purple-400 hover:text-purple-300 underline"
                >
                  Visit Official Website →
                </a>
              )}
            </div>
          </div>
        </div>

        {/* Cast */}
        {cast && cast.length > 0 && (
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-white mb-6 bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-400">
              Cast
            </h2>
            <div className="flex gap-4 overflow-x-auto pb-4 snap-x snap-mandatory scrollbar-hide">
              {cast.map((c) => (
                <div
                  key={c.cast_id}
                  className="flex-shrink-0 w-40 snap-center group cursor-pointer"
                >
                  <div className="bg-slate-800/40 backdrop-blur-sm rounded-xl overflow-hidden border border-slate-700/30 hover:border-purple-500/50 transition-all duration-300 hover:scale-105">
                    <div className="relative h-48 overflow-hidden bg-slate-700">
                      <img
                        src={
                          c.profile_path
                            ? IMG_URL + c.profile_path
                            : PLACEHOLDER
                        }
                        alt={c.original_name}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                    </div>
                    <div className="p-3">
                      <h3 className="font-bold text-white text-sm line-clamp-1">
                        {c.original_name}
                      </h3>
                      <p className="text-xs text-purple-300 mb-1">
                        {c.known_for_department}
                      </p>
                      <p className="text-xs text-slate-400 mb-1">
                        Popularity: {c.popularity}
                      </p>
                      <p className="text-xs text-slate-400 line-clamp-1">
                        as {c.character}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Similar Movies */}
        {similar && similar.length > 0 && (
          <div className="mt-8">
            <h2 className="text-3xl font-bold text-white mb-6 bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-400">
              Similar Movies
            </h2>
            <div className="flex gap-4 overflow-x-auto pb-4 snap-x snap-mandatory scrollbar-hide">
              {similar.map((s) => (
                <Link
                  key={s.id}
                  to={`/movie/${s.id}`}
                  className="flex-shrink-0 w-52 snap-center group cursor-pointer"
                >
                  <div
                    className="bg-slate-800/40 backdrop-blur-sm rounded-xl overflow-hidden shadow-lg 
                          hover:shadow-purple-500/40 transition-all duration-500 hover:scale-105 
                          border border-slate-700/30 hover:border-purple-500/60 relative"
                  >
                    {/* Poster */}
                    <div className="relative h-72 overflow-hidden">
                      <img
                        src={
                          s.poster_path ? IMG_URL + s.poster_path : PLACEHOLDER
                        }
                        alt={s.title}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                      />

                      {/* Dark overlay hover */}
                      <div
                        className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 
                              pointer-events-none transition-opacity duration-300"
                      ></div>

                      {/* Bottom title */}
                      <div
                        className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-slate-900 to-transparent 
                              group-hover:opacity-0 pointer-events-none transition-opacity duration-300"
                      >
                        <h3 className="text-sm font-bold text-white line-clamp-2 mb-1">
                          {s.title}
                        </h3>
                        <span className="inline-block mt-1 px-2 py-0.5 bg-yellow-500/70 text-white rounded text-xs">
                          {s.vote_average?.toFixed(1)}
                        </span>
                      </div>

                      {/* Hover overlay */}
                      <div
                        className="absolute inset-0 p-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300 
                              flex flex-col justify-end pointer-events-none"
                      >
                        <h3 className="text-sm font-bold text-white mb-2 line-clamp-2">
                          {s.title}
                        </h3>
                        <p className="text-xs text-slate-300 line-clamp-3 leading-relaxed">
                          {s.overview || "No description available."}
                        </p>
                        <span className="mt-1 inline-block px-2 py-0.5 bg-yellow-500/70 text-white rounded text-xs">
                          Vote: {s.vote_average?.toFixed(1)}
                        </span>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Hidden Audio Element */}
      <audio ref={audioRef} src={audioFile} preload="none" />
    </div>
  );
};

export default DetailMovieView;
