import { axiosInstance } from "../../utils/baseurl";
import { setLoading, setBookings, setError } from "./bookingSlice";

export const getBookings =
  (filters = {}) =>
  async (dispatch) => {
    dispatch(setLoading());
    try {
      const response = await axiosInstance.get("/bookings", {
        params: filters,
      });
      dispatch(setBookings(response.data));
    } catch (error) {
      const errorMessage =
        error.response?.data?.error || "Failed to fetch bookings";
      console.error("Fetch Bookings Error:", error);
      dispatch(setError(errorMessage));
    }
  };
