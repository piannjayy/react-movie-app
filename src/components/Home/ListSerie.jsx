import React, { useState, useEffect, useMemo, useRef } from 'react';
import { useNavigate } from 'react-router-dom';   
import TrailerModal from '../TrailerModal';

const ListSerie = () => {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState([]);
  const [error, setError] = useState(null);
  const scrollContainerRef = useRef(null);
  const navigate = useNavigate();   

  const [trailerOpen, setTrailerOpen] = useState(false);
  const [selectedVideoKey, setSelectedVideoKey] = useState(null);
  const [clickTimeout, setClickTimeout] = useState(null);

  useEffect(() => {
    const fetchSeries = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch(
          'https://api.themoviedb.org/3/discover/tv?api_key=f2252bbbef0f773ba68fd39402ef7910'
        );
        if (!response.ok) {
          throw new Error('Failed to fetch data');
        }
        const result = await response.json();

        // Fetch videos for each series to get videoKey
        const seriesWithVideos = await Promise.all(result.results.map(async (series) => {
          const videoResponse = await fetch(
            `https://api.themoviedb.org/3/tv/${series.id}/videos?api_key=f2252bbbef0f773ba68fd39402ef7910`
          );
          const videoData = await videoResponse.json();
          const trailer = videoData.results.find(
            video => video.type === 'Trailer' && video.site === 'YouTube'
          ) || videoData.results.find(
            video => video.type === 'Teaser' && video.site === 'YouTube'
          ) || videoData.results[0];
          return {
            ...series,
            videoKey: trailer?.key || null
          };
        }));

        setData(seriesWithVideos);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };
    fetchSeries();
  }, []);

  const memoizedData = useMemo(() => data, [data]);

  const handleCloseTrailer = () => {
    setTrailerOpen(false);
    setSelectedVideoKey(null);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-purple-500 border-t-transparent"></div>
          <p className="mt-4 text-purple-200 text-lg">Loading series...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
        <div className="bg-red-500/10 border border-red-500/50 rounded-lg p-6 max-w-md">
          <p className="text-red-400">Error loading series: {error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="py-4 px-4">
      <div className="max-w-7xl mx-auto">
        <p className="text-4xl font-bold text-white mb-4 text-left bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-400">
          TV Series
        </p>

        <div className="relative">
          <div
            ref={scrollContainerRef}
            className="flex gap-2 overflow-x-auto pb-4 snap-x snap-mandatory scrollbar-hide"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            {memoizedData.map((series) => (
              <div
                key={series.id}
                className="flex-shrink-0 w-52 snap-center group/card cursor-pointer"
              >
                <div
                  onClick={() => {
                    if (clickTimeout) {
                      clearTimeout(clickTimeout);
                      setClickTimeout(null);
                      navigate(`/series/${series.id}`);
                    } else {
                      const timeout = setTimeout(() => {
                        setSelectedVideoKey(series.videoKey);
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
                        'https://image.tmdb.org/t/p/w500' +
                        (series.poster_path || series.backdrop_path)
                      }
                      alt={series.name}
                      className="w-full h-full object-cover group-hover/card:scale-110 transition-transform duration-700"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/70 to-transparent opacity-60 group-hover/card:opacity-95 transition-opacity duration-300"></div>

                    {series.vote_average && (
                      <div className="absolute top-3 right-3 bg-yellow-500/95 backdrop-blur-sm px-2 py-1 rounded-lg flex items-center gap-1 shadow-lg">
                        ⭐
                        <span className="text-white font-bold text-xs">
                          {series.vote_average.toFixed(1)}
                        </span>
                      </div>
                    )}

                    <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-slate-900 to-transparent group-hover/card:opacity-0 transition-opacity duration-300">
                      <h3 className="text-sm font-bold text-white line-clamp-2 mb-1">
                        {series.name}
                      </h3>
                      <span className="inline-block px-2 py-0.5 bg-purple-500/30 text-purple-200 rounded text-xs border border-purple-500/40">
                        {series.first_air_date
                          ? new Date(series.first_air_date).getFullYear()
                          : 'N/A'}
                      </span>
                    </div>

                    <div className="absolute inset-0 p-3 opacity-0 group-hover/card:opacity-100 transition-opacity duration-300 flex flex-col justify-end pointer-events-none">
                      <h3 className="text-sm font-bold text-white mb-1 line-clamp-2">
                        {series.name}
                      </h3>
                      {series.original_name !== series.name && (
                        <p className="text-xs text-slate-400 italic mb-2 line-clamp-1">
                          {series.original_name}
                        </p>
                      )}
                      <span className="inline-block mb-2 px-2 py-0.5 bg-purple-500/30 text-purple-200 rounded text-xs border border-purple-500/40 self-start">
                        {series.first_air_date
                          ? new Date(series.first_air_date).getFullYear()
                          : 'N/A'}
                      </span>
                      <p className="text-xs text-slate-300 line-clamp-4 leading-relaxed">
                        {series.overview || 'No description available.'}
                      </p>
                    </div>
                  </div>
                </div>
                {series.videoKey && (
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

export default ListSerie;