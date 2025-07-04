import axios from "axios";
import { getAuth } from "firebase/auth";

export const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  // withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request Interceptor — Adds Fresh Access Token
axiosInstance.interceptors.request.use(
  async (config) => {
    const auth = getAuth();
    const user = auth.currentUser;

    if (user) {
      const token = await user.getIdToken();
      console.log("axios instance token===", token);
      config.headers["Authorization"] = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// Response Interceptor — Handles Token Expiry with Forced Refresh
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (
      error.response &&
      error.response.status === 401 &&
      !originalRequest._retry
    ) {
      originalRequest._retry = true;

      try {
        const auth = getAuth();
        const user = auth.currentUser;

        if (user) {
          const newAccessToken = await user.getIdToken(true);

          originalRequest.headers["Authorization"] = `Bearer ${newAccessToken}`;
          return axiosInstance(originalRequest);
        } else {
          console.error("User not authenticated");
          return Promise.reject(error);
        }
      } catch (refreshError) {
        console.error("Firebase token refresh failed", refreshError);
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);
