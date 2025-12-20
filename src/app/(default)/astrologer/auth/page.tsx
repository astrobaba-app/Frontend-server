"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function AstrologerRootPage() {
  const router = useRouter();

  useEffect(() => {
    if (typeof window !== "undefined") {
      const astrologerToken = localStorage.getItem("token_astrologer");
      const middlewareToken = localStorage.getItem("token_middleware");

      if (astrologerToken) {
        router.replace("/astrologer/dashboard");
      } else if (middlewareToken) {
        router.replace("/profile");
      } else {
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
