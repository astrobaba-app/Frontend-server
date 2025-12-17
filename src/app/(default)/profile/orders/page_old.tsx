"use client";
import React, { useState } from "react";
import ProfileSidebar from "@/components/layout/UserProfileSidebar";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import Card from "@/components/atoms/Card";
import Heading from "@/components/atoms/Heading";
import { ShoppingBag } from "lucide-react";
import { IoIosMore } from "react-icons/io";
import { RxCross2 } from "react-icons/rx";

export default function OrdersPage() {
  const { user, logout } = useAuth();
  const router = useRouter();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    router.push('/');
  };

  return (
    <div className="min-h-screen py-6 sm:py-8 bg-gray-50 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
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

        <div className="grid gap-6 lg:grid-cols-[300px_1fr] lg:gap-8 items-start">
          {/* Sidebar - Desktop view */}
          <div className="hidden lg:block">
            <ProfileSidebar
              userName={user?.fullName || "User"}
              userEmail={user?.email || "Not provided"}
              onLogout={handleLogout}
            />
          </div>

          {/* Main Content */}
          <Card padding="lg">
            <div className="text-center py-16 sm:py-20">
              <ShoppingBag className="w-16 h-16 sm:w-20 sm:h-20 mx-auto mb-6 text-[#FFD700]" />
              <Heading level={2} className="mb-4">
                My Orders
              </Heading>
              <p className="text-gray-600 text-base sm:text-lg mb-6 sm:mb-8">
                Coming Soon!
              </p>
              <p className="text-gray-500 max-w-md mx-auto text-sm sm:text-base">
                Track all your orders, purchases, and service bookings in one place.
                View order history, download invoices, and manage your transactions effortlessly.
              </p>
            </div>
          </Card>
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
                <h2 className="text-lg font-semibold">Menu</h2>
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
                <ProfileSidebar
                  userName={user?.fullName || "User"}
                  userEmail={user?.email || "Not provided"}
                  onLogout={handleLogout}
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
