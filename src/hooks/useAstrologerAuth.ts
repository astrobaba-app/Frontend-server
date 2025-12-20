"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export function useAstrologerAuth() {
  const router = useRouter();

  useEffect(() => {
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("token_astrologer");
      if (!token) {
        router.push("/astrologer/login");
      }
    }
  }, [router]);

  const isAuthenticated = () => {
    if (typeof window !== "undefined") {
      return !!localStorage.getItem("token_astrologer");
    }
    return false;
  };

  return { isAuthenticated };
}
