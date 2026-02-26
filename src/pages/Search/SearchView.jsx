import React from "react";
import { useTheme } from "../../context/ThemeContext";
import { useNavigate } from "react-router-dom";

const SearchView = ({ results, loading, error, query }) => {
  const { theme } = useTheme();
  const navigate = useNavigate();

  if (loading) return <p>Loading...</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;
  if (!results.length) return <p>Tidak ada hasil untuk "{query}"</p>;

  return (
    <div className={`container mx-auto p-6 min-h-screen bg-gradient-to-b ${theme === 'dark' ? 'from-gray-900 to-gray-800 text-white' : 'from-white to-gray-50 text-gray-900'}`}>
      <h2 className="text-3xl font-extrabold mb-6 text-center tracking-wide">Hasil pencarian untuk: "{query}"</h2>
      <div className="flex overflow-x-auto gap-6 pb-4">
        {results.map((item) => (
          <div
            key={item.id}
            className={`card shadow-lg hover:shadow-2xl cursor-pointer transition-all duration-300 hover:scale-105 rounded-2xl overflow-hidden border px-3 py-2 flex-shrink-0 w-80 ${theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}
            onClick={() => {
              if (item.media_type === 'movie') {
                window.location.href = `/movie/${item.id}`;
              } else if (item.media_type === 'tv') {
                window.location.href = `/series/${item.id}`;
              }
            }}
          >
            {item.backdrop_path || item.poster_path ? (
              <figure className="relative">
                <img
                  src={`https://image.tmdb.org/t/p/w500${item.backdrop_path || item.poster_path}`}
                  alt={item.title || item.name}
                  className="w-full h-64 object-cover transition-transform duration-300 hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/70 to-transparent flex flex-col justify-end p-4 text-white">
                  <h2 className="text-lg font-bold mb-2">{item.title || item.name}</h2>
                  <p className="text-sm mb-3 leading-relaxed">
                    {item.overview.length > 150 ? item.overview.substring(0, 150) + '...' : item.overview}
                  </p>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-semibold text-yellow-400">⭐ {item.vote_average}</span>
                    <span className="text-sm text-gray-300">{item.release_date || item.first_air_date}</span>
                  </div>
                  <div className="badge badge-primary bg-blue-600 text-white border-0 px-3 py-1 rounded-full font-medium">{item.media_type}</div>
                </div>
              </figure>
            ) : (
              <div className="w-full h-64 bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center rounded-t-2xl">
                <span className="text-gray-500 font-medium">No Image</span>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default SearchView;
