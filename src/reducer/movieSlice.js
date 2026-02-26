import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

// Async thunk for fetching genres
export const fetchGenres = createAsyncThunk(
  'movies/fetchGenres',
  async () => {
    const response = await fetch('https://api.themoviedb.org/3/genre/movie/list?api_key=28fd68f4af938f0570807ba705fd2aba');
    if (!response.ok) {
      throw new Error('Failed to fetch genres');
    }
    const data = await response.json();
    return data.genres;
  }
);

// Async thunk for fetching movies with genre and page support
export const fetchMovies = createAsyncThunk(
  'movies/fetchMovies',
  async ({ genre = '', page = 1 } = {}) => {
    const genreParam = genre ? `&with_genres=${genre}` : '';
    const response = await fetch(`https://api.themoviedb.org/3/discover/movie?api_key=28fd68f4af938f0570807ba705fd2aba&page=${page}${genreParam}`);
    if (!response.ok) {
      throw new Error('Failed to fetch movies');
    }
    const data = await response.json();

    // Fetch videos for each movie to get videoKey
    const moviesWithVideos = await Promise.all(data.results.map(async (movie) => {
      const videoResponse = await fetch(
        `https://api.themoviedb.org/3/movie/${movie.id}/videos?api_key=28fd68f4af938f0570807ba705fd2aba`
      );
      const videoData = await videoResponse.json();
      const trailer = videoData.results.find(
        video => video.type === 'Trailer' && video.site === 'YouTube'
      ) || videoData.results.find(
        video => video.type === 'Teaser' && video.site === 'YouTube'
      ) || videoData.results[0];
      return {
        ...movie,
        videoKey: trailer?.key || null
      };
    }));

    return { movies: moviesWithVideos, totalPages: data.total_pages, currentPage: page };
  }
);

const movieSlice = createSlice({
  name: 'movies',
  initialState: {
    movies: [],
    genres: [],
    selectedGenre: '',
    currentPage: 1,
    totalPages: 1,
    loading: false,
    error: null,
  },
  reducers: {
    setSelectedGenre: (state, action) => {
      state.selectedGenre = action.payload;
      state.currentPage = 1; // Reset to first page when genre changes
    },
    setCurrentPage: (state, action) => {
      state.currentPage = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchGenres.pending, (state) => {
        // No loading state for genres as it's usually fast
      })
      .addCase(fetchGenres.fulfilled, (state, action) => {
        state.genres = action.payload;
      })
      .addCase(fetchGenres.rejected, (state, action) => {
        // Handle genre fetch error if needed
      })
      .addCase(fetchMovies.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMovies.fulfilled, (state, action) => {
        state.loading = false;
        state.movies = action.payload.movies;
        state.totalPages = action.payload.totalPages;
        state.currentPage = action.payload.currentPage;
      })
      .addCase(fetchMovies.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { setSelectedGenre, setCurrentPage } = movieSlice.actions;
export default movieSlice.reducer;
