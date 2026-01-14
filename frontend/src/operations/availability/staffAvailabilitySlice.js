import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  loading: false,
  schedules: [], // Staff specific schedules
  error: null,
  success: null,
};

const staffAvailabilitySlice = createSlice({
  name: "staffAvailability",
  initialState,
  reducers: {
    fetchStart: (state) => {
      state.loading = true;
      state.error = null;
      state.success = null;
    },
    fetchSuccess: (state, action) => {
      state.loading = false;
      state.schedules = action.payload;
    },
    fetchFail: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    updateSuccess: (state, action) => {
      state.loading = false;
      state.success = action.payload;
      state.error = null;
    },
    clearMessages: (state) => {
      state.error = null;
      state.success = null;
    },
  },
});

export const {
  fetchStart,
  fetchSuccess,
  fetchFail,
  updateSuccess,
  clearMessages,
} = staffAvailabilitySlice.actions;

export default staffAvailabilitySlice.reducer;
