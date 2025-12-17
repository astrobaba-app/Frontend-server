"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { colors } from "@/utils/colors";
import {  logoutAstrologer } from "@/store/api/astrologer/auth";
import { getAstrologerProfile } from "@/store/api/astrologer/profile";
import type { AstrologerProfile } from "@/store/api/astrologer/auth";
import AstrologerSidebar from "@/components/layout/AstrologerSidebar";
import { RxCross2 } from "react-icons/rx";
import { IoIosMore } from "react-icons/io";
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
    try {
      await logoutAstrologer();
      if (typeof window !== "undefined") {
        // Clear role flag so header and login logic update immediately
        localStorage.removeItem("auth_role");
        window.dispatchEvent(new Event("auth_role_change"));
      }
      router.push("/astrologer/login");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <div className="min-h-screen py-6 sm:py-8 bg-white relative">
      <div className="max-w-7xl mx-auto px-0 sm:px-6 lg:px-8">
        {/* Mobile header with menu button */}
        <div className="flex items-center justify-between mb-4 lg:hidden">
          <button
            type="button"
            onClick={() => setIsSidebarOpen(true)}
            className="p-2 rounded-full hover:bg-gray-100 transition-colors"
            aria-label="Open menu"
          >
            <IoIosMore className="w-6 h-6 text-gray-800" />
          </button>
          
          <span className="w-6" aria-hidden="true" />
        </div>

        <div className="grid gap-6 lg:grid-cols-[260px_1fr] lg:gap-8 items-start">
          {/* Sidebar - Desktop view */}
          <div className="hidden lg:block">
            <AstrologerSidebar profile={profile} onLogout={handleLogout} />
          </div>

          {/* Main Content - Only this area shows skeleton */}
          <main className="flex-1 w-full overflow-visible lg:overflow-auto">
            {children}
          </main>
        </div>
      </div>

      {/* Mobile sidebar overlay */}
      {isSidebarOpen && (
        <div className="fixed inset-0 z-40 flex lg:hidden">
          <div
            className="flex-1 bg-black/40"
            onClick={() => setIsSidebarOpen(false)}
          />
          <div className="w-80 max-w-full bg-transparent h-full flex flex-col">
            <div className="bg-white shadow-xl h-full p-4 border-l border-[#FFD700] flex flex-col transition-transform duration-300 transform translate-x-0">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold" style={{ color: colors.black }}>
                  Menu
                </h2>
                <button
                  type="button"
                  onClick={() => setIsSidebarOpen(false)}
                  className="p-2 rounded-full hover:bg-gray-100 transition-colors"
                  aria-label="Close menu"
                >
                  <RxCross2 className="w-5 h-5 text-gray-700" />
                </button>
              </div>
              <div className="overflow-y-auto">
                <AstrologerSidebar profile={profile} onLogout={handleLogout} />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
