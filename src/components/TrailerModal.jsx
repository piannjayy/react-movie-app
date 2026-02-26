import React from 'react';

const TrailerModal = ({ isOpen, onClose, videoKey }) => {
  if (!isOpen || !videoKey) return null;

  return (
    <div className="modal modal-open" onClick={onClose}>
      <div className="modal-box max-w-4xl p-0" onClick={(e) => e.stopPropagation()}>
        <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2" onClick={onClose}>✕</button>
        <div className="aspect-w-16 aspect-h-9">
          <iframe
            src={`https://www.youtube.com/embed/${videoKey}?autoplay=1&controls=1`}
            title="Movie Trailer"
            frameBorder="0"
            allow="autoplay; encrypted-media"
            allowFullScreen
            className="w-full h-full"
          />
        </div>
      </div>
    </div>
  );
};

export default TrailerModal;
