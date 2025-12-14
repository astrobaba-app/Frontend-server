import axios, { AxiosInstance, InternalAxiosRequestConfig } from "axios";

const BASE_URL: string = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000/api";

const api: AxiosInstance = axios.create({
  baseURL: BASE_URL,
  withCredentials: true, 
});

api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    // Add token to Authorization header if available
    // Check for both user and astrologer tokens
    if (typeof window !== 'undefined') {
      const userToken = localStorage.getItem('astrobaba_token');
      const astrologerToken = localStorage.getItem('astrologer_token');
      
      // Use whichever token is available (user or astrologer)
      const token = userToken || astrologerToken;
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }

    if (config.data instanceof FormData) {
      delete config.headers['Content-Type'];
    } else {
      config.headers['Content-Type'] = 'application/json';
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
      // Token expired or invalid
      if (typeof window !== 'undefined') {
        const hasUserToken = localStorage.getItem('astrobaba_token');
        const hasAstrologerToken = localStorage.getItem('astrologer_token');
        const currentPath = window.location.pathname;
        
        // Determine which type of user is logged in and clear appropriate tokens
        if (hasAstrologerToken) {
          // Astrologer session expired
          localStorage.removeItem('astrologer_token');
          localStorage.removeItem('astrologer_middleware_token');
          localStorage.removeItem('astrologer_profile');
          
          // Redirect to astrologer login if not already there
          if (!currentPath.includes('/astrologer/login') && !currentPath.includes('/astrologer/signup')) {
            window.location.href = '/astrologer/login';
          }
        } else if (hasUserToken) {
          // User session expired
          localStorage.removeItem('astrobaba_user');
          localStorage.removeItem('astrobaba_token');
          localStorage.removeItem('astrobaba_middleware_token');
          localStorage.removeItem('astrobaba_auth_method');
          
          // Redirect to user login if not already there
          if (!currentPath.includes('/auth/login')) {
            window.location.href = '/auth/login';
          }
        }
      }
    }
    return Promise.reject(error);
  }
);

export default api;