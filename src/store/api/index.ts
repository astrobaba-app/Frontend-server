import axios, { AxiosInstance, InternalAxiosRequestConfig } from "axios";
import { getCookie, deleteCookie } from "@/utils/cookies";

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

const api: AxiosInstance = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,
});

api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const astrologerToken = getCookie('token_astrologer');
    const middlewareToken = getCookie('token_middleware');
    
    const token = astrologerToken || middlewareToken;
    
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
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

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      if (typeof window !== "undefined") {
        const currentPath = window.location.pathname;
        const astrologerToken = getCookie("token_astrologer");
        const middlewareToken = getCookie("token_middleware");

        if (astrologerToken) {
          deleteCookie("token_astrologer");
          deleteCookie("astrologer_id");
           deleteCookie("token");
          window.location.href = "/astrologer/login";
        } else if (middlewareToken) {
          deleteCookie("token_middleware");
          deleteCookie("user_id");
           deleteCookie("token");
          window.location.href = `/auth/login?redirect=${currentPath}`;
        }
        
        window.dispatchEvent(new Event("auth_change"));
      }
    }
    return Promise.reject(error);
  }
);

export default api;
