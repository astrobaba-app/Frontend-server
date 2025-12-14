"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function AstrologerDashboardPage() {
  const router = useRouter();

  useEffect(() => {
    router.replace("/astrologer/dashboard/profile");
  }, [router]);

  return null;
}
