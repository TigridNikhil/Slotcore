import { axiosInstance } from "../../utils/baseurl";
import { showNotification } from "../../utils/toastmessage";
import { setLoading, setUser, setError } from "./authSlice";

// Login Action
export const loginUser = (payload) => async (dispatch) => {
  dispatch(setLoading());

  try {
    const response = await axiosInstance.post("/auth/login", payload);

    if (response.data.success) {
      const { accesstoken, refreshtoken, user } = response.data.data || {};

      if (!user) {
        throw new Error("User data is missing in response");
      }

      // Save to localStorage
      localStorage.setItem("accesstoken", accesstoken);
      localStorage.setItem("refreshtoken", refreshtoken);
      localStorage.setItem("user", JSON.stringify(user));
      if (user.slug) {
        localStorage.setItem("tenantSlug", user.slug);
      }

      dispatch(setUser(user));
      showNotification({ type: "SUCCESS", message: "Login Successful" });

      return { success: true };
    }
  } catch (error) {
    console.log("error", error);
    const errorMessage = error.response?.data?.error || "Login failed";

    // Display error notification
    showNotification({ type: "ERROR", message: errorMessage });

    dispatch(setError(errorMessage));
    return { success: false, error: errorMessage };
  }
};

export const forgotPasswordRequest = (email) => async (dispatch) => {
  dispatch(setLoading());
  try {
    const response = await axiosInstance.post("/auth/forgot-password/request", {
      email,
    });
    if (response.data.success) {
      showNotification({ type: "SUCCESS", message: response.data.message });
      return { success: true };
    }
  } catch (error) {
    const errorMessage = error.response?.data?.error || "Request failed";
    showNotification({ type: "ERROR", message: errorMessage });
    dispatch(setError(errorMessage));
    return { success: false, error: errorMessage };
  }
};

export const resetPassword = (payload) => async (dispatch) => {
  dispatch(setLoading());
  try {
    const response = await axiosInstance.post(
      "/auth/forgot-password/reset",
      payload,
    );
    if (response.data.success) {
      showNotification({ type: "SUCCESS", message: response.data.message });
      return { success: true };
    }
  } catch (error) {
    const errorMessage = error.response?.data?.error || "Reset failed";
    showNotification({ type: "ERROR", message: errorMessage });
    dispatch(setError(errorMessage));
    return { success: false, error: errorMessage };
  }
};

// Register Organization Action
export const registerOrg = (payload) => async (dispatch) => {
  dispatch(setLoading());
  try {
    const response = await axiosInstance.post("/auth/register-org", payload);

    if (response.data.success) {
      const { accesstoken, refreshtoken, organization, user } =
        response.data.data;

      localStorage.setItem("accesstoken", accesstoken);
      localStorage.setItem("refreshtoken", refreshtoken);
      if (organization.slug) {
        localStorage.setItem("tenantSlug", organization.slug);
      }
      if (user) {
        localStorage.setItem("user", JSON.stringify(user));
        dispatch(setUser(user));
      }

      showNotification({
        type: "SUCCESS",
        message: "Organization Registered Successfully!",
      });
      return { success: true, organization };
    }
  } catch (error) {
    const errorMessage = error.response?.data?.error || "Registration failed";
    console.error("Register Org Error:", error);
    showNotification({ type: "ERROR", message: errorMessage });
    dispatch(setError(errorMessage));
    return { success: false, error: errorMessage };
  }
};

export const clearError = () => (dispatch) => {
  dispatch(setError(null));
};
