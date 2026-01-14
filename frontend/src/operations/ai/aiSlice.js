import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  loading: false,
  error: null,
  successMessage: null,
};

const aiSlice = createSlice({
  name: "ai",
  initialState,
  reducers: {
    setLoading: (state) => {
      state.loading = true;
      state.error = null;
      state.successMessage = null;
    },
    setSuccess: (state, action) => {
      state.loading = false;
      state.successMessage = action.payload;
    },
    setError: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    clearMessages: (state) => {
      state.error = null;
      state.successMessage = null;
    },
  },
});

export const { setLoading, setSuccess, setError, clearMessages } =
  aiSlice.actions;
export default aiSlice.reducer;
