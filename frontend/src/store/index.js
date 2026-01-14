import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../operations/auth/authSlice";
import serviceReducer from "../operations/service/serviceSlice";
import bookingReducer from "../operations/booking/bookingSlice";
import publicBookingReducer from "../operations/publicBooking/publicBookingSlice";
import dashboardReducer from "../operations/dashboard/dashboardSlice";
import aiReducer from "../operations/ai/aiSlice";
import availabilityReducer from "../operations/availability/availabilitySlice";
import staffAvailabilityReducer from "../operations/availability/staffAvailabilitySlice";
import customerReducer from "../operations/customer/customerSlice";

const store = configureStore({
  reducer: {
    auth: authReducer,
    service: serviceReducer,
    booking: bookingReducer,
    publicBooking: publicBookingReducer,
    dashboard: dashboardReducer,
    ai: aiReducer,
    availability: availabilityReducer,
    staffAvailability: staffAvailabilityReducer,
    customer: customerReducer,
  },
});

export default store;
