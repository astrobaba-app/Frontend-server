"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function AstrologerRootPage() {
  const router = useRouter();

  useEffect(() => {
    // Check if astrologer is logged in
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("astrobaba_token");
      if (token) {
        // Redirect to dashboard if logged in
        router.replace("/astrologer/dashboard/profile");
      } else {
        // Redirect to login if not logged in
        router.replace("/astrologer/login");
      }
    }
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-400"></div>
    </div>
  );
}
