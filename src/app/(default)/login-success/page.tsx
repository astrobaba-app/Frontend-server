"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function LoginSuccess() {
  const router = useRouter();

  useEffect(() => {
    const isInWebView = typeof window !== "undefined" && (window as any).ReactNativeWebView;
    
    // Notify mobile app that login succeeded (if in WebView)
    if (isInWebView) {
      (window as any).ReactNativeWebView.postMessage(
        JSON.stringify({ 
          type: "LOGIN_SUCCESS" 
        })
      );
    }

    // For regular browsers (mobile or desktop), redirect to home
    // Shorter delay for better UX
    const timer = setTimeout(() => {
      router.replace("/");
    }, isInWebView ? 1000 : 500);

    return () => clearTimeout(timer);
  }, [router]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-yellow-50 to-orange-50">
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
        <p className="text-gray-600 text-sm sm:text-base">Redirecting you to home page...</p>
      </div>
    </div>
  );
}
