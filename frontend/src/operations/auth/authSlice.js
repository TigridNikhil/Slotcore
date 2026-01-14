import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  accesstoken: null,
  refreshtoken: null,
  id: null,
  email: null,
  isAdmin: false,
  loading: false,
  error: null,
  user: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setLoading(state) {
      state.loading = true;
      state.error = null;
    },
    setUser(state, action) {
      state.loading = false;
      state.error = null;
      state.user = action.payload;
      Object.assign(state, action.payload);
    },
    setError(state, action) {
      state.loading = false;
      state.error = action.payload;
    },
  },
});

export const { setLoading, setUser, setError } = authSlice.actions;

export default authSlice.reducer;
