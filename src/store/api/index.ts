import axios, {
  AxiosError,
  AxiosInstance,
  InternalAxiosRequestConfig,
} from "axios";

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

interface RefreshTokenResponse {
  token?: string;
  middlewareToken?: string;
  astrologerToken?: string;
}

interface RetryableRequestConfig extends InternalAxiosRequestConfig {
  _retry?: boolean;
}

type AuthActor = "user" | "astrologer";

interface AuthContext {
  actor: AuthActor;
  refreshPath: string;
  storageKey: "token_middleware" | "token_astrologer";
  redirectPath: string;
}

const api: AxiosInstance = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,
});

let refreshPromise: Promise<string | null> | null = null;

const getAuthContext = (): AuthContext | null => {
  if (typeof window === "undefined") {
    return null;
  }

  const astrologerToken = localStorage.getItem("token_astrologer");
  if (astrologerToken) {
    return {
      actor: "astrologer",
      refreshPath: "/astrologer/auth/refresh-token",
      storageKey: "token_astrologer",
      redirectPath: "/astrologer/login",
    };
  }

  const middlewareToken = localStorage.getItem("token_middleware");
  if (middlewareToken) {
    return {
      actor: "user",
      refreshPath: "/auth/refresh-token",
      storageKey: "token_middleware",
      redirectPath: "/auth/login",
    };
  }

  return null;
};

const clearAuthStateAndRedirect = (actor: AuthActor) => {
  if (typeof window === "undefined") {
    return;
  }

  if (actor === "astrologer") {
    localStorage.removeItem("token_astrologer");
    localStorage.removeItem("astrologer_id");
    window.location.href = "/astrologer/login";
  } else {
    localStorage.removeItem("token_middleware");
    localStorage.removeItem("user_id");
    window.location.href = "/auth/login";
  }

  window.dispatchEvent(new Event("auth_change"));
};

const refreshSessionToken = async (): Promise<string | null> => {
  const authContext = getAuthContext();
  if (!authContext) {
    return null;
  }

  const response = await axios.post<RefreshTokenResponse>(
    authContext.refreshPath,
    {},
    {
      baseURL: BASE_URL,
      withCredentials: true,
      headers: {
        "Content-Type": "application/json",
      },
    }
  );

  const refreshedToken =
    authContext.actor === "astrologer"
      ? response.data.astrologerToken || response.data.token
      : response.data.middlewareToken || response.data.token;

  if (!refreshedToken) {
    throw new Error("Refresh endpoint did not return a token");
  }

  localStorage.setItem(authContext.storageKey, refreshedToken);
  window.dispatchEvent(new Event("auth_change"));
  return refreshedToken;
};

const getRefreshPromise = () => {
  if (!refreshPromise) {
    refreshPromise = refreshSessionToken().finally(() => {
      refreshPromise = null;
    });
  }
  return refreshPromise;
};

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
  async (error: AxiosError) => {
    const status = error.response?.status;
    const originalRequest = error.config as RetryableRequestConfig | undefined;
    const isRefreshRequest = (originalRequest?.url || "").includes("/refresh-token");

    if (
      status === 401 &&
      originalRequest &&
      !originalRequest._retry &&
      !isRefreshRequest
    ) {
      originalRequest._retry = true;

      try {
        const refreshedToken = await getRefreshPromise();
        if (refreshedToken) {
          originalRequest.headers = originalRequest.headers || {};
          originalRequest.headers["Authorization"] = `Bearer ${refreshedToken}`;
          return api(originalRequest);
        }
      } catch {
        // Refresh failed; fallback to existing logout behavior below.
      }
    }

    if (status === 401 && typeof window !== "undefined") {
      const authContext = getAuthContext();
      if (authContext) {
        clearAuthStateAndRedirect(authContext.actor);
      }
    }

    return Promise.reject(error);
  }
);

export default api;
