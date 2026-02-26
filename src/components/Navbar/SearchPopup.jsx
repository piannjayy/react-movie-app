import React from 'react';

const SearchPopup = ({ isOpen, onClose, results, loading, error, searchTerm, handleInputChange, handleKeyPress }) => {
  if (!isOpen) return null;

  return (
    <div className="modal modal-open" onClick={onClose}>
      <div className="modal-box max-w-7xl" onClick={(e) => e.stopPropagation()}>
        <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2" onClick={onClose}>✕</button>
        <h3 className="font-bold text-lg">Search</h3>
        <input
          type="text"
          placeholder="Cari film atau series..."
          className="input input-bordered w-full mb-4"
          value={searchTerm}
          onChange={handleInputChange}
          onKeyPress={handleKeyPress}
        />
        {loading && <p>Loading...</p>}
        {error && <p className="text-red-500">{error}</p>}
        {!loading && !error && results.length === 0 && <p>No results found</p>}
<div className="flex overflow-x-auto gap-4 mt-4 max-h-96 pb-4">
          {results.map((item) => (
            <div
              key={item.id}
              className="card bg-base-100 shadow-xl cursor-pointer flex-shrink-0 w-64"
            onClick={() => {
                // Navigate to detail page
                if (item.media_type === 'movie') {
                  window.location.href = `/movie/${item.id}`;
                } else if (item.media_type === 'tv') {
                  window.location.href = `/series/${item.id}`;
                }
                onClose();
              }}
            >
{item.backdrop_path || item.poster_path ? (
  <figure className="relative">
    <img
      src={`https://image.tmdb.org/t/p/w500${item.backdrop_path || item.poster_path}`}
      alt={item.title || item.name}
      className="w-full h-48 object-cover"
    />
    <div className="absolute inset-0 bg-black bg-opacity-50 flex flex-col justify-end p-2 text-white">
      <h2 className="text-sm font-bold">{item.title || item.name}</h2>
      <p className="text-xs">
        {item.overview.length > 80 ? item.overview.substring(0, 80) + '...' : item.overview}
      </p>
      <div className="flex justify-between items-center mt-1">
        <span className="text-xs">Vote: {item.vote_average}</span>
        <span className="text-xs">{item.release_date || item.first_air_date}</span>
      </div>
      <div className="badge badge-outline badge-xs mt-1">{item.media_type}</div>
    </div>
  </figure>
) : (
  <div className="w-full h-48 bg-gray-200 flex items-center justify-center">
    No Image
  </div>
)}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SearchPopup;
