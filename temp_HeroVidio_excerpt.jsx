{/* YouTube Video Background - Autoplay */}
        {state.movies.map((movie, index) => (
          movie.videoKey && (
            <div
              key={`${movie.id}-${index}`}
              className="absolute top-0 left-0 w-full h-full pointer-events-none"
              style={{ zIndex: index === state.currentIndex ? 1 : 0 }}
            >
              <iframe
                className="absolute top-1/2 left-1/2 w-screen h-screen"
                style={{
                  transform: "translate(-50%, -50%) scale(1.5)",
                  minWidth: "100vw",
                  minHeight: "100vh",
                  opacity: index === state.currentIndex ? 1 : 0.3, // Make non-current trailers semi-transparent
                }}
                src={`https://www.youtube.com/embed/${movie.videoKey}?autoplay=1&controls=0&showinfo=0&rel=0&loop=1&playlist=${movie.videoKey}&playsinline=1&enablejsapi=1&mute=1`}
                title="Movie Trailer"
                frameBorder="0"
                allow="autoplay; encrypted-media"
              />
            </div>
          )
        ))}
