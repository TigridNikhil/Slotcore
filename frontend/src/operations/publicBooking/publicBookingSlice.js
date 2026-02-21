import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  tenant: null,
  tenant: null,
  services: [],
  locations: [], // New
  slots: [],
  loading: false,
  error: null,
  bookingSuccess: false,
};

const publicBookingSlice = createSlice({
  name: "publicBooking",
  initialState,
  reducers: {
    setLoading: (state) => {
      state.loading = true;
      state.error = null;
    },
    setTenant: (state, action) => {
      console.log("action", action);

      state.tenant = action.payload;
      state.loading = false;
    },
    setServices: (state, action) => {
      state.services = action.payload;
      state.services = action.payload;
      state.loading = false;
    },
    setLocations: (state, action) => {
      state.locations = action.payload;
      state.loading = false;
    },
    setSlots: (state, action) => {
      state.slots = action.payload;
      state.loading = false;
    },
    setBookingSuccess: (state, action) => {
      state.bookingSuccess = action.payload;
      state.loading = false;
    },
    setCreatedBooking: (state, action) => {
      state.createdBooking = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
      state.loading = false;
    },
    resetLoading: (state) => {
      state.loading = false;
    },
    resetBookingState: (state) => {
      state.slots = [];
      state.bookingSuccess = false;
      state.createdBooking = null;
      state.error = null;
    },
  },
});

export const {
  setLoading,
  setTenant,
  setServices,
  setLocations,
  setSlots,
  setBookingSuccess,
  setCreatedBooking,
  setError,
  resetBookingState,
  resetLoading,
} = publicBookingSlice.actions;

export default publicBookingSlice.reducer;
