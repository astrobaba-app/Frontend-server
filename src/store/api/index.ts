import axios, { AxiosInstance, InternalAxiosRequestConfig } from "axios";

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

const api: AxiosInstance = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,
});

api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    // Attach tokens from localStorage
    if (typeof window !== 'undefined') {
      const astrologerToken = localStorage.getItem('token_astrologer');
      const middlewareToken = localStorage.getItem('token_middleware');
      
      // Use astrologer token if available, otherwise use middleware token
      const token = astrologerToken || middlewareToken;
      
      if (token) {
        config.headers['Authorization'] = `Bearer ${token}`;
      }
    }
    
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
        const currentPath = window.location.pathname;
        const astrologerToken = localStorage.getItem("token_astrologer");
        const middlewareToken = localStorage.getItem("token_middleware");

        // Clear tokens on unauthorized
        if (astrologerToken) {
          localStorage.removeItem("token_astrologer");
          localStorage.removeItem("astrologer_id");
          window.location.href = "/astrologer/login";
        } else if (middlewareToken) {
          localStorage.removeItem("token_middleware");
          localStorage.removeItem("user_id");
          window.location.href = "/auth/login";
        }
        
        window.dispatchEvent(new Event("auth_change"));
      }
    }
    return Promise.reject(error);
  }
);

export default api;
