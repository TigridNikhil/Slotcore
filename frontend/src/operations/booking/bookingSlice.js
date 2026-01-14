import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  bookings: [],
  total: 0,
  page: 1,
  limit: 10,
  totalPages: 1,
  loading: false,
  error: null,
};

const bookingSlice = createSlice({
  name: "booking",
  initialState,
  reducers: {
    setLoading(state) {
      state.loading = true;
      state.error = null;
    },
    setBookings(state, action) {
      state.loading = false;
      state.bookings = action.payload.bookings;
      state.total = action.payload.total;
      state.page = action.payload.page;
      state.limit = action.payload.limit;
      state.totalPages = action.payload.totalPages;
      state.error = null;
    },
    setError(state, action) {
      state.loading = false;
      state.error = action.payload;
    },
  },
});

export const { setLoading, setBookings, setError } = bookingSlice.actions;
export default bookingSlice.reducer;
