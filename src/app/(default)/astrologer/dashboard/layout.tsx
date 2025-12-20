"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { colors } from "@/utils/colors";
import {  logoutAstrologer } from "@/store/api/astrologer/auth";
import { getAstrologerProfile } from "@/store/api/astrologer/profile";
import type { AstrologerProfile } from "@/store/api/astrologer/auth";
import AstrologerSidebar from "@/components/layout/AstrologerSidebar";
import { RxCross2 } from "react-icons/rx";
import { IoIosMenu } from "react-icons/io";

export default function AstrologerDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const [profile, setProfile] = useState<AstrologerProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  useEffect(() => {
    fetchProfile();
  }, []);

  useEffect(() => {
    const handleProfileUpdated = (event: Event) => {
      try {
        const customEvent = event as CustomEvent<AstrologerProfile>;
        if (customEvent.detail) {
          setProfile(customEvent.detail);
        }
      } catch (e) {
        console.error("Failed to handle astrologer_profile_updated", e);
      }
    };

    if (typeof window !== "undefined") {
      window.addEventListener("astrologer_profile_updated", handleProfileUpdated);
    }

    return () => {
      if (typeof window !== "undefined") {
        window.removeEventListener("astrologer_profile_updated", handleProfileUpdated);
      }
    };
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
    if (typeof window !== "undefined") {
      // Clear tokens immediately
      localStorage.removeItem("token_astrologer");
      localStorage.removeItem("astrologer_id");
      window.dispatchEvent(new Event("auth_change"));
    }
    
    // Redirect immediately
    window.location.href = "/";
    
    // Call API in background (non-blocking)
    try {
      await logoutAstrologer();
    } catch (error) {
      console.error("Logout API error:", error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50/50">
      {/* MOBILE STICKY HEADER */}
      <div className="sticky top-0 z-40 lg:hidden bg-white/80 backdrop-blur-md border-b border-gray-100 px-4 py-3">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-yellow-400 flex items-center justify-center overflow-hidden shrink-0 shadow-sm">
              {profile?.photo ? (
                <img
                  src={profile.photo}
                  alt={profile.fullName}
                  className="w-full h-full object-cover"
                />
              ) : (
                <span className="text-white font-bold">
                  {profile?.fullName?.charAt(0).toUpperCase() || "A"}
                </span>
              )}
            </div>
            <div>
              <h1 className="text-sm font-bold text-gray-900 leading-none">
                {profile?.fullName || "Astrologer"}
              </h1>
              <p className="text-[10px] text-gray-500 mt-1 uppercase tracking-wider font-medium">Dashboard</p>
            </div>
          </div>
          <button
            onClick={() => setIsSidebarOpen(true)}
            className="p-2 bg-yellow-50 rounded-lg text-yellow-700 hover:bg-yellow-100 transition-colors"
          >
            <IoIosMenu className="w-6 h-6" />
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8">
        <div className="grid gap-6 lg:grid-cols-[300px_1fr] items-start">
          {/* DESKTOP SIDEBAR - Sticky so it stays visible while scrolling content */}
          <aside className="hidden lg:block sticky top-8">
            <AstrologerSidebar profile={profile} onLogout={handleLogout} />
          </aside>

          {/* DYNAMIC CONTENT - Only this section changes on tab navigation */}
          <main className="w-full transition-all duration-300">
            {children}
          </main>
        </div>
      </div>

      {/* MOBILE DRAWER OVERLAY */}
      {isSidebarOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            className="fixed inset-0 bg-black/40 backdrop-blur-sm transition-opacity"
            onClick={() => setIsSidebarOpen(false)}
          />
          <div className="fixed inset-y-0 left-0 w-[280px] bg-white shadow-2xl flex flex-col animate-in slide-in-from-left duration-300">
            <div className="p-4 border-b flex items-center justify-between bg-yellow-50">
              <span className="font-bold text-gray-800">Dashboard Menu</span>
              <button
                onClick={() => setIsSidebarOpen(false)}
                className="p-1 hover:bg-gray-200 rounded-full transition-colors"
              >
                <RxCross2 className="w-6 h-6 text-gray-600" />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto" onClick={() => setIsSidebarOpen(false)}>
              <AstrologerSidebar profile={profile} onLogout={handleLogout} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
