"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

interface ReactNativeWebViewBridge {
  postMessage: (message: string) => void;
}

interface WindowWithReactNativeWebView extends Window {
  ReactNativeWebView?: ReactNativeWebViewBridge;
}

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:6001/api";

const getCookieValue = (cookieName: string): string | null => {
  if (typeof document === "undefined") {
    return null;
  }

  const cookies = document.cookie.split(";");
  for (const cookie of cookies) {
    const [name, value] = cookie.trim().split("=");
    if (name === cookieName && value) {
      return value;
    }
  }

  return null;
};

const fetchMiddlewareTokenFromRefresh = async (): Promise<string | null> => {
  try {
    const response = await fetch(`${API_BASE_URL}/auth/refresh-token`, {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      return null;
    }

    const data = await response.json();
    return data.middlewareToken || data.token || null;
  } catch {
    return null;
  }
};

export default function LoginSuccess() {
  const router = useRouter();

  useEffect(() => {
    let isMounted = true;
    let timer: ReturnType<typeof setTimeout> | null = null;

    const completeOAuthLogin = async () => {
      const appWindow = window as WindowWithReactNativeWebView;
      const isInWebView = Boolean(appWindow.ReactNativeWebView);

      let middlewareToken = getCookieValue("token_middleware");
      if (!middlewareToken) {
        middlewareToken = await fetchMiddlewareTokenFromRefresh();
      }

      if (!isMounted) {
        return;
      }

      if (middlewareToken) {
        localStorage.setItem("token_middleware", middlewareToken);
        window.dispatchEvent(new Event("auth_change"));
        sessionStorage.setItem("loginSuccess", "true");
      }

      if (isInWebView) {
        if (middlewareToken) {
          appWindow.ReactNativeWebView?.postMessage(
            JSON.stringify({
              type: "AUTH_STATUS",
              isAuthenticated: true,
              token: middlewareToken,
              role: "user",
            })
          );
        }

        appWindow.ReactNativeWebView?.postMessage(
          JSON.stringify({
            type: "LOGIN_SUCCESS",
          })
        );
      }

      const redirectPath = middlewareToken ? "/profile" : "/auth/login?error=auth_failed";
      timer = setTimeout(
        () => {
          if (isMounted) {
            router.replace(redirectPath);
          }
        },
        isInWebView ? 900 : 450
      );
    };

    completeOAuthLogin();

    return () => {
      isMounted = false;
      if (timer) {
        clearTimeout(timer);
      }
    };
  }, [router]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-linear-to-br from-yellow-50 to-orange-50">
      <div className="text-center p-8 max-w-md mx-auto">
        {/* Success Icon */}
        <div className="mb-6 flex justify-center">
          <div className="relative">
            <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-yellow-500"></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <svg className="w-8 h-8 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
              </svg>
            </div>
          </div>
        </div>
        
        <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-2">Login Successful!</h2>
        <p className="text-gray-600 text-sm sm:text-base">Redirecting you to your profile...</p>
      </div>
    </div>
  );
}
