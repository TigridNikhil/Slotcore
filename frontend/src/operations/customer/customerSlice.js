import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  customers: [],
  customer: null, // Selected customer details
  total: 0,
  page: 1,
  limit: 20,
  totalPages: 1,
  loading: false,
  error: null,
};

const customerSlice = createSlice({
  name: "customer",
  initialState,
  reducers: {
    setLoading(state) {
      state.loading = true;
      state.error = null;
    },
    setCustomers(state, action) {
      state.loading = false;
      state.customers = action.payload.customers;
      state.total = action.payload.total;
      state.page = action.payload.page;
      state.limit = action.payload.limit;
      state.totalPages = action.payload.totalPages;
    },
    setCustomerDetails(state, action) {
      state.loading = false;
      state.customer = action.payload;
    },
    updateCustomerInList(state, action) {
      const updated = action.payload;
      const index = state.customers.findIndex((c) => c.id === updated.id);
      if (index !== -1) {
        state.customers[index] = { ...state.customers[index], ...updated };
      }
      if (state.customer && state.customer.id === updated.id) {
        state.customer = { ...state.customer, ...updated };
      }
    },
    setError(state, action) {
      state.loading = false;
      state.error = action.payload;
    },
  },
});

export const {
  setLoading,
  setCustomers,
  setCustomerDetails,
  updateCustomerInList,
  setError,
} = customerSlice.actions;

export default customerSlice.reducer;
