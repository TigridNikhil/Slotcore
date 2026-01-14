import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  schedules: [],
  overrides: [],
  loading: false,
  error: null,
  success: null,
};

const availabilitySlice = createSlice({
  name: "availability",
  initialState,
  reducers: {
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
      state.loading = false;
    },
    setSuccess: (state, action) => {
      state.success = action.payload;
      state.loading = false;
    },
    setSchedules: (state, action) => {
      state.schedules = action.payload;
      state.loading = false;
      state.error = null;
    },
    setOverrides: (state, action) => {
      state.overrides = action.payload;
      state.loading = false;
      state.error = null;
    },
    addOverride: (state, action) => {
      state.overrides.push(action.payload);
      state.loading = false;
    },
    removeOverride: (state, action) => {
      state.overrides = state.overrides.filter((o) => o.id !== action.payload);
      state.loading = false;
    },
    clearMessages: (state) => {
      state.error = null;
      state.success = null;
    },
  },
});

export const {
  setLoading,
  setError,
  setSuccess,
  setSchedules,
  setOverrides,
  addOverride,
  removeOverride,
  clearMessages,
} = availabilitySlice.actions;

export default availabilitySlice.reducer;
