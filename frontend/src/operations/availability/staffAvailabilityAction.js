import { axiosInstance } from "../../utils/baseurl";
import {
  fetchStart,
  fetchSuccess,
  fetchFail,
  updateSuccess,
} from "./staffAvailabilitySlice";

export const fetchStaffSchedule = (staffId) => async (dispatch) => {
  try {
    dispatch(fetchStart());
    const response = await axiosInstance.get(
      `/organization/team/${staffId}/schedule`
    );
    dispatch(fetchSuccess(response.data.data));
  } catch (error) {
    console.error(error);
    dispatch(
      fetchFail(error.response?.data?.error || "Failed to fetch schedule")
    );
  }
};

export const updateStaffSchedule = (staffId, schedules) => async (dispatch) => {
  try {
    dispatch(fetchStart()); // Re-use fetchStart to set loading true
    await axiosInstance.put(`/organization/team/${staffId}/schedule`, {
      schedules,
    });
    dispatch(updateSuccess("Schedule updated successfully"));
    // Refresh
    dispatch(fetchStaffSchedule(staffId));
    return { success: true };
  } catch (error) {
    console.error(error);
    dispatch(
      fetchFail(error.response?.data?.error || "Failed to update schedule")
    );
    return { success: false };
  }
};
