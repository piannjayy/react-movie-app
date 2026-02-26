import React from "react";

const IMG_URL = "https://image.tmdb.org/t/p/w500";

const DetailTrendingView = ({ item, similar, cast, favorite, toggleFavorite, userRating, setUserRating, clearRating, mediaType }) => {
  if (!item) return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <p className="text-white text-xl">Content not found.</p>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Hero Section with Backdrop */}
      <div className="relative h-[500px] overflow-hidden">
        <img
          src={IMG_URL + (item.backdrop_path || item.poster_path)}
          alt={item.title || item.name}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/80 to-transparent"></div>
        
        {/* Info Overlay */}
        <div className="absolute bottom-0 left-0 right-0 p-8">
          <div className="max-w-7xl mx-auto flex gap-6">
            {/* Poster */}
            <div className="hidden md:block flex-shrink-0">
              <img
                src={IMG_URL + (item.poster_path || item.backdrop_path)}
                alt={item.title || item.name}
                className="w-64 rounded-xl shadow-2xl border-2 border-purple-500/30"
              />
            </div>
            
            {/* Info */}
            <div className="flex-grow">
              <h1 className="text-5xl font-bold text-white mb-3 drop-shadow-lg">
                {item.title || item.name}
              </h1>
              
              <div className="flex items-center gap-4 mb-4 flex-wrap">
                {/* Rating */}
                <div className="flex items-center gap-2 bg-yellow-500/90 px-3 py-1.5 rounded-lg">
                  <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                  <span className="text-white font-bold">{item.vote_average?.toFixed(1)}</span>
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

                {/* Release / First Air Date */}
                <span className="px-3 py-1.5 bg-purple-500/30 text-purple-200 rounded-lg border border-purple-500/50 font-semibold">
                  {item.release_date || item.first_air_date || "N/A"}
                </span>
                
                {/* Status */}
                {item.status && (
                  <span className="px-3 py-1.5 bg-slate-800/50 text-slate-200 rounded-lg border border-slate-700/50">
                    {item.status}
                  </span>
                )}
                
                {/* Favorite */}
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
              </div>
              
              {/* Genres */}
              <div className="flex flex-wrap gap-2 mb-4">
                {item.genres?.map((g) => (
                  <span key={g.id} className="px-3 py-1 bg-purple-500/20 text-purple-300 rounded-full text-sm border border-purple-500/30">
                    {g.name}
                  </span>
                ))}
              </div>
              
              {/* Overview */}
              <p className="text-slate-300 text-lg leading-relaxed max-w-3xl">
                {item.overview}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Details Section */}
      <div className="max-w-7xl mx-auto px-8 py-8">
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          <div className="bg-slate-800/40 backdrop-blur-sm rounded-xl p-6 border border-slate-700/30">
            <h3 className="text-xl font-bold text-white mb-4">Details</h3>
            <div className="space-y-3 text-slate-300">
              <p><span className="text-purple-400 font-semibold">Popularity:</span> {item.popularity}</p>
              <p><span className="text-purple-400 font-semibold">Language:</span> {item.spoken_languages?.map((l) => l.english_name).join(", ")}</p>
              <p><span className="text-purple-400 font-semibold">Production:</span> {item.production_companies?.map((c) => c.name).join(", ")}</p>
              {item.homepage && (
                <a
                  href={item.homepage}
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
                <div key={c.cast_id || c.credit_id} className="flex-shrink-0 w-40 snap-center group cursor-pointer">
                  <div className="bg-slate-800/40 backdrop-blur-sm rounded-xl overflow-hidden border border-slate-700/30 hover:border-purple-500/50 transition-all duration-300 hover:scale-105">
                    <div className="relative h-48 overflow-hidden bg-slate-700">
                      <img
                        src={c.profile_path ? IMG_URL + c.profile_path : "/no-image.jpg"}
                        alt={c.name}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                    </div>
                    <div className="p-3">
                      <h3 className="font-bold text-white text-sm line-clamp-1">{c.name}</h3>
                      <p className="text-xs text-purple-300 mb-1">{c.known_for_department}</p>
                      <p className="text-xs text-slate-400 line-clamp-1">as {c.character}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Similar */}
        {similar && similar.length > 0 && (
          <div>
            <h2 className="text-3xl font-bold text-white mb-6 bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-400">
              Similar {mediaType === "tv" ? "TV Shows" : "Movies"}
            </h2>
            <div className="flex gap-4 overflow-x-auto pb-4 snap-x snap-mandatory scrollbar-hide">
              {similar.map((s) => (
                <div key={s.id} className="flex-shrink-0 w-52 snap-center group cursor-pointer">
                  <div className="bg-slate-800/40 backdrop-blur-sm rounded-xl overflow-hidden shadow-lg hover:shadow-purple-500/40 transition-all duration-500 hover:scale-105 border border-slate-700/30 hover:border-purple-500/60 relative">
                    <div className="relative h-72 overflow-hidden">
                      <img
                        src={s.poster_path ? IMG_URL + s.poster_path : "/no-image.jpg"}
                        alt={s.title || s.name}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/70 to-transparent opacity-60 group-hover:opacity-95 transition-opacity duration-300"></div>
                      
                      {s.vote_average && (
                        <div className="absolute top-3 right-3 bg-yellow-500/95 backdrop-blur-sm px-2 py-1 rounded-lg flex items-center gap-1 shadow-lg">
                          <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                          </svg>
                          <span className="text-white font-bold text-xs">{s.vote_average.toFixed(1)}</span>
                        </div>
                      )}

                      <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-slate-900 to-transparent group-hover:opacity-0 transition-opacity duration-300">
                        <h3 className="text-sm font-bold text-white line-clamp-2 mb-1">
                          {s.title || s.name}
                        </h3>
                      </div>

                      <div className="absolute inset-0 p-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end pointer-events-none">
                        <h3 className="text-sm font-bold text-white mb-2 line-clamp-2">
                          {s.title || s.name}
                        </h3>
                        <p className="text-xs text-slate-300 line-clamp-3 leading-relaxed">
                          {s.overview || "No description available."}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <style jsx>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </div>
  );
};

export default DetailTrendingView;
