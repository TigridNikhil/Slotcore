import { axiosInstance } from "../../utils/baseurl";
import { showNotification } from "../../utils/toastmessage";
import { setLoading, setUser, setError } from "./authSlice";

// Login Action
export const loginUser = (payload) => async (dispatch) => {
  dispatch(setLoading());

  try {
    const response = await axiosInstance.post("/auth/login", payload);

    if (response.data) {
      const { token, user } = response.data;

      // Save to localStorage
      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));
      if (user.slug) {
        localStorage.setItem("tenantSlug", user.slug);
      }

      dispatch(setUser(user));
      showNotification({ type: "SUCCESS", message: "Login Successful" });

      return { success: true };
    }
  } catch (error) {
    const errorMessage = error.response?.data?.error || "Login failed";

    // Display error notification
    showNotification({ type: "ERROR", message: errorMessage });

    dispatch(setError(errorMessage));
    return { success: false, error: errorMessage };
  }
};

export const forgotVerifyPassword = (payload) => async (dispatch) => {
  dispatch(setLoading());
  try {
    const response = await axiosInstance.post(
      "/verifyforgot-password",
      payload
    );

    if (response.data.success) {
      // Display success notification
      showNotification({ type: "SUCCESS", message: response.data.message });
      return { success: true, message: response.data.message };
    }
  } catch (error) {
    const errorMessage =
      error.response?.data?.error || "Password Verify failed";

    // Display error notification
    showNotification({ type: "ERROR", message: errorMessage });

    dispatch(setError(errorMessage));
  }
};

export const forgotPassword = (payload) => async (dispatch) => {
  dispatch(setLoading());
  try {
    const response = await axiosInstance.post("/forgot-password", payload);
    if (response.data.success) {
      // Display success notification
      showNotification({ type: "SUCCESS", message: response.data.message });
      return { success: true, message: response.data.message };
    }
  } catch (error) {
    const errorMessage =
      error.response?.data?.error || "Password Verify failed";

    // Display error notification
    showNotification({ type: "ERROR", message: errorMessage });

    dispatch(setError(errorMessage));
  }
};

export const resetPassword = (payload, navigate) => async (dispatch) => {
  dispatch(setLoading());
  try {
    const response = await axiosInstance.post("/reset-password", payload);

    if (response.data.success) {
      // Display success notification
      showNotification({ type: "SUCCESS", message: response.data.message });
      localStorage.setItem("isNewPass", true);

      // Navigate to home page
      navigate("/"); // Navigate to the home page
      return { success: true, message: response.data.message };
    }
  } catch (error) {
    const errorMessage =
      error.response?.data?.error || "Password Verify failed";

    // Display error notification
    showNotification({ type: "ERROR", message: errorMessage });

    dispatch(setError(errorMessage));
  }
};
export const resetPasswordInPage = (payload) => async (dispatch) => {
  dispatch(setLoading());
  try {
    const response = await axiosInstance.post("/reset-password", payload);

    if (response.data.success) {
      // Display success notification
      showNotification({ type: "SUCCESS", message: response.data.message });
      localStorage.setItem("isNewPass", true);

      // Navigate to home page

      return { success: true, message: response.data.message };
    }
  } catch (error) {
    const errorMessage =
      error.response?.data?.error || "Password Verify failed";

    // Display error notification
    showNotification({ type: "ERROR", message: errorMessage });

    dispatch(setError(errorMessage));
  }
};

// Register Organization Action
export const registerOrg = (payload) => async (dispatch) => {
  dispatch(setLoading());
  try {
    const response = await axiosInstance.post("/auth/register-org", payload);

    if (response.data) {
      const { token, organization } = response.data;

      localStorage.setItem("token", token);
      if (organization.slug) {
        localStorage.setItem("tenantSlug", organization.slug);
      }

      // We might want to set user here too if the backend returns it,
      // but for now let's just handle the success.
      // Usually register returns the user/org.
      // Based on RegisterOrg.jsx usage: const { token, organization } = res.data;

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
