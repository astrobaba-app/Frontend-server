"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { getCookie } from "@/utils/cookies";

export function useAstrologerAuth() {
  const router = useRouter();

  useEffect(() => {
    const token = getCookie("token_astrologer");
    if (!token) {
      router.push("/astrologer/login");
    }
  }, [router]);

  const isAuthenticated = () => {
    return !!getCookie("token_astrologer");
  };

  return { isAuthenticated };
}
