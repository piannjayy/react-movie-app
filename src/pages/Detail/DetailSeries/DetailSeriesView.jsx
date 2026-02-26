import React, { useEffect } from "react";
import { Link } from "react-router-dom";

const IMG_BASE = "https://image.tmdb.org/t/p/w500";
const PLACEHOLDER = "https://via.placeholder.com/500x750?text=No+Image";

const DetailSeriesView = ({ series, similar, cast, favorite, toggleFavorite, userRating, setUserRating, clearRating }) => {
  useEffect(() => {
    console.log("📌 Series Data:", series);
    console.log("📌 Similar Data:", similar);
    console.log("📌 Cast Data:", cast);
  }, [series, similar, cast]);

  if (!series)
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
        <p className="text-white text-xl">Series not found.</p>
      </div>
    );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Hero Section */}
      <div className="relative h-[500px] overflow-hidden">
        <img
          src={series.backdrop_path ? IMG_BASE + series.backdrop_path : PLACEHOLDER}
          alt={series.name}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/80 to-transparent"></div>

        {/* Overlay Info */}
        <div className="absolute bottom-0 left-0 right-0 p-8">
          <div className="max-w-7xl mx-auto flex gap-6">
            {/* Poster */}
            <div className="hidden md:block flex-shrink-0">
              <img
                src={series.poster_path ? IMG_BASE + series.poster_path : PLACEHOLDER}
                alt={series.name}
                className="w-64 rounded-xl shadow-2xl border-2 border-purple-500/30"
              />
            </div>

            {/* Info */}
            <div className="flex-grow">
              <h1 className="text-5xl font-bold text-white mb-3 drop-shadow-lg">{series.name}</h1>
              {series.tagline && (
                <p className="text-xl text-purple-200 italic mb-4">{series.tagline}</p>
              )}

              <div className="flex items-center gap-4 mb-4 flex-wrap">
                <div className="flex items-center gap-2 bg-yellow-500/90 px-3 py-1.5 rounded-lg">
                  ⭐ <span className="text-white font-bold">{series.vote_average?.toFixed(1)}</span>
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
                  {series.first_air_date}
                </span>

                <span className="px-3 py-1.5 bg-slate-800/50 text-slate-200 rounded-lg border border-slate-700/50">
                  {series.status}
                </span>

                <span className="px-3 py-1.5 bg-slate-800/50 text-slate-200 rounded-lg border border-slate-700/50">
                  {series.number_of_seasons} Seasons • {series.number_of_episodes} Episodes
                </span>

                <button
                  onClick={toggleFavorite}
                  className={`px-4 py-1.5 rounded-lg font-semibold transition-all duration-300 ${
                    favorite
                      ? "bg-red-500 text-white hover:bg-red-600"
                      : "bg-slate-800/50 text-slate-200 border border-slate-700/50 hover:border-red-500/50 hover:text-red-400"
                  }`}
                >
                  {favorite ? "❤️ Favorited" : "🤍 Add to Favorite"}
                </button>
              </div>

              <div className="flex flex-wrap gap-2 mb-4">
                {series.genres?.map((g) => (
                  <span
                    key={g.id}
                    className="px-3 py-1 bg-purple-500/20 text-purple-300 rounded-full text-sm border border-purple-500/30"
                  >
                    {g.name}
                  </span>
                ))}
              </div>

              <p className="text-slate-300 text-lg leading-relaxed max-w-3xl">{series.overview}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Details Section */}
      <div className="max-w-7xl mx-auto px-8 py-8">
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          <div className="bg-slate-800/40 backdrop-blur-sm rounded-xl p-6 border border-slate-700/30">
            <h3 className="text-xl font-bold text-white mb-4">Series Details</h3>
            <div className="space-y-3 text-slate-300">
              <p>
                <span className="text-purple-400 font-semibold">Popularity:</span> {series.popularity}
              </p>
              <p>
                <span className="text-purple-400 font-semibold">Language:</span> {series.spoken_languages?.map((l) => l.english_name).join(", ")}
              </p>
              <p>
                <span className="text-purple-400 font-semibold">Production:</span> {series.production_companies?.map((c) => c.name).join(", ")}
              </p>
              {series.homepage && (
                <a
                  href={series.homepage}
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
            <div className="flex gap-4 overflow-x-auto pb-4 snap-x snap-mandatory">
              {cast.map((c) => (
                <div key={c.credit_id} className="flex-shrink-0 w-40 snap-center group cursor-pointer">
                  <div className="bg-slate-800/40 backdrop-blur-sm rounded-xl overflow-hidden border border-slate-700/30 hover:border-purple-500/50 transition-all duration-300 hover:scale-105">
                    <div className="relative h-48 overflow-hidden bg-slate-700">
                      <img
                        src={c.profile_path ? IMG_BASE + c.profile_path : PLACEHOLDER}
                        alt={c.name}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                    </div>
                    <div className="p-3">
                      <h3 className="font-bold text-white text-sm line-clamp-1">{c.name}</h3>
                      <p className="text-xs text-purple-300 mb-1">{c.known_for_department}</p>
                      <p className="text-xs text-slate-400 mb-1">Popularity: {c.popularity}</p>
                      <p className="text-xs text-slate-400 line-clamp-1">as {c.character}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Similar Series */}
        {similar && similar.length > 0 && (
          <div className="mt-8">
            <h2 className="text-3xl font-bold text-white mb-6 bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-400">
              Similar Series
            </h2>
            <div className="flex gap-4 overflow-x-auto pb-4 snap-x snap-mandatory scrollbar-hide">
              {similar.map((s) => (
                <Link
                  key={s.id}
                  to={`/series/${s.id}`}
                  className="flex-shrink-0 w-52 snap-center group cursor-pointer"
                >
                  <div className="bg-slate-800/40 backdrop-blur-sm rounded-xl overflow-hidden shadow-lg 
                                  hover:shadow-purple-500/40 transition-all duration-500 hover:scale-105 
                                  border border-slate-700/30 hover:border-purple-500/60 relative">
                    
                    {/* Poster */}
                    <div className="relative h-72 overflow-hidden">
                      <img
                        src={s.poster_path ? IMG_BASE + s.poster_path : PLACEHOLDER}
                        alt={s.name}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                      />

                      {/* Dark overlay */}
                      <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

                      {/* Bottom title */}
                      <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-slate-900 to-transparent group-hover:opacity-0 transition-opacity duration-300">
                        <h3 className="text-sm font-bold text-white line-clamp-2 mb-1">{s.name}</h3>
                        <span className="inline-block mt-1 px-2 py-0.5 bg-yellow-500/70 text-white rounded text-xs">
                          {s.vote_average?.toFixed(1)}
                        </span>
                      </div>

                      {/* Hover overlay */}
                      <div className="absolute inset-0 p-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end">
                        <h3 className="text-sm font-bold text-white mb-2 line-clamp-2">{s.name}</h3>
                        <p className="text-xs text-slate-300 line-clamp-3 leading-relaxed">{s.overview || "No description available."}</p>
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
    </div>
  );
};

export default DetailSeriesView;
