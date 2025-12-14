"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export function useAstrologerAuth() {
  const router = useRouter();

  useEffect(() => {
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("astrobaba_token");
      if (!token) {
        router.push("/astrologer/login");
      }
    }
  }, [router]);

  const isAuthenticated = () => {
    if (typeof window !== "undefined") {
      return !!localStorage.getItem("astrobaba_token");
    }
    return false;
  };

  return { isAuthenticated };
}
