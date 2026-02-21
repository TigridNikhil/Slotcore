import { axiosInstance } from "../../utils/baseurl";
import { setLoading, setSuccess, setError } from "./aiSlice";
import { getDashboardStats } from "../dashboard/dashboardAction"; // Optionally refresh stats

export const generateSiteContent = (tone, context) => async (dispatch) => {
  dispatch(setLoading());
  try {
    const response = await axiosInstance.post("/ai/generate-site-content", {
      tone,
      context,
    });
    dispatch(setSuccess("Site content generated successfully!"));
    return response.data.data; // Return content to update local state if needed
  } catch (error) {
    console.error("AI Gen Error:", error);
    dispatch(
      setError(error.response?.data?.error || "Failed to generate content"),
    );
  }
};

export const generateServiceDescriptions = (tone) => async (dispatch) => {
  dispatch(setLoading());
  try {
    const response = await axiosInstance.post("/ai/generate-service-desc", {
      tone,
    });
    dispatch(setSuccess("Service descriptions generated successfully!"));
    return response.data.data;
  } catch (error) {
    console.error("AI Service Error:", error);
    dispatch(
      setError(
        error.response?.data?.error || "Failed to generate descriptions",
      ),
    );
  }
};

export const updateOrganization = (data) => async (dispatch) => {
  dispatch(setLoading());
  try {
    const response = await axiosInstance.put("/organization", data);
    dispatch(setSuccess("Organization updated successfully!"));
    return response.data.data;
  } catch (error) {
    console.error("Update Org Error:", error);
    dispatch(
      setError(error.response?.data?.error || "Failed to update settings"),
    );
  }
};
