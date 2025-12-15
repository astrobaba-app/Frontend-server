"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { colors } from "@/utils/colors";
import {  logoutAstrologer } from "@/store/api/astrologer/auth";
import { getAstrologerProfile } from "@/store/api/astrologer/profile";
import type { AstrologerProfile } from "@/store/api/astrologer/auth";
import AstrologerSidebar from "@/components/layout/AstrologerSidebar";

export default function AstrologerDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const [profile, setProfile] = useState<AstrologerProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const response = await getAstrologerProfile();
      if (response.success) {
        setProfile(response.astrologer);
      }
    } catch (error) {
      console.error("Failed to fetch profile:", error);
      // Redirect to login if unauthorized
      router.push("/astrologer/login");
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await logoutAstrologer();
      // Clear local storage - astrologer tokens
      if (typeof window !== "undefined") {
        localStorage.removeItem("astrolobaba_token");
        localStorage.removeItem("astrolobaba_middleware_token");
        localStorage.removeItem("astrolobaba_profile");
        
        // Notify header component that astrologer logged out
        window.dispatchEvent(new Event('astrologer-auth-change'));
      }
      router.push("/astrologer/login");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
     <div className="min-h-screen  py-8">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid lg:grid-cols-[300px_1fr] gap-8">
      {/* Sidebar - Always visible, doesn't show loading */}
      <AstrologerSidebar profile={profile} onLogout={handleLogout} />

      {/* Main Content - Only this area shows skeleton */}
      <main className="flex-1 overflow-auto">
        {children}
      </main>
    </div>
    </div>
    </div>
  );
}
