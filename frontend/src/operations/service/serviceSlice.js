import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  services: [],
  loading: false,
  error: null,
};

const serviceSlice = createSlice({
  name: "service",
  initialState,
  reducers: {
    setLoading(state) {
      state.loading = true;
      state.error = null;
    },
    setServices(state, action) {
      state.loading = false;
      state.services = action.payload;
      state.error = null;
    },
    addService(state, action) {
      state.services.push(action.payload);
      state.loading = false;
    },
    updateServiceInStore(state, action) {
      const index = state.services.findIndex((s) => s.id === action.payload.id);
      if (index !== -1) {
        state.services[index] = action.payload;
      }
      state.loading = false;
    },
    removeService(state, action) {
      state.services = state.services.filter((s) => s.id !== action.payload);
      state.loading = false;
    },
    setError(state, action) {
      state.loading = false;
      state.error = action.payload;
    },
  },
});

export const {
  setLoading,
  setServices,
  addService,
  updateServiceInStore,
  removeService,
  setError,
} = serviceSlice.actions;
export default serviceSlice.reducer;
