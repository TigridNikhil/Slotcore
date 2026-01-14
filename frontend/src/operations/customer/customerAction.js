import { axiosInstance } from "../../utils/baseurl";
import { showNotification } from "../../utils/toastmessage";
import {
  setLoading,
  setCustomers,
  setCustomerDetails,
  updateCustomerInList,
  setError,
} from "./customerSlice";

export const fetchCustomers =
  (page = 1, search = "") =>
  async (dispatch) => {
    dispatch(setLoading());
    try {
      const params = { page, search };
      const response = await axiosInstance.get("/customers", { params });
      dispatch(setCustomers(response.data));
    } catch (error) {
      const errorMessage =
        error.response?.data?.error || "Failed to fetch customers";
      console.error("Fetch Customers Error:", error);
      dispatch(setError(errorMessage));
    }
  };

export const fetchCustomerDetails = (id) => async (dispatch) => {
  dispatch(setLoading());
  try {
    const response = await axiosInstance.get(`/customers/${id}`);
    dispatch(setCustomerDetails(response.data));
  } catch (error) {
    const errorMessage =
      error.response?.data?.error || "Failed to fetch customer details";
    dispatch(setError(errorMessage));
  }
};

export const updateCustomer = (id, payload) => async (dispatch) => {
  try {
    const response = await axiosInstance.put(`/customers/${id}`, payload);
    dispatch(updateCustomerInList(response.data));
    showNotification({
      type: "SUCCESS",
      message: "Customer updated successfully",
    });
    return { success: true };
  } catch (error) {
    const errorMessage =
      error.response?.data?.error || "Failed to update customer";
    showNotification({ type: "ERROR", message: errorMessage });
    return { success: false, error: errorMessage };
  }
};

// Optional: Delete if needed, but rarely delete customers in CRM-lite
