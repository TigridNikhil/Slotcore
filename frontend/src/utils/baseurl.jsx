import axios from "axios";
import config from "./config";
import { root } from "../main";
import { BrowserRouter as Router } from "react-router-dom";
import SessionExpired from "../components/sessionExpired";

const axiosInstance = axios.create({
  baseURL: config.BackendURL,
});

const showSessionExpired = () => {
  root.render(
    <Router>
      <SessionExpired />
    </Router>
  );
};
// Request Interceptor
axiosInstance.interceptors.request.use(
  (config) => {
    try {
      const token =
        localStorage.getItem("accesstoken") || localStorage.getItem("token"); // Fallback to 'token'
      const tenantSlug = localStorage.getItem("tenantSlug");

      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      console.log("tenantSlug", tenantSlug);
      
      if (tenantSlug) {
        config.headers["x-tenant-slug"] = tenantSlug;
      }
    } catch (storageError) {
      console.error("Error accessing localStorage:", storageError);
    }

    return config;
  },
  (error) => {
    console.error("Request Error:", error);
    return Promise.reject(error);
  }
);

// Response Interceptor
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const { response, config: originalRequest } = error;

    if (response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const tenantId = localStorage.getItem("tenantId");
        const refreshToken = localStorage.getItem("refreshtoken");
        if (!refreshToken) {
          showSessionExpired();
          return Promise.reject(
            new Error("Session expired, please log in again")
          );
        }

        const { data } = await axios.post(
          `${config.BackendURL}/auth/refresh/refreshtoken`,
          { refreshToken } // ✅ Correct placement of request body
        );

        if (data?.data?.accesstoken) {
          localStorage.setItem("accesstoken", data.data.accesstoken);
          localStorage.setItem("refreshtoken", data.data.refreshtoken);

          originalRequest.headers.Authorization = `Bearer ${data.data.accesstoken}`;
          return axiosInstance(originalRequest); // Retry request with new token
        } else {
          showSessionExpired();
          return Promise.reject(new Error("Invalid refresh token response"));
        }
      } catch (refreshError) {
        console.error("Token refresh error:", refreshError);
        showSessionExpired();
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export { axiosInstance };
