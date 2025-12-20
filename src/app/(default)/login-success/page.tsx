"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function LoginSuccess() {
  const router = useRouter();

  useEffect(() => {
    // Notify mobile app that login succeeded
    if (typeof window !== "undefined" && (window as any).ReactNativeWebView) {
      (window as any).ReactNativeWebView.postMessage(
        JSON.stringify({ 
          type: "LOGIN_SUCCESS" 
        })
      );
    }

    // Redirect to home after 1 second
    const timer = setTimeout(() => {
      router.replace("/");
    }, 1000);

    return () => clearTimeout(timer);
  }, [router]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-yellow-50 to-orange-50">
      <div className="text-center p-8">
        <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-yellow-500 mx-auto mb-6"></div>
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Success!</h2>
        <p className="text-gray-600">Logging you in...</p>
      </div>
    </div>
  );
}
