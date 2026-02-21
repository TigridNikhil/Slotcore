import { axiosInstance } from "../../utils/baseurl";
import { setLoading, setStats, setOverview, setError } from "./dashboardSlice";

export const getDashboardStats =
  (filters = {}) =>
  async (dispatch) => {
    dispatch(setLoading());
    try {
      const { startDate, endDate } = filters;
      const params = {};
      if (startDate) params.startDate = startDate;
      if (endDate) params.endDate = endDate;

      const response = await axiosInstance.get("/organization/stats", {
        params,
      });
      dispatch(setStats(response.data.data));
    } catch (error) {
      console.error("Fetch Stats Error:", error);
      dispatch(
        setError(error.response?.data?.error || "Failed to fetch stats"),
      );
    }
  };

export const getOverviewStats = () => async (dispatch) => {
  try {
    const response = await axiosInstance.get("/organization/overview");
    dispatch(setOverview(response.data.data));
  } catch (error) {
    console.error("Fetch Overview Error:", error);
    // Optional: dispatch error or silent fail
  }
};
export const downloadReport =
  (filters = {}) =>
  async () => {
    try {
      const { startDate, endDate } = filters;
      const params = {};
      if (startDate) params.startDate = startDate;
      if (endDate) params.endDate = endDate;

      const response = await axiosInstance.get("/organization/report", {
        params,
        responseType: "blob",
      });

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute(
        "download",
        `Business_Report_${new Date().getTime()}.xlsx`,
      );
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error("Download Report Error:", error);
      // Silent fail or alert
    }
  };
