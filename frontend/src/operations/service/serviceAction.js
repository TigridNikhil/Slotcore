import { axiosInstance } from "../../utils/baseurl";
import { showNotification } from "../../utils/toastmessage";
import {
  setLoading,
  setServices,
  addService,
  updateServiceInStore,
  removeService,
  setError,
} from "./serviceSlice";

export const getServices = () => async (dispatch) => {
  dispatch(setLoading());
  try {
    // API call automatically includes headers from baseurl interceptor
    const response = await axiosInstance.get("/services");
    dispatch(setServices(response.data.data));
  } catch (error) {
    const errorMessage =
      error.response?.data?.error || "Failed to fetch services";
    console.error("Fetch Services Error:", error);
    dispatch(setError(errorMessage));
  }
};

export const createService = (payload) => async (dispatch) => {
  dispatch(setLoading());
  try {
    const response = await axiosInstance.post("/services", payload);
    dispatch(addService(response.data.data));
    showNotification({
      type: "SUCCESS",
      message: "Service created successfully",
    });
    return { success: true };
  } catch (error) {
    const errorMessage =
      error.response?.data?.error || "Failed to create service";
    showNotification({ type: "ERROR", message: errorMessage });
    dispatch(setError(errorMessage));
    return { success: false, error: errorMessage };
  }
};

export const updateService = (id, payload) => async (dispatch) => {
  dispatch(setLoading());
  try {
    const response = await axiosInstance.put(`/services/${id}`, payload);
    dispatch(updateServiceInStore(response.data.data));
    showNotification({
      type: "SUCCESS",
      message: "Service updated successfully",
    });
    return { success: true };
  } catch (error) {
    const errorMessage =
      error.response?.data?.error || "Failed to update service";
    showNotification({ type: "ERROR", message: errorMessage });
    dispatch(setError(errorMessage));
    return { success: false, error: errorMessage };
  }
};

export const deleteService = (id) => async (dispatch) => {
  try {
    await axiosInstance.delete(`/services/${id}`);
    dispatch(removeService(id));
    showNotification({
      type: "SUCCESS",
      message: "Service deleted successfully",
    });
  } catch (error) {
    const errorMessage =
      error.response?.data?.error || "Failed to delete service";
    showNotification({ type: "ERROR", message: errorMessage });
  }
};

export const downloadServiceTemplate = () => async () => {
  try {
    const response = await axiosInstance.get("/services/template", {
      responseType: "blob",
    });
    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", "Service_Import_Template.xlsx");
    document.body.appendChild(link);
    link.click();
    link.remove();
  } catch (error) {
    console.error("Template Download Error:", error);
    showNotification({ type: "ERROR", message: "Failed to download template" });
  }
};

export const importServices = (servicesData) => async (dispatch) => {
  dispatch(setLoading());
  try {
    const response = await axiosInstance.post("/services/import", {
      services: servicesData,
    });

    if (response.data.errors) {
      console.warn("Import warning:", response.data.errors);
      showNotification({
        type: "WARNING",
        message: "File imported with some errors. Check console.",
      });
    } else {
      showNotification({
        type: "SUCCESS",
        message: response.data.message || "Import successful!",
      });
    }

    // Refresh list
    dispatch(getServices());
    return { success: true };
  } catch (error) {
    console.error("Import Error:", error);
    const msg = error.response?.data?.error || "Import failed";
    dispatch(setError(msg));
    showNotification({ type: "ERROR", message: msg });
    return { success: false, error: msg };
  }
};
