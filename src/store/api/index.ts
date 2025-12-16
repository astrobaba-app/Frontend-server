import axios, { AxiosInstance, InternalAxiosRequestConfig } from "axios";

const BASE_URL: string = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000/api";

const api: AxiosInstance = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,
});

api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    // Backend now relies on HTTP-only cookies for auth.
    // We no longer attach any tokens from localStorage.
    if (config.data instanceof FormData) {
      delete config.headers["Content-Type"];
    } else {
      config.headers["Content-Type"] = "application/json";
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle 401 errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      if (typeof window !== "undefined") {
        const role = localStorage.getItem("auth_role");
        const currentPath = window.location.pathname;

        // Clear role on unauthorized
        localStorage.removeItem("auth_role");

        if (role === "astrologer") {
          if (!currentPath.startsWith("/astrologer")) {
            window.location.href = "/astrologer/login";
          }
        } else {
          if (!currentPath.startsWith("/auth")) {
            window.location.href = "/auth/login";
          }
        }
      }
    }
    return Promise.reject(error);
  }
);

export default api;