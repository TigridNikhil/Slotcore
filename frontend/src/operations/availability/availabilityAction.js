import { axiosInstance } from "../../utils/baseurl";
import {
  setLoading,
  setError,
  setSuccess,
  setSchedules,
  setOverrides,
  addOverride,
  removeOverride,
} from "./availabilitySlice";

export const fetchSchedules = () => async (dispatch) => {
  try {
    dispatch(setLoading(true));
    const response = await axiosInstance.get("/organization/schedules");
    dispatch(setSchedules(response.data));
  } catch (error) {
    dispatch(
      setError(error.response?.data?.error || "Failed to fetch schedules")
    );
  }
};

export const updateSchedules = (schedules) => async (dispatch) => {
  try {
    dispatch(setLoading(true));
    const response = await axiosInstance.put("/organization/schedules", {
      schedules,
    });
    dispatch(setSchedules(response.data));
    dispatch(setSuccess("Schedules updated successfully"));
  } catch (error) {
    dispatch(
      setError(error.response?.data?.error || "Failed to update schedules")
    );
  }
};

export const fetchOverrides = () => async (dispatch) => {
  try {
    dispatch(setLoading(true));
    const response = await axiosInstance.get("/organization/overrides");
    dispatch(setOverrides(response.data));
  } catch (error) {
    dispatch(
      setError(error.response?.data?.error || "Failed to fetch overrides")
    );
  }
};

export const createOverride = (overrideData) => async (dispatch) => {
  try {
    dispatch(setLoading(true));
    const response = await axiosInstance.post(
      "/organization/overrides",
      overrideData
    );
    dispatch(addOverride(response.data));
    dispatch(setSuccess("Override added successfully"));
    return { success: true };
  } catch (error) {
    dispatch(
      setError(error.response?.data?.error || "Failed to create override")
    );
    return { success: false };
  }
};

export const deleteOverride = (id) => async (dispatch) => {
  try {
    dispatch(setLoading(true));
    await axiosInstance.delete(`/organization/overrides/${id}`);
    dispatch(removeOverride(id));
    dispatch(setSuccess("Override deleted successfully"));
  } catch (error) {
    dispatch(
      setError(error.response?.data?.error || "Failed to delete override")
    );
  }
};
