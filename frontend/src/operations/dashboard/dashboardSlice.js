import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  stats: {
    totalBookings: 0,
    activeServices: 0,
    revenue: 0,
  },
  overview: {
    totalBookings: 0,
    activeServices: 0,
    revenue: 0,
    statusDistribution: [],
    servicePerformance: [],
    chartsData: [],
  },
  loading: false,
  error: null,
};

const dashboardSlice = createSlice({
  name: "dashboard",
  initialState,
  reducers: {
    setLoading: (state) => {
      state.loading = true;
      state.error = null;
    },
    setStats: (state, action) => {
      state.loading = false;
      state.stats = action.payload;
    },
    setOverview: (state, action) => {
      state.overview = action.payload;
    },
    setError: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
  },
});

export const { setLoading, setStats, setOverview, setError } =
  dashboardSlice.actions;
export default dashboardSlice.reducer;
