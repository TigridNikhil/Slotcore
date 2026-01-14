import { axiosInstance } from "../../utils/baseurl";
import {
  setLoading,
  setTenant,
  setServices,
  setLocations,
  setSlots,
  setBookingSuccess,
  setCreatedBooking,
  setError,
} from "./publicBookingSlice";
import { showNotification } from "../../utils/toastmessage";

// Fetch Tenant Info
export const fetchPublicTenant = () => async (dispatch) => {
  dispatch(setLoading());
  try {
    const response = await axiosInstance.get("/organization/public");
    dispatch(setTenant(response.data));
  } catch (error) {
    console.error("Fetch Tenant Error:", error);
    dispatch(setError("Organization not found or system unavailable."));
  }
};

// Fetch Public Services
export const fetchPublicServices = () => async (dispatch) => {
  dispatch(setLoading());
  try {
    const response = await axiosInstance.get("/services");
    dispatch(setServices(response.data));
  } catch (error) {
    console.error("Fetch Services Error:", error);
    dispatch(setError("Failed to load services."));
  }
};

// Fetch Available Slots
export const fetchPublicSlots = (date, serviceIdOrList) => async (dispatch) => {
  dispatch(setLoading());
  try {
    const params = { date };
    if (serviceIdOrList && serviceIdOrList.includes(",")) {
      params.serviceIds = serviceIdOrList;
    } else {
      params.serviceId = serviceIdOrList;
    }

    const response = await axiosInstance.get("/bookings/slots", {
      params,
    });
    dispatch(setSlots(response.data.slots));
  } catch (error) {
    console.error("Fetch Slots Error:", error);
    dispatch(setError("Failed to load available slots."));
    showNotification({ type: "ERROR", message: "Failed to load slots" });
  }
};

// Fetch Public Locations
export const fetchPublicLocations = () => async (dispatch) => {
  try {
    const response = await axiosInstance.get("/locations");
    dispatch(setLocations(response.data));
  } catch (error) {
    console.error("Fetch Locations Error:", error);
    dispatch(setLocations([]));
  }
};

// Create Booking
export const createPublicBooking = (bookingData) => async (dispatch) => {
  dispatch(setLoading());
  try {
    const response = await axiosInstance.post("/bookings", bookingData);
    // If it's online payment, we don't set success yet, we verify first.
    // BUT for now, let's return the data so the component can decide.
    // If venue, it's confirmed.

    if (
      bookingData.paymentMethod === "venue" ||
      response.data.summary.paymentRequired === false
    ) {
      // Logic: If Free or Venue, confirm immediately
      // If 'Free' but online selected? If price is 0, backend sets paymentRequired: false.
      // So checking summary.paymentRequired === false covers free services too.

      const booking = response.data.summary.bookings[0];
      dispatch(setCreatedBooking(booking));
      dispatch(setBookingSuccess(true));
      showNotification({ type: "SUCCESS", message: "Booking Confirmed!" });
    }

    return { success: true, data: response.data };
  } catch (error) {
    console.error("Create Booking Error:", error);
    const msg = error.response?.data?.error || "Booking failed.";
    dispatch(setError(msg));
    showNotification({ type: "ERROR", message: msg });
    return { success: false };
  }
};
