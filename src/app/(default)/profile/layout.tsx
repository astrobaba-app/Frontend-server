"use client";
import React, { useState } from "react";
import ProfileSidebar from "@/components/layout/UserProfileSidebar";
import { useAuth } from "@/contexts/AuthContext";
import { IoIosMenu } from "react-icons/io";
import { RxCross2 } from "react-icons/rx";
import { useRouter } from "next/navigation";
import { deleteCookie } from "@/utils/cookies";

export default function ProfileLayout({ children }: { children: React.ReactNode }) {
  const { user, logout } = useAuth();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const router = useRouter();

  const handleLogout = async () => {
    deleteCookie('token_middleware');
    deleteCookie('user_id');
     deleteCookie("token");
    window.dispatchEvent(new Event('auth_change'));
    logout();
    window.location.href = "/";
  };

  return (
    <div className="min-h-screen bg-gray-50/50">
      {/* MOBILE STICKY HEADER */}
      <div className="sticky top-0 z-40 lg:hidden bg-white/80 backdrop-blur-md border-b border-gray-100 px-4 py-3">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-yellow-400 flex items-center justify-center text-white font-bold shadow-sm">
              {user?.fullName?.charAt(0).toUpperCase() || "U"}
            </div>
            <div>
              <h1 className="text-sm font-bold text-gray-900 leading-none">
                {user?.fullName || "User"}
              </h1>
              <p className="text-[10px] text-gray-500 mt-1 uppercase tracking-wider font-medium">Account Settings</p>
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
            <ProfileSidebar
              userName={user?.fullName || "User"}
              userEmail={user?.email || "Not provided"}
              onLogout={handleLogout}
            />
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
              <span className="font-bold text-gray-800">Account Menu</span>
              <button
                onClick={() => setIsSidebarOpen(false)}
                className="p-1 hover:bg-gray-200 rounded-full transition-colors"
              >
                <RxCross2 className="w-6 h-6 text-gray-600" />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto" onClick={() => setIsSidebarOpen(false)}>
              <ProfileSidebar
                userName={user?.fullName || "User"}
                userEmail={user?.email || "Not provided"}
                onLogout={handleLogout}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}