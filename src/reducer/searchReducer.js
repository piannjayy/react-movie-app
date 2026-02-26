// src/reducer/searchReducer.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

const API_KEY = "9b0747a01e84a9b49565e7ce281530ab";

// Thunk untuk search movie & tv
export const fetchSearchMovies = createAsyncThunk(
  "search/fetchSearchMovies",
  async (query, { rejectWithValue }) => {
    try {
      const response = await fetch(
        `https://api.themoviedb.org/3/search/multi?api_key=${API_KEY}&query=${query}`
      );

      if (!response.ok) {
        throw new Error("Gagal mengambil data pencarian");
      }

      const data = await response.json();

      // filter hanya movie & tv
      const filtered = data.results.filter(
        (item) => item.media_type === "movie" || item.media_type === "tv"
      );

      return filtered;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const searchSlice = createSlice({
  name: "search",
  initialState: {
    results: [],
    loading: false,
    error: null,
  },
  reducers: {
    clearSearch: (state) => {
      state.results = [];
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchSearchMovies.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchSearchMovies.fulfilled, (state, action) => {
        state.loading = false;
        state.results = action.payload;
      })
      .addCase(fetchSearchMovies.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearSearch } = searchSlice.actions;
export default searchSlice.reducer;
